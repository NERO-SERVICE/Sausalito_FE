import { STORAGE_KEYS, readJson, writeJson } from "./storage.js";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1").replace(/\/$/, "");

let refreshPromise = null;

export class ApiError extends Error {
  constructor(message, status = 500, code = "API_ERROR", details = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function getStoredTokens() {
  return readJson(STORAGE_KEYS.tokens, null);
}

export function setStoredTokens(tokens) {
  writeJson(STORAGE_KEYS.tokens, tokens);
}

export function clearStoredTokens() {
  writeJson(STORAGE_KEYS.tokens, null);
}

function buildUrl(path, query = {}) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`);

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

async function parseJson(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function toApiError(status, payload) {
  const errorPayload = payload?.error || {};
  const message =
    errorPayload.message || payload?.message || "요청 처리 중 오류가 발생했습니다.";
  return new ApiError(message, status, errorPayload.code || "API_ERROR", errorPayload.details || {});
}

async function refreshAccessToken() {
  const tokens = getStoredTokens();
  if (!tokens?.refresh) return false;
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const response = await fetch(buildUrl("/auth/refresh"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: tokens.refresh }),
    });

    const payload = await parseJson(response);
    if (!response.ok || payload?.success === false) {
      clearStoredTokens();
      writeJson(STORAGE_KEYS.user, null);
      return false;
    }

    const data = payload?.data || payload;
    if (!data?.access) {
      clearStoredTokens();
      writeJson(STORAGE_KEYS.user, null);
      return false;
    }

    setStoredTokens({
      access: data.access,
      refresh: data.refresh || tokens.refresh,
    });
    return true;
  })()
    .catch(() => {
      clearStoredTokens();
      writeJson(STORAGE_KEYS.user, null);
      return false;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export async function apiRequest(
  path,
  {
    method = "GET",
    query = {},
    body,
    auth = true,
    isForm = false,
    retryOnAuth = true,
  } = {},
) {
  const headers = {};
  const tokens = getStoredTokens();

  if (!isForm) {
    headers["Content-Type"] = "application/json";
  }

  if (auth && tokens?.access) {
    headers.Authorization = `Bearer ${tokens.access}`;
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body
      ? isForm
        ? body
        : JSON.stringify(body)
      : undefined,
  });

  const payload = await parseJson(response);

  if (response.status === 401 && auth && retryOnAuth && tokens?.refresh) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiRequest(path, {
        method,
        query,
        body,
        auth,
        isForm,
        retryOnAuth: false,
      });
    }
  }

  if (!response.ok || payload?.success === false) {
    throw toApiError(response.status, payload);
  }

  return payload?.data !== undefined ? payload.data : payload;
}

function extractResults(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  return [];
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

function normalizeProductBase(raw = {}) {
  const rating = Number(raw.rating ?? raw.rating_avg ?? raw.review_summary?.avg ?? 0);
  const reviews = Number(raw.reviews ?? raw.review_count ?? raw.review_summary?.count ?? 0);

  return {
    id: raw.id,
    name: raw.name || "",
    oneLine: raw.oneLine ?? raw.one_line ?? "",
    description: raw.description || "",
    price: Number(raw.price || 0),
    originalPrice: Number(raw.originalPrice ?? raw.original_price ?? raw.price ?? 0),
    stock: Number(raw.stock || 0),
    badges: Array.isArray(raw.badges) ? raw.badges : [],
    rating,
    reviews,
    popularScore: Number(raw.popularScore ?? raw.popular_score ?? 0),
    releaseDate: raw.releaseDate ?? raw.release_date ?? "",
    image:
      raw.image ||
      raw.images?.find((img) => img.is_thumbnail)?.url ||
      raw.images?.[0]?.url ||
      "",
  };
}

function normalizeProductDetail(raw = {}) {
  const base = normalizeProductBase(raw);
  return {
    ...base,
    intake: raw.intake || "",
    target: raw.target || "",
    ingredients: Array.isArray(raw.ingredients) ? raw.ingredients : [],
    cautions: Array.isArray(raw.cautions) ? raw.cautions : [],
    faq: Array.isArray(raw.faq) ? raw.faq : [],
    images: Array.isArray(raw.images) ? raw.images.map((img) => img.url).filter(Boolean) : [],
    options: Array.isArray(raw.options)
      ? raw.options.map((option) => ({
          id: option.id,
          name: option.name,
          price: Number(option.price || 0),
          stock: Number(option.stock || 0),
        }))
      : [],
  };
}

function defaultDetailMeta() {
  return {
    couponText: "",
    shippingFee: 3000,
    freeShippingThreshold: 50000,
    interestFreeText: "",
    purchaseTypes: [],
    subscriptionBenefit: "",
    optionsLabel: "상품구성",
    options: [],
    addOns: [],
    todayShipText: "",
    inquiryCount: 0,
    detailImages: [],
  };
}

function normalizeDetailMeta(raw) {
  if (!raw) return defaultDetailMeta();
  return {
    couponText: raw.coupon_text || "",
    shippingFee: Number(raw.shipping_fee || 3000),
    freeShippingThreshold: Number(raw.free_shipping_threshold || 50000),
    interestFreeText: raw.interest_free_text || "",
    purchaseTypes: Array.isArray(raw.purchase_types) ? raw.purchase_types : [],
    subscriptionBenefit: raw.subscription_benefit || "",
    optionsLabel: raw.options_label || "상품구성",
    options: Array.isArray(raw.options)
      ? raw.options.map((option) => ({
          id: option.id,
          name: option.name,
          price: Number(option.price || 0),
          stock: Number(option.stock || 0),
        }))
      : [],
    addOns: Array.isArray(raw.add_ons) ? raw.add_ons : [],
    todayShipText: raw.today_ship_text || "",
    inquiryCount: Number(raw.inquiry_count || 0),
    detailImages: Array.isArray(raw.detail_images) ? raw.detail_images : [],
  };
}

function normalizeReview(raw = {}) {
  return {
    id: raw.id,
    productId: Number(raw.productId ?? raw.product_id ?? raw.product?.id ?? 0),
    user: raw.user || raw.user_masked || "익명",
    score: Number(raw.score || 0),
    text: raw.text || raw.content || "",
    date: raw.date || formatDate(raw.created_at),
    helpful: Number(raw.helpful ?? raw.helpful_count ?? 0),
    image: raw.image || raw.images?.[0]?.url || "",
    createdAt: raw.created_at || null,
  };
}

async function fetchReviewsWithPagination({ productId, sort = "latest", hasImage, pageSize = 100 } = {}) {
  let page = 1;
  let count = null;
  const merged = [];

  while (page <= 100) {
    const data = await apiRequest("/reviews", {
      query: {
        product_id: productId,
        sort,
        has_image: typeof hasImage === "boolean" ? String(hasImage) : undefined,
        page,
        page_size: pageSize,
      },
      auth: false,
      retryOnAuth: false,
    });

    const results = extractResults(data);
    merged.push(...results.map(normalizeReview));

    if (typeof data?.count === "number") {
      count = data.count;
    }

    if (!data?.next) break;
    if (count !== null && merged.length >= count) break;
    page += 1;
  }

  return merged;
}

export async function apiLogin({ email, password }) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
    retryOnAuth: false,
  });
}

export async function apiLogout({ refresh }) {
  return apiRequest("/auth/logout", {
    method: "POST",
    body: { refresh },
  });
}

export async function apiFetchMe() {
  return apiRequest("/users/me");
}

export async function fetchProducts({ q, sort, minPrice, maxPrice } = {}) {
  const data = await apiRequest("/products", {
    query: {
      q,
      sort,
      min_price: minPrice,
      max_price: maxPrice,
      page_size: 100,
    },
    auth: false,
    retryOnAuth: false,
  });

  return extractResults(data).map(normalizeProductBase);
}

export async function fetchProductById(id) {
  if (!id) return null;
  const data = await apiRequest(`/products/${id}`, {
    auth: false,
    retryOnAuth: false,
  });
  return normalizeProductDetail(data);
}

export async function fetchProductDetailMeta(id) {
  if (!id) return defaultDetailMeta();
  const data = await apiRequest(`/products/${id}/detail-meta`, {
    auth: false,
    retryOnAuth: false,
  });
  return normalizeDetailMeta(data);
}

export async function fetchReviewsByProduct(id) {
  if (!id) return [];
  return fetchReviewsWithPagination({ productId: id, sort: "latest", pageSize: 100 });
}

export async function fetchHomeBanners() {
  return apiRequest("/banners/home", {
    auth: false,
    retryOnAuth: false,
  });
}

export async function fetchFeaturedReviews(limit = 6) {
  const data = await apiRequest("/reviews", {
    query: {
      sort: "helpful",
      page_size: limit,
      page: 1,
    },
    auth: false,
    retryOnAuth: false,
  });

  return extractResults(data).map(normalizeReview).slice(0, limit);
}

export async function fetchAllReviews() {
  return fetchReviewsWithPagination({ sort: "latest", pageSize: 100 });
}

export async function createReview({ productId, score, title, content, images = [] }) {
  const formData = new FormData();
  formData.append("product_id", String(productId));
  formData.append("score", String(score));
  formData.append("title", title || "");
  formData.append("content", content || "");

  images.forEach((file) => {
    formData.append("images", file);
  });

  const data = await apiRequest("/reviews", {
    method: "POST",
    body: formData,
    isForm: true,
  });

  return normalizeReview(data);
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

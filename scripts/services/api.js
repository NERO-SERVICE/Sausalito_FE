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
  const images = Array.isArray(raw.images)
    ? raw.images
        .map((item) => {
          if (typeof item === "string") return item;
          if (item && typeof item === "object") return item.url || "";
          return "";
        })
        .filter(Boolean)
    : [];
  const primaryImage = raw.image || images[0] || "";

  return {
    id: raw.id,
    productId: Number(raw.productId ?? raw.product_id ?? raw.product?.id ?? 0),
    user: raw.user || raw.user_masked || "익명",
    score: Number(raw.score || 0),
    text: raw.text || raw.content || "",
    date: raw.date || formatDate(raw.created_at),
    helpful: Number(raw.helpful ?? raw.helpful_count ?? 0),
    image: primaryImage,
    images,
    createdAt: raw.created_at || null,
  };
}

function normalizeOrderSummary(raw = {}) {
  return {
    id: raw.id,
    orderNo: raw.order_no || raw.orderNo || "",
    status: raw.status || "",
    paymentStatus: raw.payment_status || raw.paymentStatus || "",
    totalAmount: Number(raw.total_amount ?? raw.totalAmount ?? 0),
    createdAt: raw.created_at || raw.createdAt || null,
    recipient: raw.recipient || "",
    itemCount: Array.isArray(raw.items) ? raw.items.length : 0,
    items: Array.isArray(raw.items) ? raw.items : [],
  };
}

function normalizeMoneyHistory(raw = {}) {
  return {
    id: raw.id,
    txType: raw.tx_type || raw.txType || "",
    amount: Number(raw.amount || 0),
    balanceAfter: Number(raw.balance_after ?? raw.balanceAfter ?? 0),
    description: raw.description || "",
    createdAt: raw.created_at || raw.createdAt || null,
  };
}

function normalizeCoupon(raw = {}) {
  return {
    id: raw.id,
    name: raw.name || "",
    code: raw.code || "",
    discountAmount: Number(raw.discount_amount ?? raw.discountAmount ?? 0),
    minOrderAmount: Number(raw.min_order_amount ?? raw.minOrderAmount ?? 0),
    expiresAt: raw.expires_at || raw.expiresAt || null,
    isUsed: Boolean(raw.is_used ?? raw.isUsed),
    usedAt: raw.used_at || raw.usedAt || null,
    isExpired: Boolean(raw.is_expired ?? raw.isExpired),
    createdAt: raw.created_at || raw.createdAt || null,
  };
}

function normalizeMyPageDashboard(raw = {}) {
  const shopping = raw.shopping || {};
  const activity = raw.activity || {};
  const summary = shopping.summary || {};

  return {
    shopping: {
      summary: {
        orderCount: Number(summary.order_count ?? summary.orderCount ?? 0),
        pointBalance: Number(summary.point_balance ?? summary.pointBalance ?? 0),
        depositBalance: Number(summary.deposit_balance ?? summary.depositBalance ?? 0),
        couponCount: Number(summary.coupon_count ?? summary.couponCount ?? 0),
      },
      orders: Array.isArray(shopping.orders) ? shopping.orders.map(normalizeOrderSummary) : [],
      pointHistory: Array.isArray(shopping.point_history)
        ? shopping.point_history.map(normalizeMoneyHistory)
        : [],
      depositHistory: Array.isArray(shopping.deposit_history)
        ? shopping.deposit_history.map(normalizeMoneyHistory)
        : [],
      couponHistory: Array.isArray(shopping.coupon_history)
        ? shopping.coupon_history.map(normalizeCoupon)
        : [],
    },
    activity: {
      recentProducts: Array.isArray(activity.recent_products)
        ? activity.recent_products.map(normalizeProductBase)
        : [],
      wishlistProducts: Array.isArray(activity.wishlist_products)
        ? activity.wishlist_products.map(normalizeProductBase)
        : [],
      myReviews: Array.isArray(activity.my_reviews)
        ? activity.my_reviews.map(normalizeReview)
        : [],
    },
    profile: raw.profile || null,
    inquiries: Array.isArray(raw.inquiries) ? raw.inquiries : [],
  };
}

function normalizeAdminOrder(raw = {}) {
  return {
    id: raw.id,
    orderNo: raw.order_no || raw.orderNo || "",
    userEmail: raw.user_email || raw.userEmail || "",
    userName: raw.user_name || raw.userName || "",
    status: raw.status || "",
    paymentStatus: raw.payment_status || raw.paymentStatus || "",
    shippingStatus: raw.shipping_status || raw.shippingStatus || "",
    subtotalAmount: Number(raw.subtotal_amount ?? raw.subtotalAmount ?? 0),
    shippingFee: Number(raw.shipping_fee ?? raw.shippingFee ?? 0),
    discountAmount: Number(raw.discount_amount ?? raw.discountAmount ?? 0),
    totalAmount: Number(raw.total_amount ?? raw.totalAmount ?? 0),
    recipient: raw.recipient || "",
    phone: raw.phone || "",
    courierName: raw.courier_name || raw.courierName || "",
    trackingNo: raw.tracking_no || raw.trackingNo || "",
    invoiceIssuedAt: raw.invoice_issued_at || raw.invoiceIssuedAt || null,
    shippedAt: raw.shipped_at || raw.shippedAt || null,
    deliveredAt: raw.delivered_at || raw.deliveredAt || null,
    createdAt: raw.created_at || raw.createdAt || null,
    itemCount: Number(raw.item_count ?? raw.itemCount ?? 0),
  };
}

function normalizeAdminInquiry(raw = {}) {
  return {
    id: raw.id,
    userEmail: raw.user_email || raw.userEmail || "",
    userName: raw.user_name || raw.userName || "",
    title: raw.title || "",
    content: raw.content || "",
    status: raw.status || "",
    answer: raw.answer || "",
    answeredAt: raw.answered_at || raw.answeredAt || null,
    createdAt: raw.created_at || raw.createdAt || null,
    updatedAt: raw.updated_at || raw.updatedAt || null,
  };
}

function normalizeAdminReview(raw = {}) {
  return {
    id: raw.id,
    productId: Number(raw.product_id ?? raw.productId ?? 0),
    productName: raw.product_name || raw.productName || "",
    userEmail: raw.user_email || raw.userEmail || "",
    userName: raw.user_name || raw.userName || "",
    score: Number(raw.score || 0),
    title: raw.title || "",
    content: raw.content || "",
    status: raw.status || "",
    helpfulCount: Number(raw.helpful_count ?? raw.helpfulCount ?? 0),
    createdAt: raw.created_at || raw.createdAt || null,
    images: Array.isArray(raw.images) ? raw.images.filter(Boolean) : [],
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

export async function fetchMyPageDashboard() {
  const data = await apiRequest("/users/me/dashboard");
  return normalizeMyPageDashboard(data);
}

export async function updateMyProfile({ name, phone }) {
  return apiRequest("/users/me", {
    method: "PATCH",
    body: { name, phone },
  });
}

export async function changeMyPassword({ oldPassword, newPassword, newPasswordConfirm }) {
  return apiRequest("/users/me/password", {
    method: "POST",
    body: {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    },
  });
}

export async function fetchWishlistItems() {
  const data = await apiRequest("/users/me/wishlist");
  return Array.isArray(data) ? data.map(normalizeProductBase) : [];
}

export async function addWishlistItem(productId) {
  const data = await apiRequest("/users/me/wishlist", {
    method: "POST",
    body: { product_id: productId },
  });
  return normalizeProductBase(data || {});
}

export async function removeWishlistItem(productId) {
  return apiRequest(`/users/me/wishlist/${productId}`, {
    method: "DELETE",
  });
}

export async function trackRecentProduct(productId) {
  return apiRequest("/users/me/recent-products", {
    method: "POST",
    body: { product_id: productId },
  });
}

export async function createMyInquiry({ title, content }) {
  return apiRequest("/users/me/inquiries", {
    method: "POST",
    body: { title, content },
  });
}

export async function fetchAdminDashboard() {
  const data = await apiRequest("/admin/dashboard");
  const summary = data?.summary || {};

  return {
    summary: {
      totalOrders: Number(summary.total_orders ?? summary.totalOrders ?? 0),
      paidOrders: Number(summary.paid_orders ?? summary.paidOrders ?? 0),
      totalOrderAmount: Number(summary.total_order_amount ?? summary.totalOrderAmount ?? 0),
      totalPaidAmount: Number(summary.total_paid_amount ?? summary.totalPaidAmount ?? 0),
      todayPaidAmount: Number(summary.today_paid_amount ?? summary.todayPaidAmount ?? 0),
      shippingPendingCount: Number(summary.shipping_pending_count ?? summary.shippingPendingCount ?? 0),
      shippingShippedCount: Number(summary.shipping_shipped_count ?? summary.shippingShippedCount ?? 0),
      shippingDeliveredCount: Number(summary.shipping_delivered_count ?? summary.shippingDeliveredCount ?? 0),
      openInquiryCount: Number(summary.open_inquiry_count ?? summary.openInquiryCount ?? 0),
      hiddenReviewCount: Number(summary.hidden_review_count ?? summary.hiddenReviewCount ?? 0),
    },
    recentOrders: Array.isArray(data?.recent_orders) ? data.recent_orders.map(normalizeAdminOrder) : [],
    recentInquiries: Array.isArray(data?.recent_inquiries)
      ? data.recent_inquiries.map(normalizeAdminInquiry)
      : [],
    recentReviews: Array.isArray(data?.recent_reviews) ? data.recent_reviews.map(normalizeAdminReview) : [],
  };
}

export async function fetchAdminOrders({ q, status, paymentStatus, shippingStatus, limit = 80 } = {}) {
  const data = await apiRequest("/admin/orders", {
    query: {
      q,
      status,
      payment_status: paymentStatus,
      shipping_status: shippingStatus,
      limit,
    },
  });
  return Array.isArray(data) ? data.map(normalizeAdminOrder) : [];
}

export async function updateAdminOrder(orderNo, payload = {}) {
  const body = {};
  if (payload.status !== undefined) body.status = payload.status;
  if (payload.paymentStatus !== undefined) body.payment_status = payload.paymentStatus;
  if (payload.shippingStatus !== undefined) body.shipping_status = payload.shippingStatus;
  if (payload.courierName !== undefined) body.courier_name = payload.courierName;
  if (payload.trackingNo !== undefined) body.tracking_no = payload.trackingNo;
  if (payload.issueInvoice !== undefined) body.issue_invoice = payload.issueInvoice;
  if (payload.markDelivered !== undefined) body.mark_delivered = payload.markDelivered;

  const data = await apiRequest(`/admin/orders/${orderNo}`, {
    method: "PATCH",
    body,
  });
  return normalizeAdminOrder(data || {});
}

export async function fetchAdminInquiries({ status } = {}) {
  const data = await apiRequest("/admin/inquiries", {
    query: { status },
  });
  return Array.isArray(data) ? data.map(normalizeAdminInquiry) : [];
}

export async function answerAdminInquiry(inquiryId, { answer, status } = {}) {
  const data = await apiRequest(`/admin/inquiries/${inquiryId}/answer`, {
    method: "PATCH",
    body: { answer, status },
  });
  return normalizeAdminInquiry(data || {});
}

export async function fetchAdminReviews({ status, productId } = {}) {
  const data = await apiRequest("/admin/reviews", {
    query: {
      status,
      product_id: productId,
    },
  });
  return Array.isArray(data) ? data.map(normalizeAdminReview) : [];
}

export async function setAdminReviewVisibility(reviewId, visible) {
  const data = await apiRequest(`/admin/reviews/${reviewId}/visibility`, {
    method: "PATCH",
    body: { visible: Boolean(visible) },
  });
  return normalizeAdminReview(data || {});
}

export async function fetchAdminCoupons({ q, isUsed } = {}) {
  const data = await apiRequest("/admin/coupons", {
    query: {
      q,
      is_used: typeof isUsed === "boolean" ? String(isUsed) : undefined,
    },
  });
  return Array.isArray(data)
    ? data.map((coupon) => ({
        id: coupon.id,
        userEmail: coupon.user_email || coupon.userEmail || "",
        name: coupon.name || "",
        code: coupon.code || "",
        discountAmount: Number(coupon.discount_amount ?? coupon.discountAmount ?? 0),
        minOrderAmount: Number(coupon.min_order_amount ?? coupon.minOrderAmount ?? 0),
        expiresAt: coupon.expires_at || coupon.expiresAt || null,
        isUsed: Boolean(coupon.is_used ?? coupon.isUsed),
        usedAt: coupon.used_at || coupon.usedAt || null,
        isExpired: Boolean(coupon.is_expired ?? coupon.isExpired),
        createdAt: coupon.created_at || coupon.createdAt || null,
      }))
    : [];
}

export async function issueAdminCoupon({
  target,
  email,
  name,
  code,
  discountAmount,
  minOrderAmount,
  expiresAt,
}) {
  return apiRequest("/admin/coupons", {
    method: "POST",
    body: {
      target,
      email,
      name,
      code,
      discount_amount: discountAmount,
      min_order_amount: minOrderAmount,
      expires_at: expiresAt || null,
    },
  });
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

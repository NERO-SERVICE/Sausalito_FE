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

function createIdempotencyKey(prefix = "fe") {
  const randomPart =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().replace(/-/g, "")
      : `${Date.now()}${Math.random().toString(16).slice(2)}`;
  return `${prefix}_${randomPart}`.slice(0, 64);
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
    couponBenefit: normalizeCouponBenefit(raw.coupon_benefit || raw.couponBenefit || null, base),
  };
}

function normalizeCouponBenefit(raw, product = {}) {
  const basePrice = Number(product.price || 0);
  const baseOriginalPrice = Number(product.originalPrice || basePrice || 0);
  const baseDiscountRate =
    baseOriginalPrice > 0
      ? Math.max(0, Number(((1 - basePrice / baseOriginalPrice) * 100).toFixed(2)))
      : 0;

  const empty = {
    isAuthenticated: false,
    hasAvailableCoupon: false,
    hasEligibleCoupon: false,
    availableCouponCount: 0,
    eligibleCouponCount: 0,
    soonExpiringCouponCount: 0,
    basePrice,
    baseOriginalPrice,
    baseDiscountRate,
    maxExtraDiscountRate: 0,
    maxFinalDiscountRate: baseDiscountRate,
    priceAfterBestCoupon: basePrice,
    marketingCopy: "로그인하면 보유 쿠폰 기반 추가 할인 혜택을 확인할 수 있어요.",
    bestCoupon: null,
    couponItems: [],
  };

  if (!raw || typeof raw !== "object") return empty;

  const couponItems = Array.isArray(raw.coupon_items)
    ? raw.coupon_items.map((item) => ({
        id: Number(item.id || 0),
        name: item.name || "",
        code: item.code || "",
        discountAmount: Number(item.discount_amount ?? item.discountAmount ?? 0),
        minOrderAmount: Number(item.min_order_amount ?? item.minOrderAmount ?? 0),
        expiresAt: item.expires_at || item.expiresAt || null,
        isEligible: Boolean(item.is_eligible ?? item.isEligible),
        requiredAmount: Number(item.required_amount ?? item.requiredAmount ?? 0),
        appliedDiscountAmount: Number(item.applied_discount_amount ?? item.appliedDiscountAmount ?? 0),
        finalPrice: Number(item.final_price ?? item.finalPrice ?? basePrice),
        extraDiscountRate: Number(item.extra_discount_rate ?? item.extraDiscountRate ?? 0),
        finalDiscountRate: Number(item.final_discount_rate ?? item.finalDiscountRate ?? baseDiscountRate),
      }))
    : [];

  const bestCouponRaw = raw.best_coupon || raw.bestCoupon;
  const bestCoupon = bestCouponRaw
    ? {
        id: Number(bestCouponRaw.id || 0),
        name: bestCouponRaw.name || "",
        code: bestCouponRaw.code || "",
        discountAmount: Number(bestCouponRaw.discount_amount ?? bestCouponRaw.discountAmount ?? 0),
        minOrderAmount: Number(bestCouponRaw.min_order_amount ?? bestCouponRaw.minOrderAmount ?? 0),
        expiresAt: bestCouponRaw.expires_at || bestCouponRaw.expiresAt || null,
        isEligible: Boolean(bestCouponRaw.is_eligible ?? bestCouponRaw.isEligible),
        requiredAmount: Number(bestCouponRaw.required_amount ?? bestCouponRaw.requiredAmount ?? 0),
        appliedDiscountAmount: Number(
          bestCouponRaw.applied_discount_amount ?? bestCouponRaw.appliedDiscountAmount ?? 0,
        ),
        finalPrice: Number(bestCouponRaw.final_price ?? bestCouponRaw.finalPrice ?? basePrice),
        extraDiscountRate: Number(bestCouponRaw.extra_discount_rate ?? bestCouponRaw.extraDiscountRate ?? 0),
        finalDiscountRate: Number(bestCouponRaw.final_discount_rate ?? bestCouponRaw.finalDiscountRate ?? baseDiscountRate),
      }
    : null;

  return {
    isAuthenticated: Boolean(raw.is_authenticated ?? raw.isAuthenticated),
    hasAvailableCoupon: Boolean(raw.has_available_coupon ?? raw.hasAvailableCoupon),
    hasEligibleCoupon: Boolean(raw.has_eligible_coupon ?? raw.hasEligibleCoupon),
    availableCouponCount: Number(raw.available_coupon_count ?? raw.availableCouponCount ?? couponItems.length),
    eligibleCouponCount: Number(raw.eligible_coupon_count ?? raw.eligibleCouponCount ?? 0),
    soonExpiringCouponCount: Number(raw.soon_expiring_coupon_count ?? raw.soonExpiringCouponCount ?? 0),
    basePrice: Number(raw.base_price ?? raw.basePrice ?? basePrice),
    baseOriginalPrice: Number(raw.base_original_price ?? raw.baseOriginalPrice ?? baseOriginalPrice),
    baseDiscountRate: Number(raw.base_discount_rate ?? raw.baseDiscountRate ?? baseDiscountRate),
    maxExtraDiscountRate: Number(raw.max_extra_discount_rate ?? raw.maxExtraDiscountRate ?? 0),
    maxFinalDiscountRate: Number(raw.max_final_discount_rate ?? raw.maxFinalDiscountRate ?? baseDiscountRate),
    priceAfterBestCoupon: Number(raw.price_after_best_coupon ?? raw.priceAfterBestCoupon ?? basePrice),
    marketingCopy: raw.marketing_copy || raw.marketingCopy || empty.marketingCopy,
    bestCoupon,
    couponItems,
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
    shippingStatus: raw.shipping_status || raw.shippingStatus || "",
    totalAmount: Number(raw.total_amount ?? raw.totalAmount ?? 0),
    createdAt: raw.created_at || raw.createdAt || null,
    recipient: raw.recipient || "",
    itemCount: Array.isArray(raw.items) ? raw.items.length : 0,
    items: Array.isArray(raw.items) ? raw.items : [],
  };
}

function normalizeBankTransferRequest(raw = {}) {
  const accountInfo = raw.account_info || raw.accountInfo || {};
  return {
    id: raw.id || "",
    orderNo: raw.order_no || raw.orderNo || "",
    status: raw.status || "",
    orderStatus: raw.order_status || raw.orderStatus || "",
    orderPaymentStatus: raw.order_payment_status || raw.orderPaymentStatus || "",
    transferAmount: Number(raw.transfer_amount ?? raw.transferAmount ?? 0),
    bankName: raw.bank_name || raw.bankName || accountInfo.bank_name || accountInfo.bankName || "",
    bankAccountNo:
      raw.bank_account_no || raw.bankAccountNo || accountInfo.bank_account_no || accountInfo.bankAccountNo || "",
    accountHolder:
      raw.account_holder || raw.accountHolder || accountInfo.account_holder || accountInfo.accountHolder || "",
    depositorName: raw.depositor_name || raw.depositorName || "",
    depositorPhone: raw.depositor_phone || raw.depositorPhone || "",
    transferNote: raw.transfer_note || raw.transferNote || "",
    rejectionReason: raw.rejection_reason || raw.rejectionReason || "",
    adminMemo: raw.admin_memo || raw.adminMemo || "",
    approvedAt: raw.approved_at || raw.approvedAt || null,
    rejectedAt: raw.rejected_at || raw.rejectedAt || null,
    createdAt: raw.created_at || raw.createdAt || null,
    updatedAt: raw.updated_at || raw.updatedAt || null,
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
    postalCode: raw.postal_code || raw.postalCode || "",
    roadAddress: raw.road_address || raw.roadAddress || "",
    jibunAddress: raw.jibun_address || raw.jibunAddress || "",
    detailAddress: raw.detail_address || raw.detailAddress || "",
    courierName: raw.courier_name || raw.courierName || "",
    trackingNo: raw.tracking_no || raw.trackingNo || "",
    invoiceIssuedAt: raw.invoice_issued_at || raw.invoiceIssuedAt || null,
    shippedAt: raw.shipped_at || raw.shippedAt || null,
    deliveredAt: raw.delivered_at || raw.deliveredAt || null,
    createdAt: raw.created_at || raw.createdAt || null,
    itemCount: Number(raw.item_count ?? raw.itemCount ?? 0),
    returnRequestCount: Number(raw.return_request_count ?? raw.returnRequestCount ?? 0),
    hasOpenReturn: Boolean(raw.has_open_return ?? raw.hasOpenReturn),
    settlementStatus: raw.settlement_status || raw.settlementStatus || "",
  };
}

function normalizeAdminInquiry(raw = {}) {
  return {
    id: raw.id,
    userEmail: raw.user_email || raw.userEmail || "",
    userName: raw.user_name || raw.userName || "",
    title: raw.title || "",
    content: raw.content || "",
    category: raw.category || "ETC",
    priority: raw.priority || "NORMAL",
    status: raw.status || "",
    channel: raw.channel || "WEB",
    assignedAdminId: Number(raw.assigned_admin_id ?? raw.assignedAdminId ?? 0) || null,
    assignedAdminEmail: raw.assigned_admin_email || raw.assignedAdminEmail || "",
    internalNote: raw.internal_note || raw.internalNote || "",
    answer: raw.answer || "",
    firstResponseAt: raw.first_response_at || raw.firstResponseAt || null,
    answeredAt: raw.answered_at || raw.answeredAt || null,
    resolvedAt: raw.resolved_at || raw.resolvedAt || null,
    slaDueAt: raw.sla_due_at || raw.slaDueAt || null,
    isSlaOverdue: Boolean(raw.is_sla_overdue ?? raw.isSlaOverdue),
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

function normalizeAdminReturnRequest(raw = {}) {
  return {
    id: raw.id,
    orderNo: raw.order_no || raw.orderNo || "",
    userEmail: raw.user_email || raw.userEmail || "",
    status: raw.status || "",
    reasonTitle: raw.reason_title || raw.reasonTitle || "",
    reasonDetail: raw.reason_detail || raw.reasonDetail || "",
    requestedAmount: Number(raw.requested_amount ?? raw.requestedAmount ?? 0),
    approvedAmount: Number(raw.approved_amount ?? raw.approvedAmount ?? 0),
    rejectedReason: raw.rejected_reason || raw.rejectedReason || "",
    pickupCourierName: raw.pickup_courier_name || raw.pickupCourierName || "",
    pickupTrackingNo: raw.pickup_tracking_no || raw.pickupTrackingNo || "",
    adminNote: raw.admin_note || raw.adminNote || "",
    requestedAt: raw.requested_at || raw.requestedAt || null,
    approvedAt: raw.approved_at || raw.approvedAt || null,
    receivedAt: raw.received_at || raw.receivedAt || null,
    refundedAt: raw.refunded_at || raw.refundedAt || null,
    closedAt: raw.closed_at || raw.closedAt || null,
    updatedAt: raw.updated_at || raw.updatedAt || null,
  };
}

function normalizeAdminSettlement(raw = {}) {
  return {
    id: raw.id,
    orderNo: raw.order_no || raw.orderNo || "",
    userEmail: raw.user_email || raw.userEmail || "",
    status: raw.status || "",
    grossAmount: Number(raw.gross_amount ?? raw.grossAmount ?? 0),
    discountAmount: Number(raw.discount_amount ?? raw.discountAmount ?? 0),
    shippingFee: Number(raw.shipping_fee ?? raw.shippingFee ?? 0),
    pgFee: Number(raw.pg_fee ?? raw.pgFee ?? 0),
    platformFee: Number(raw.platform_fee ?? raw.platformFee ?? 0),
    returnDeduction: Number(raw.return_deduction ?? raw.returnDeduction ?? 0),
    settlementAmount: Number(raw.settlement_amount ?? raw.settlementAmount ?? 0),
    expectedPayoutDate: raw.expected_payout_date || raw.expectedPayoutDate || null,
    paidAt: raw.paid_at || raw.paidAt || null,
    memo: raw.memo || "",
    orderCreatedAt: raw.order_created_at || raw.orderCreatedAt || null,
    orderPaymentStatus: raw.order_payment_status || raw.orderPaymentStatus || "",
    orderShippingStatus: raw.order_shipping_status || raw.orderShippingStatus || "",
    orderSubtotalAmount: Number(raw.order_subtotal_amount ?? raw.orderSubtotalAmount ?? 0),
    orderShippingFee: Number(raw.order_shipping_fee ?? raw.orderShippingFee ?? 0),
    orderDiscountAmount: Number(raw.order_discount_amount ?? raw.orderDiscountAmount ?? 0),
    orderTotalAmount: Number(raw.order_total_amount ?? raw.orderTotalAmount ?? 0),
    createdAt: raw.created_at || raw.createdAt || null,
    updatedAt: raw.updated_at || raw.updatedAt || null,
  };
}

function normalizeAdminBanner(raw = {}) {
  return {
    id: Number(raw.id || 0),
    subtitle: raw.subtitle || "",
    title: raw.title || "",
    description: raw.description || "",
    ctaText: raw.cta_text || raw.ctaText || "",
    linkUrl: raw.link_url || raw.linkUrl || "",
    sortOrder: Number(raw.sort_order ?? raw.sortOrder ?? 0),
    isActive: Boolean(raw.is_active ?? raw.isActive),
    imageUrl: raw.image_url || raw.imageUrl || "",
    createdAt: raw.created_at || raw.createdAt || null,
    updatedAt: raw.updated_at || raw.updatedAt || null,
  };
}

function normalizeAdminManagedProduct(raw = {}) {
  return {
    id: Number(raw.id || 0),
    categoryId: Number(raw.category_id ?? raw.categoryId ?? 0) || null,
    name: raw.name || "",
    sku: raw.sku || "",
    oneLine: raw.one_line || raw.oneLine || "",
    description: raw.description || "",
    intake: raw.intake || "",
    target: raw.target || "",
    manufacturer: raw.manufacturer || "",
    originCountry: raw.origin_country || raw.originCountry || "",
    taxStatus: raw.tax_status || raw.taxStatus || "TAXABLE",
    deliveryFee: Number(raw.delivery_fee ?? raw.deliveryFee ?? 0),
    freeShippingAmount: Number(raw.free_shipping_amount ?? raw.freeShippingAmount ?? 0),
    searchKeywords: Array.isArray(raw.search_keywords) ? raw.search_keywords : [],
    releaseDate: raw.release_date || raw.releaseDate || "",
    displayStartAt: raw.display_start_at || raw.displayStartAt || null,
    displayEndAt: raw.display_end_at || raw.displayEndAt || null,
    price: Number(raw.price ?? 0),
    originalPrice: Number(raw.original_price ?? raw.originalPrice ?? 0),
    stock: Number(raw.stock ?? 0),
    isActive: Boolean(raw.is_active ?? raw.isActive),
    categoryName: raw.category_name || raw.categoryName || "",
    badgeTypes: Array.isArray(raw.badge_types) ? raw.badge_types : [],
    thumbnailUrl: raw.thumbnail_url || raw.thumbnailUrl || "",
    images: Array.isArray(raw.images)
      ? raw.images.map((image) => ({
          id: Number(image.id || 0),
          imageUrl: image.image_url || image.imageUrl || "",
          isThumbnail: Boolean(image.is_thumbnail ?? image.isThumbnail),
          sortOrder: Number(image.sort_order ?? image.sortOrder ?? 0),
        }))
      : [],
    createdAt: raw.created_at || raw.createdAt || null,
    updatedAt: raw.updated_at || raw.updatedAt || null,
  };
}

function normalizeAdminManagedUser(raw = {}) {
  return {
    id: Number(raw.id || 0),
    email: raw.email || "",
    name: raw.name || "",
    phone: raw.phone || "",
    isActive: Boolean(raw.is_active ?? raw.isActive),
    isStaff: Boolean(raw.is_staff ?? raw.isStaff),
    orderCount: Number(raw.order_count ?? raw.orderCount ?? 0),
    reviewCount: Number(raw.review_count ?? raw.reviewCount ?? 0),
    inquiryCount: Number(raw.inquiry_count ?? raw.inquiryCount ?? 0),
    createdAt: raw.created_at || raw.createdAt || null,
    lastLogin: raw.last_login || raw.lastLogin || null,
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

export async function apiRegister({
  email,
  password,
  passwordConfirm,
  name,
  phone,
  recipient,
  recipientPhone = "",
  postalCode,
  roadAddress,
  detailAddress = "",
}) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: {
      email,
      password,
      password_confirm: passwordConfirm,
      name,
      phone,
      recipient,
      recipient_phone: recipientPhone,
      postal_code: postalCode,
      road_address: roadAddress,
      detail_address: detailAddress,
    },
    auth: false,
    retryOnAuth: false,
  });
}

export async function apiGetKakaoAuthorizeUrl({ redirectUri, state } = {}) {
  const data = await apiRequest("/auth/kakao/authorize-url", {
    query: {
      redirect_uri: redirectUri,
      state,
    },
    auth: false,
    retryOnAuth: false,
  });
  return {
    authorizeUrl: data?.authorize_url || data?.authorizeUrl || "",
    redirectUri: data?.redirect_uri || data?.redirectUri || redirectUri || "",
  };
}

export async function apiKakaoCallback({ code, redirectUri, state } = {}) {
  return apiRequest("/auth/kakao/callback", {
    method: "POST",
    body: {
      code,
      redirect_uri: redirectUri,
      state,
    },
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
  const data = await apiRequest(`/products/${id}`);
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

export async function fetchMyOrders() {
  const data = await apiRequest("/orders");
  return Array.isArray(data) ? data.map(normalizeOrderSummary) : [];
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

export async function withdrawMyAccount({ password, reason = "" }) {
  return apiRequest("/users/me/withdraw", {
    method: "POST",
    body: {
      password,
      reason,
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

export async function createOrder({
  recipient,
  phone,
  postalCode,
  roadAddress,
  jibunAddress = "",
  detailAddress = "",
  buyNowProductId,
  buyNowOptionId,
  buyNowQuantity,
} = {}) {
  const body = {
    recipient,
    phone,
    postal_code: postalCode,
    road_address: roadAddress,
    jibun_address: jibunAddress,
    detail_address: detailAddress,
  };
  if (buyNowProductId !== undefined && buyNowProductId !== null) {
    body.buy_now_product_id = Number(buyNowProductId);
  }
  if (buyNowOptionId !== undefined && buyNowOptionId !== null) {
    body.buy_now_option_id = Number(buyNowOptionId);
  }
  if (buyNowQuantity !== undefined && buyNowQuantity !== null) {
    body.buy_now_quantity = Number(buyNowQuantity);
  }

  const data = await apiRequest("/orders", {
    method: "POST",
    body,
  });
  return normalizeOrderSummary(data || {});
}

export async function fetchBankTransferAccountInfo() {
  return apiRequest("/payments/bank-transfer/account-info", {
    auth: false,
    retryOnAuth: false,
  });
}

export async function createBankTransferRequest({
  orderNo,
  depositorName,
  depositorPhone = "",
  transferNote = "",
} = {}) {
  const data = await apiRequest("/payments/bank-transfer/requests", {
    method: "POST",
    body: {
      order_no: orderNo,
      depositor_name: depositorName,
      depositor_phone: depositorPhone,
      transfer_note: transferNote,
      idempotency_key: createIdempotencyKey("bank"),
    },
  });
  return normalizeBankTransferRequest(data || {});
}

export async function fetchMyBankTransferRequests() {
  const data = await apiRequest("/payments/bank-transfer/requests");
  return Array.isArray(data) ? data.map(normalizeBankTransferRequest) : [];
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
      currentMonth: summary.current_month || summary.currentMonth || "",
      thisMonthOrderCount: Number(summary.this_month_order_count ?? summary.thisMonthOrderCount ?? 0),
      thisMonthPaidOrderCount: Number(summary.this_month_paid_order_count ?? summary.thisMonthPaidOrderCount ?? 0),
      thisMonthOrderAmount: Number(summary.this_month_order_amount ?? summary.thisMonthOrderAmount ?? 0),
      thisMonthPaidAmount: Number(summary.this_month_paid_amount ?? summary.thisMonthPaidAmount ?? 0),
      thisMonthRefundAmount: Number(summary.this_month_refund_amount ?? summary.thisMonthRefundAmount ?? 0),
      thisMonthNewUserCount: Number(summary.this_month_new_user_count ?? summary.thisMonthNewUserCount ?? 0),
      thisMonthInquiryCount: Number(summary.this_month_inquiry_count ?? summary.thisMonthInquiryCount ?? 0),
      thisMonthPaidSettlementAmount: Number(
        summary.this_month_paid_settlement_amount ?? summary.thisMonthPaidSettlementAmount ?? 0,
      ),
      openOrderCount: Number(summary.open_order_count ?? summary.openOrderCount ?? 0),
      shippingPendingCount: Number(summary.shipping_pending_count ?? summary.shippingPendingCount ?? 0),
      shippingShippedCount: Number(summary.shipping_shipped_count ?? summary.shippingShippedCount ?? 0),
      shippingDeliveredCount: Number(summary.shipping_delivered_count ?? summary.shippingDeliveredCount ?? 0),
      openInquiryCount: Number(summary.open_inquiry_count ?? summary.openInquiryCount ?? 0),
      overdueInquiryCount: Number(summary.overdue_inquiry_count ?? summary.overdueInquiryCount ?? 0),
      hiddenReviewCount: Number(summary.hidden_review_count ?? summary.hiddenReviewCount ?? 0),
      openReturnCount: Number(summary.open_return_count ?? summary.openReturnCount ?? 0),
      completedReturnCount: Number(summary.completed_return_count ?? summary.completedReturnCount ?? 0),
      pendingSettlementAmount: Number(summary.pending_settlement_amount ?? summary.pendingSettlementAmount ?? 0),
      paidSettlementAmount: Number(summary.paid_settlement_amount ?? summary.paidSettlementAmount ?? 0),
    },
    monthlyMetrics: Array.isArray(data?.monthly_metrics)
      ? data.monthly_metrics.map((row) => ({
          month: row.month || "",
          orderCount: Number(row.order_count ?? row.orderCount ?? 0),
          paidOrderCount: Number(row.paid_order_count ?? row.paidOrderCount ?? 0),
          orderAmount: Number(row.order_amount ?? row.orderAmount ?? 0),
          paidAmount: Number(row.paid_amount ?? row.paidAmount ?? 0),
          refundAmount: Number(row.refund_amount ?? row.refundAmount ?? 0),
          returnRequestCount: Number(row.return_request_count ?? row.returnRequestCount ?? 0),
          newUserCount: Number(row.new_user_count ?? row.newUserCount ?? 0),
          inquiryCount: Number(row.inquiry_count ?? row.inquiryCount ?? 0),
          paidSettlementCount: Number(row.paid_settlement_count ?? row.paidSettlementCount ?? 0),
          paidSettlementAmount: Number(row.paid_settlement_amount ?? row.paidSettlementAmount ?? 0),
        }))
      : [],
    statusSectors: {
      shipping: {
        ready: Number(data?.status_sectors?.shipping?.ready ?? data?.statusSectors?.shipping?.ready ?? 0),
        preparing: Number(data?.status_sectors?.shipping?.preparing ?? data?.statusSectors?.shipping?.preparing ?? 0),
        shipped: Number(data?.status_sectors?.shipping?.shipped ?? data?.statusSectors?.shipping?.shipped ?? 0),
        delivered: Number(data?.status_sectors?.shipping?.delivered ?? data?.statusSectors?.shipping?.delivered ?? 0),
      },
      returns: {
        requested: Number(data?.status_sectors?.returns?.requested ?? data?.statusSectors?.returns?.requested ?? 0),
        approved: Number(data?.status_sectors?.returns?.approved ?? data?.statusSectors?.returns?.approved ?? 0),
        refunding: Number(data?.status_sectors?.returns?.refunding ?? data?.statusSectors?.returns?.refunding ?? 0),
        refunded: Number(data?.status_sectors?.returns?.refunded ?? data?.statusSectors?.returns?.refunded ?? 0),
        rejected: Number(data?.status_sectors?.returns?.rejected ?? data?.statusSectors?.returns?.rejected ?? 0),
      },
      inquiries: {
        open: Number(data?.status_sectors?.inquiries?.open ?? data?.statusSectors?.inquiries?.open ?? 0),
        answered: Number(data?.status_sectors?.inquiries?.answered ?? data?.statusSectors?.inquiries?.answered ?? 0),
        closed: Number(data?.status_sectors?.inquiries?.closed ?? data?.statusSectors?.inquiries?.closed ?? 0),
      },
      settlements: {
        pending: Number(data?.status_sectors?.settlements?.pending ?? data?.statusSectors?.settlements?.pending ?? 0),
        hold: Number(data?.status_sectors?.settlements?.hold ?? data?.statusSectors?.settlements?.hold ?? 0),
        scheduled: Number(
          data?.status_sectors?.settlements?.scheduled ?? data?.statusSectors?.settlements?.scheduled ?? 0,
        ),
        paid: Number(data?.status_sectors?.settlements?.paid ?? data?.statusSectors?.settlements?.paid ?? 0),
      },
    },
  };
}

export async function fetchAdminOrders({ q, status, paymentStatus, shippingStatus, hasOpenReturn, limit = 80 } = {}) {
  const data = await apiRequest("/admin/orders", {
    query: {
      q,
      status,
      payment_status: paymentStatus,
      shipping_status: shippingStatus,
      has_open_return: typeof hasOpenReturn === "boolean" ? String(hasOpenReturn) : undefined,
      limit,
    },
  });
  return Array.isArray(data) ? data.map(normalizeAdminOrder) : [];
}

export async function updateAdminOrder(orderNo, payload = {}) {
  const body = {};
  if (payload.recipient !== undefined) body.recipient = payload.recipient;
  if (payload.phone !== undefined) body.phone = payload.phone;
  if (payload.postalCode !== undefined) body.postal_code = payload.postalCode;
  if (payload.roadAddress !== undefined) body.road_address = payload.roadAddress;
  if (payload.jibunAddress !== undefined) body.jibun_address = payload.jibunAddress;
  if (payload.detailAddress !== undefined) body.detail_address = payload.detailAddress;
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

export async function fetchAdminInquiries({ q, status, category, priority, assignedAdminId, overdue, limit } = {}) {
  const data = await apiRequest("/admin/inquiries", {
    query: {
      q,
      status,
      category,
      priority,
      assigned_admin_id: assignedAdminId,
      overdue: typeof overdue === "boolean" ? String(overdue) : undefined,
      limit,
    },
  });
  return Array.isArray(data) ? data.map(normalizeAdminInquiry) : [];
}

export async function answerAdminInquiry(
  inquiryId,
  { answer, status, category, priority, assignedAdminId, internalNote, slaDueAt, deleteAnswer } = {},
) {
  const data = await apiRequest(`/admin/inquiries/${inquiryId}/answer`, {
    method: "PATCH",
    body: {
      answer,
      delete_answer: deleteAnswer,
      status,
      category,
      priority,
      assigned_admin_id: assignedAdminId,
      internal_note: internalNote,
      sla_due_at: slaDueAt,
    },
  });
  return normalizeAdminInquiry(data || {});
}

export async function fetchAdminReviews({ status, productId, sort = "latest", page = 1, pageSize = 10, q } = {}) {
  const data = await apiRequest("/admin/reviews", {
    query: {
      status,
      product_id: productId,
      sort,
      page,
      page_size: pageSize,
      q,
    },
  });

  const items = extractResults(data).map(normalizeAdminReview);
  const totalCount = Number(data?.count ?? items.length);
  const safePageSize = Number(data?.page_size ?? pageSize ?? 10) || 10;
  const totalPages = Number(data?.total_pages ?? Math.max(1, Math.ceil(totalCount / safePageSize)));
  const currentPage = Number(data?.page ?? page ?? 1);

  return {
    items,
    count: totalCount,
    page: currentPage,
    pageSize: safePageSize,
    totalPages,
    hasNext: Boolean(data?.has_next ?? currentPage < totalPages),
    hasPrevious: Boolean(data?.has_previous ?? currentPage > 1),
  };
}

export async function setAdminReviewVisibility(reviewId, visible) {
  const data = await apiRequest(`/admin/reviews/${reviewId}/visibility`, {
    method: "PATCH",
    body: { visible: Boolean(visible) },
  });
  return normalizeAdminReview(data || {});
}

export async function deleteAdminReview(reviewId) {
  return apiRequest(`/admin/reviews/${reviewId}`, {
    method: "DELETE",
  });
}

export async function fetchAdminReturnRequests({ q, status, limit = 200 } = {}) {
  const data = await apiRequest("/admin/returns", {
    query: {
      q,
      status,
      limit,
    },
  });
  return Array.isArray(data) ? data.map(normalizeAdminReturnRequest) : [];
}

export async function createAdminReturnRequest({ orderNo, reasonTitle, reasonDetail, requestedAmount } = {}) {
  const data = await apiRequest("/admin/returns", {
    method: "POST",
    body: {
      order_no: orderNo,
      reason_title: reasonTitle,
      reason_detail: reasonDetail,
      requested_amount: requestedAmount,
    },
  });
  return normalizeAdminReturnRequest(data || {});
}

export async function updateAdminReturnRequest(
  returnRequestId,
  { status, approvedAmount, rejectedReason, pickupCourierName, pickupTrackingNo, adminNote } = {},
) {
  const data = await apiRequest(`/admin/returns/${returnRequestId}`, {
    method: "PATCH",
    body: {
      status,
      approved_amount: approvedAmount,
      rejected_reason: rejectedReason,
      pickup_courier_name: pickupCourierName,
      pickup_tracking_no: pickupTrackingNo,
      admin_note: adminNote,
    },
  });
  return normalizeAdminReturnRequest(data || {});
}

export async function deleteAdminReturnRequest(returnRequestId) {
  return apiRequest(`/admin/returns/${returnRequestId}`, {
    method: "DELETE",
  });
}

export async function fetchAdminSettlements({ q, status, limit = 200 } = {}) {
  const data = await apiRequest("/admin/settlements", {
    query: {
      q,
      status,
      limit,
    },
  });
  return Array.isArray(data) ? data.map(normalizeAdminSettlement) : [];
}

export async function generateAdminSettlements({ onlyPaidOrders = true } = {}) {
  return apiRequest("/admin/settlements", {
    method: "POST",
    body: {
      only_paid_orders: onlyPaidOrders,
    },
  });
}

export async function updateAdminSettlement(
  settlementId,
  { status, pgFee, platformFee, returnDeduction, expectedPayoutDate, markPaid, memo } = {},
) {
  const data = await apiRequest(`/admin/settlements/${settlementId}`, {
    method: "PATCH",
    body: {
      status,
      pg_fee: pgFee,
      platform_fee: platformFee,
      return_deduction: returnDeduction,
      expected_payout_date: expectedPayoutDate,
      mark_paid: markPaid,
      memo,
    },
  });
  return normalizeAdminSettlement(data || {});
}

export async function deleteAdminSettlement(settlementId) {
  return apiRequest(`/admin/settlements/${settlementId}`, {
    method: "DELETE",
  });
}

export async function fetchAdminStaffUsers() {
  const data = await apiRequest("/admin/staff-users");
  return Array.isArray(data)
    ? data.map((row) => ({
        id: Number(row.id || 0),
        email: row.email || "",
        name: row.name || "",
      }))
    : [];
}

export async function fetchAdminManagedBanners() {
  const data = await apiRequest("/admin/banners/home/manage");
  return Array.isArray(data) ? data.map(normalizeAdminBanner) : [];
}

export async function createAdminManagedBanner({
  subtitle,
  title,
  description,
  ctaText,
  linkUrl,
  sortOrder,
  isActive,
  imageFile,
} = {}) {
  const formData = new FormData();
  if (subtitle !== undefined) formData.append("subtitle", subtitle);
  if (title !== undefined) formData.append("title", title);
  if (description !== undefined) formData.append("description", description);
  if (ctaText !== undefined) formData.append("cta_text", ctaText);
  if (linkUrl !== undefined) formData.append("link_url", linkUrl);
  if (sortOrder !== undefined) formData.append("sort_order", String(sortOrder));
  if (isActive !== undefined) formData.append("is_active", String(Boolean(isActive)));
  if (imageFile) formData.append("image", imageFile);

  const data = await apiRequest("/admin/banners/home/manage", {
    method: "POST",
    body: formData,
    isForm: true,
  });
  return normalizeAdminBanner(data || {});
}

export async function updateAdminManagedBanner(
  bannerId,
  { subtitle, title, description, ctaText, linkUrl, sortOrder, isActive, imageFile } = {},
) {
  const formData = new FormData();
  if (subtitle !== undefined) formData.append("subtitle", subtitle);
  if (title !== undefined) formData.append("title", title);
  if (description !== undefined) formData.append("description", description);
  if (ctaText !== undefined) formData.append("cta_text", ctaText);
  if (linkUrl !== undefined) formData.append("link_url", linkUrl);
  if (sortOrder !== undefined) formData.append("sort_order", String(sortOrder));
  if (isActive !== undefined) formData.append("is_active", String(Boolean(isActive)));
  if (imageFile) formData.append("image", imageFile);

  const data = await apiRequest(`/admin/banners/home/manage/${bannerId}`, {
    method: "PATCH",
    body: formData,
    isForm: true,
  });
  return normalizeAdminBanner(data || {});
}

export async function deleteAdminManagedBanner(bannerId) {
  return apiRequest(`/admin/banners/home/manage/${bannerId}`, {
    method: "DELETE",
  });
}

export async function fetchAdminProductMeta() {
  const data = await apiRequest("/admin/products/manage/meta");
  return {
    badgeOptions: Array.isArray(data?.badge_options)
      ? data.badge_options.map((row) => ({
          code: row.code || "",
          label: row.label || row.code || "",
        }))
      : [],
    taxStatusOptions: Array.isArray(data?.tax_status_options)
      ? data.tax_status_options.map((row) => ({
          code: row.code || "",
          label: row.label || row.code || "",
        }))
      : [],
    categoryOptions: Array.isArray(data?.category_options)
      ? data.category_options.map((row) => ({
          id: Number(row.id || 0),
          name: row.name || "",
          slug: row.slug || "",
        }))
      : [],
  };
}

export async function fetchAdminManagedProducts({ q, isActive, categoryId, limit = 200 } = {}) {
  const data = await apiRequest("/admin/products/manage", {
    query: {
      q,
      is_active: typeof isActive === "boolean" ? String(isActive) : undefined,
      category_id: categoryId,
      limit,
    },
  });
  return Array.isArray(data) ? data.map(normalizeAdminManagedProduct) : [];
}

export async function createAdminManagedProduct({
  categoryId,
  sku,
  name,
  oneLine,
  description,
  intake,
  target,
  manufacturer,
  originCountry,
  taxStatus,
  deliveryFee,
  freeShippingAmount,
  searchKeywords,
  releaseDate,
  displayStartAt,
  displayEndAt,
  price,
  originalPrice,
  stock,
  isActive,
  badgeTypes,
  thumbnailFile,
  imageFiles,
} = {}) {
  const formData = new FormData();
  if (categoryId !== undefined && categoryId !== null) formData.append("category_id", String(categoryId));
  if (sku !== undefined) formData.append("sku", sku);
  if (name !== undefined) formData.append("name", name);
  if (oneLine !== undefined) formData.append("one_line", oneLine);
  if (description !== undefined) formData.append("description", description);
  if (intake !== undefined) formData.append("intake", intake);
  if (target !== undefined) formData.append("target", target);
  if (manufacturer !== undefined) formData.append("manufacturer", manufacturer);
  if (originCountry !== undefined) formData.append("origin_country", originCountry);
  if (taxStatus !== undefined) formData.append("tax_status", taxStatus);
  if (deliveryFee !== undefined) formData.append("delivery_fee", String(deliveryFee));
  if (freeShippingAmount !== undefined) formData.append("free_shipping_amount", String(freeShippingAmount));
  if (Array.isArray(searchKeywords)) {
    if (!searchKeywords.length) {
      formData.append("search_keywords", "");
    } else {
      searchKeywords.forEach((keyword) => formData.append("search_keywords", keyword));
    }
  }
  if (releaseDate !== undefined) formData.append("release_date", releaseDate || "");
  if (displayStartAt !== undefined) formData.append("display_start_at", displayStartAt || "");
  if (displayEndAt !== undefined) formData.append("display_end_at", displayEndAt || "");
  if (price !== undefined) formData.append("price", String(price));
  if (originalPrice !== undefined) formData.append("original_price", String(originalPrice));
  if (stock !== undefined) formData.append("stock", String(stock));
  if (isActive !== undefined) formData.append("is_active", String(Boolean(isActive)));
  if (Array.isArray(badgeTypes)) {
    if (!badgeTypes.length) {
      formData.append("badge_types", "");
    } else {
      badgeTypes.forEach((badgeType) => formData.append("badge_types", badgeType));
    }
  }
  if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
  if (Array.isArray(imageFiles)) {
    imageFiles.filter(Boolean).forEach((file) => formData.append("images", file));
  }

  const data = await apiRequest("/admin/products/manage", {
    method: "POST",
    body: formData,
    isForm: true,
  });
  return normalizeAdminManagedProduct(data || {});
}

export async function updateAdminManagedProduct(
  productId,
  {
    categoryId,
    sku,
    name,
    oneLine,
    description,
    intake,
    target,
    manufacturer,
    originCountry,
    taxStatus,
    deliveryFee,
    freeShippingAmount,
    searchKeywords,
    releaseDate,
    displayStartAt,
    displayEndAt,
    price,
    originalPrice,
    stock,
    isActive,
    badgeTypes,
    thumbnailFile,
    imageFiles,
    deleteImageIds,
    thumbnailImageId,
  } = {},
) {
  const formData = new FormData();
  if (categoryId !== undefined) {
    if (categoryId === null || categoryId === "") {
      formData.append("category_id", "");
    } else {
      formData.append("category_id", String(categoryId));
    }
  }
  if (sku !== undefined) formData.append("sku", sku);
  if (name !== undefined) formData.append("name", name);
  if (oneLine !== undefined) formData.append("one_line", oneLine);
  if (description !== undefined) formData.append("description", description);
  if (intake !== undefined) formData.append("intake", intake);
  if (target !== undefined) formData.append("target", target);
  if (manufacturer !== undefined) formData.append("manufacturer", manufacturer);
  if (originCountry !== undefined) formData.append("origin_country", originCountry);
  if (taxStatus !== undefined) formData.append("tax_status", taxStatus);
  if (deliveryFee !== undefined) formData.append("delivery_fee", String(deliveryFee));
  if (freeShippingAmount !== undefined) formData.append("free_shipping_amount", String(freeShippingAmount));
  if (Array.isArray(searchKeywords)) {
    if (!searchKeywords.length) {
      formData.append("search_keywords", "");
    } else {
      searchKeywords.forEach((keyword) => formData.append("search_keywords", keyword));
    }
  }
  if (releaseDate !== undefined) formData.append("release_date", releaseDate || "");
  if (displayStartAt !== undefined) formData.append("display_start_at", displayStartAt || "");
  if (displayEndAt !== undefined) formData.append("display_end_at", displayEndAt || "");
  if (price !== undefined) formData.append("price", String(price));
  if (originalPrice !== undefined) formData.append("original_price", String(originalPrice));
  if (stock !== undefined) formData.append("stock", String(stock));
  if (isActive !== undefined) formData.append("is_active", String(Boolean(isActive)));
  if (Array.isArray(badgeTypes)) {
    if (!badgeTypes.length) {
      formData.append("badge_types", "");
    } else {
      badgeTypes.forEach((badgeType) => formData.append("badge_types", badgeType));
    }
  }
  if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
  if (Array.isArray(imageFiles)) {
    imageFiles.filter(Boolean).forEach((file) => formData.append("images", file));
  }
  if (Array.isArray(deleteImageIds) && deleteImageIds.length) {
    deleteImageIds.forEach((imageId) => formData.append("delete_image_ids", String(imageId)));
  }
  if (thumbnailImageId !== undefined && thumbnailImageId !== null) {
    formData.append("thumbnail_image_id", String(thumbnailImageId));
  }

  const data = await apiRequest(`/admin/products/manage/${productId}`, {
    method: "PATCH",
    body: formData,
    isForm: true,
  });
  return normalizeAdminManagedProduct(data || {});
}

export async function deleteAdminManagedProduct(productId) {
  return apiRequest(`/admin/products/manage/${productId}`, {
    method: "DELETE",
  });
}

export async function fetchAdminManagedUsers({ q, isActive, isStaff, limit = 200 } = {}) {
  const data = await apiRequest("/admin/users/manage", {
    query: {
      q,
      is_active: typeof isActive === "boolean" ? String(isActive) : undefined,
      is_staff: typeof isStaff === "boolean" ? String(isStaff) : undefined,
      limit,
    },
  });
  return Array.isArray(data) ? data.map(normalizeAdminManagedUser) : [];
}

export async function updateAdminManagedUser(userId, { name, phone, isActive, isStaff } = {}) {
  const data = await apiRequest(`/admin/users/manage/${userId}`, {
    method: "PATCH",
    body: {
      name,
      phone,
      is_active: isActive,
      is_staff: isStaff,
    },
  });
  return normalizeAdminManagedUser(data || {});
}

export async function deactivateAdminManagedUser(userId) {
  return apiRequest(`/admin/users/manage/${userId}`, {
    method: "DELETE",
  });
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

export async function deleteAdminCoupon(couponId) {
  return apiRequest(`/admin/coupons/${couponId}`, {
    method: "DELETE",
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

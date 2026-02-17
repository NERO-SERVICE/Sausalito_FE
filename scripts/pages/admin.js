import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { mountSiteFooter } from "../components/footer.js";
import { getUser, syncCurrentUser } from "../services/auth-service.js";
import { cartCount } from "../services/cart-service.js";
import {
  answerAdminInquiry,
  createAdminManagedBanner,
  createAdminManagedProduct,
  createAdminReturnRequest,
  deleteAdminCoupon,
  deleteAdminManagedBanner,
  deleteAdminManagedProduct,
  deleteAdminReturnRequest,
  deleteAdminReview,
  deleteAdminSettlement,
  fetchAdminManagedBanners,
  fetchAdminManagedProducts,
  fetchAdminProductMeta,
  fetchAdminManagedUsers,
  fetchAdminCoupons,
  fetchAdminDashboard,
  fetchAdminInquiries,
  fetchAdminOrders,
  fetchAdminReturnRequests,
  fetchAdminReviews,
  fetchAdminSettlements,
  fetchAdminStaffUsers,
  generateAdminSettlements,
  issueAdminCoupon,
  setAdminReviewVisibility,
  updateAdminManagedBanner,
  updateAdminManagedProduct,
  updateAdminOrder,
  updateAdminReturnRequest,
  updateAdminSettlement,
} from "../services/api.js";
import { formatCurrency } from "../store-data.js";

const headerRefs = mountSiteHeader({ showCart: true, currentNav: "" });
mountSiteFooter();

const TAB_IDS = ["dashboard", "orders", "returns", "settlements", "cs", "reviews", "products", "members", "coupons"];
const ORDER_STATUS_OPTIONS = ["PENDING", "PAID", "FAILED", "CANCELED", "REFUNDED", "PARTIAL_REFUNDED"];
const PAYMENT_STATUS_OPTIONS = ["UNPAID", "READY", "APPROVED", "CANCELED", "FAILED"];
const SHIPPING_STATUS_OPTIONS = ["READY", "PREPARING", "SHIPPED", "DELIVERED"];
const INQUIRY_STATUS_OPTIONS = ["OPEN", "ANSWERED", "CLOSED"];
const INQUIRY_CATEGORY_OPTIONS = ["DELIVERY", "RETURN_REFUND", "PAYMENT", "ORDER", "PRODUCT", "ETC"];
const INQUIRY_PRIORITY_OPTIONS = ["LOW", "NORMAL", "HIGH", "URGENT"];
const RETURN_STATUS_OPTIONS = [
  "REQUESTED",
  "APPROVED",
  "PICKUP_SCHEDULED",
  "RECEIVED",
  "REFUNDING",
  "REFUNDED",
  "REJECTED",
  "CLOSED",
];
const SETTLEMENT_STATUS_OPTIONS = ["PENDING", "HOLD", "SCHEDULED", "PAID"];

const ORDER_STATUS_LABELS = {
  PENDING: "주문접수",
  PAID: "주문완료",
  FAILED: "결제실패",
  CANCELED: "주문취소",
  REFUNDED: "전체환불",
  PARTIAL_REFUNDED: "부분환불",
};

const PAYMENT_STATUS_LABELS = {
  UNPAID: "결제대기",
  READY: "결제준비",
  APPROVED: "결제완료",
  CANCELED: "결제취소",
  FAILED: "결제실패",
};

const SHIPPING_STATUS_LABELS = {
  READY: "배송준비",
  PREPARING: "상품준비중",
  SHIPPED: "배송중",
  DELIVERED: "배송완료",
};

const RETURN_STATUS_LABELS = {
  REQUESTED: "요청",
  APPROVED: "승인",
  PICKUP_SCHEDULED: "회수예정",
  RECEIVED: "회수완료",
  REFUNDING: "환불처리중",
  REFUNDED: "환불완료",
  REJECTED: "반려",
  CLOSED: "종결",
};

const SETTLEMENT_STATUS_LABELS = {
  PENDING: "정산대기",
  HOLD: "정산보류",
  SCHEDULED: "지급예정",
  PAID: "지급완료",
};

const INQUIRY_STATUS_LABELS = {
  OPEN: "접수",
  ANSWERED: "답변완료",
  CLOSED: "종결",
};

const REVIEW_STATUS_LABELS = {
  VISIBLE: "노출",
  HIDDEN: "숨김",
  DELETED: "삭제",
};

const STATUS_LABELS = {
  ...ORDER_STATUS_LABELS,
  ...PAYMENT_STATUS_LABELS,
  ...SHIPPING_STATUS_LABELS,
  ...RETURN_STATUS_LABELS,
  ...SETTLEMENT_STATUS_LABELS,
  ...INQUIRY_STATUS_LABELS,
  ...REVIEW_STATUS_LABELS,
};

const CATEGORY_LABELS = {
  DELIVERY: "배송",
  RETURN_REFUND: "반품/환불",
  PAYMENT: "결제",
  ORDER: "주문",
  PRODUCT: "상품",
  ETC: "기타",
};

const PRIORITY_LABELS = {
  LOW: "낮음",
  NORMAL: "보통",
  HIGH: "높음",
  URGENT: "긴급",
};

const TAX_STATUS_LABELS = {
  TAXABLE: "과세",
  ZERO: "영세",
  EXEMPT: "면세",
};

const state = {
  user: null,
  activeTab: "dashboard",
  dashboard: null,
  orders: [],
  returns: [],
  settlements: [],
  inquiries: [],
  selectedInquiryId: null,
  expandedInquiryId: null,
  reviews: [],
  reviewPage: 1,
  reviewPageSize: 10,
  reviewTotalPages: 1,
  reviewTotalCount: 0,
  managedBanners: [],
  managedProducts: [],
  productMeta: {
    badgeOptions: [],
    categoryOptions: [],
    taxStatusOptions: [],
  },
  managedUsers: [],
  coupons: [],
  staffUsers: [],
  editingRows: {
    orders: new Set(),
    returns: new Set(),
    settlements: new Set(),
    banners: new Set(),
    products: new Set(),
  },
};

const el = {
  reloadBtn: document.getElementById("adminReloadBtn"),
  generateSettlementBtn: document.getElementById("adminGenerateSettlementBtn"),
  notice: document.getElementById("adminActionNotice"),

  navButtons: Array.from(document.querySelectorAll("[data-tab-btn]")),
  tabPanels: Array.from(document.querySelectorAll("[data-tab-panel]")),

  summary: document.getElementById("adminSummary"),
  dashboardMonthly: document.getElementById("adminDashboardMonthly"),
  dashboardShipping: document.getElementById("adminDashboardShipping"),
  dashboardReturns: document.getElementById("adminDashboardReturns"),
  dashboardInquiries: document.getElementById("adminDashboardInquiries"),
  dashboardSettlements: document.getElementById("adminDashboardSettlements"),

  orders: document.getElementById("adminOrders"),
  orderSearch: document.getElementById("adminOrderSearch"),
  orderStatus: document.getElementById("adminOrderStatusFilter"),
  paymentStatus: document.getElementById("adminPaymentStatusFilter"),
  shippingStatus: document.getElementById("adminShippingStatusFilter"),
  orderOpenReturnOnly: document.getElementById("adminOrderOpenReturnOnly"),
  orderSearchBtn: document.getElementById("adminOrderSearchBtn"),

  returns: document.getElementById("adminReturns"),
  returnSearch: document.getElementById("adminReturnSearch"),
  returnStatus: document.getElementById("adminReturnStatusFilter"),
  returnSearchBtn: document.getElementById("adminReturnSearchBtn"),
  returnCreateForm: document.getElementById("adminReturnCreateForm"),
  returnOrderNo: document.getElementById("returnOrderNo"),
  returnReasonTitle: document.getElementById("returnReasonTitle"),
  returnReasonDetail: document.getElementById("returnReasonDetail"),
  returnRequestedAmount: document.getElementById("returnRequestedAmount"),

  settlements: document.getElementById("adminSettlements"),
  settlementSearch: document.getElementById("adminSettlementSearch"),
  settlementStatus: document.getElementById("adminSettlementStatusFilter"),
  settlementSearchBtn: document.getElementById("adminSettlementSearchBtn"),

  inquirySearch: document.getElementById("adminInquirySearch"),
  inquiryStatus: document.getElementById("adminInquiryStatusFilter"),
  inquiryCategory: document.getElementById("adminInquiryCategoryFilter"),
  inquiryPriority: document.getElementById("adminInquiryPriorityFilter"),
  inquiryOverdueOnly: document.getElementById("adminInquiryOverdueOnly"),
  inquirySearchBtn: document.getElementById("adminInquirySearchBtn"),
  inquiries: document.getElementById("adminInquiries"),
  inquiryEditor: document.getElementById("adminInquiryEditor"),
  inquiryEditorCloseBtn: document.getElementById("adminInquiryEditorCloseBtn"),
  inquiryEditorMeta: document.getElementById("adminInquiryEditorMeta"),
  inquiryEditorStatus: document.getElementById("adminInquiryEditorStatus"),
  inquiryEditorCategory: document.getElementById("adminInquiryEditorCategory"),
  inquiryEditorPriority: document.getElementById("adminInquiryEditorPriority"),
  inquiryEditorAssignedAdmin: document.getElementById("adminInquiryEditorAssignedAdmin"),
  inquiryEditorSlaDueAt: document.getElementById("adminInquiryEditorSlaDueAt"),
  inquiryEditorAnswer: document.getElementById("adminInquiryEditorAnswer"),
  inquiryEditorInternalNote: document.getElementById("adminInquiryEditorInternalNote"),
  inquiryEditorSaveBtn: document.getElementById("adminInquiryEditorSaveBtn"),
  inquiryEditorDeleteBtn: document.getElementById("adminInquiryEditorDeleteBtn"),
  inquiryEditorSavedState: document.getElementById("adminInquiryEditorSavedState"),

  managedBanners: document.getElementById("adminManagedBanners"),
  bannerCreateForm: document.getElementById("adminBannerCreateForm"),
  bannerTitle: document.getElementById("bannerTitle"),
  bannerSubtitle: document.getElementById("bannerSubtitle"),
  bannerDescription: document.getElementById("bannerDescription"),
  bannerCtaText: document.getElementById("bannerCtaText"),
  bannerLinkUrl: document.getElementById("bannerLinkUrl"),
  bannerSortOrder: document.getElementById("bannerSortOrder"),
  bannerIsActive: document.getElementById("bannerIsActive"),
  bannerImageFile: document.getElementById("bannerImageFile"),

  managedProducts: document.getElementById("adminManagedProducts"),
  managedProductSearch: document.getElementById("adminManagedProductSearch"),
  managedProductCategoryFilter: document.getElementById("adminManagedProductCategoryFilter"),
  managedProductActiveFilter: document.getElementById("adminManagedProductActiveFilter"),
  managedProductSearchBtn: document.getElementById("adminManagedProductSearchBtn"),
  productCreateForm: document.getElementById("adminProductCreateForm"),
  productCategoryId: document.getElementById("managedProductCategoryId"),
  productSku: document.getElementById("managedProductSku"),
  productName: document.getElementById("managedProductName"),
  productOneLine: document.getElementById("managedProductOneLine"),
  productDescription: document.getElementById("managedProductDescription"),
  productIntake: document.getElementById("managedProductIntake"),
  productTarget: document.getElementById("managedProductTarget"),
  productManufacturer: document.getElementById("managedProductManufacturer"),
  productOriginCountry: document.getElementById("managedProductOriginCountry"),
  productTaxStatus: document.getElementById("managedProductTaxStatus"),
  productDeliveryFee: document.getElementById("managedProductDeliveryFee"),
  productFreeShippingAmount: document.getElementById("managedProductFreeShippingAmount"),
  productSearchKeywords: document.getElementById("managedProductSearchKeywords"),
  productReleaseDate: document.getElementById("managedProductReleaseDate"),
  productDisplayStartAt: document.getElementById("managedProductDisplayStartAt"),
  productDisplayEndAt: document.getElementById("managedProductDisplayEndAt"),
  productPrice: document.getElementById("managedProductPrice"),
  productOriginalPrice: document.getElementById("managedProductOriginalPrice"),
  productStock: document.getElementById("managedProductStock"),
  productBadgeGroup: document.getElementById("managedProductBadgeGroup"),
  productIsActive: document.getElementById("managedProductIsActive"),
  productThumbnail: document.getElementById("managedProductThumbnail"),
  productImages: document.getElementById("managedProductImages"),

  managedUsers: document.getElementById("adminMembers"),
  memberSearch: document.getElementById("adminMemberSearch"),
  memberActiveFilter: document.getElementById("adminMemberActiveFilter"),
  memberStaffFilter: document.getElementById("adminMemberStaffFilter"),
  memberSearchBtn: document.getElementById("adminMemberSearchBtn"),

  reviewStatus: document.getElementById("adminReviewStatusFilter"),
  reviewSort: document.getElementById("adminReviewSortFilter"),
  reviewSearch: document.getElementById("adminReviewSearch"),
  reviewSearchBtn: document.getElementById("adminReviewSearchBtn"),
  reviewPagination: document.getElementById("adminReviewPagination"),
  reviews: document.getElementById("adminReviews"),

  couponForm: document.getElementById("adminCouponForm"),
  couponTarget: document.getElementById("couponTarget"),
  couponEmailField: document.getElementById("couponEmailField"),
  couponEmail: document.getElementById("couponEmail"),
  couponName: document.getElementById("couponName"),
  couponCode: document.getElementById("couponCode"),
  couponDiscountAmount: document.getElementById("couponDiscountAmount"),
  couponMinOrderAmount: document.getElementById("couponMinOrderAmount"),
  couponExpiresAt: document.getElementById("couponExpiresAt"),
  couponSearch: document.getElementById("adminCouponSearch"),
  coupons: document.getElementById("adminCoupons"),
};

let noticeTimer = null;

function isAdminUser(user) {
  return Boolean(user?.is_staff ?? user?.isStaff);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function showNotice(message, type = "success") {
  if (!el.notice) return;
  el.notice.textContent = message;
  el.notice.classList.remove("hidden", "success", "error");
  el.notice.classList.add(type === "error" ? "error" : "success");

  if (noticeTimer) clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => {
    el.notice.classList.add("hidden");
    el.notice.classList.remove("success", "error");
    el.notice.textContent = "";
  }, 3200);
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
}

function formatTextPreview(value, maxLength = 220) {
  const text = String(value || "").trim();
  if (!text) return "";
  const preview = text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  return escapeHtml(preview).replace(/\n/g, "<br />");
}

function formatMultilineText(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  return escapeHtml(text).replace(/\n/g, "<br />");
}

function isRowEditing(section, key) {
  const set = state.editingRows?.[section];
  if (!set) return false;
  return set.has(String(key));
}

function setRowEditing(section, key, editing) {
  const set = state.editingRows?.[section];
  if (!set) return;
  const normalized = String(key);
  if (editing) {
    set.clear();
    set.add(normalized);
    return;
  }
  set.delete(normalized);
}

function clearRowEditing(section) {
  const set = state.editingRows?.[section];
  if (!set) return;
  set.clear();
}

function toIsoFromLocal(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function toLocalInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function getLabel(value, labels = null) {
  if (!value) return "-";
  if (labels && labels[value]) return labels[value];
  return STATUS_LABELS[value] || CATEGORY_LABELS[value] || PRIORITY_LABELS[value] || value;
}

function renderStatusBadge(status, labels = null) {
  const code = status || "-";
  const cls = String(code)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_");
  return `<span class="admin-status ${cls}">${escapeHtml(getLabel(code, labels))}</span>`;
}

function buildOptions(options, currentValue, labels = null) {
  return options
    .map(
      (option) =>
        `<option value="${escapeHtml(option)}" ${option === currentValue ? "selected" : ""}>${escapeHtml(getLabel(option, labels))}</option>`,
    )
    .join("");
}

function buildStaffOptions(currentId) {
  const base = ['<option value="">미할당</option>'];
  const rows = state.staffUsers.map((user) => {
    const label = `${user.name || "관리자"} (${user.email})`;
    return `<option value="${user.id}" ${Number(user.id) === Number(currentId) ? "selected" : ""}>${escapeHtml(label)}</option>`;
  });
  return [...base, ...rows].join("");
}

function toDateInputValue(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return String(value);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseKeywordList(value) {
  return String(value || "")
    .split(",")
    .map((row) => row.trim())
    .filter(Boolean);
}

function buildCategoryOptions(currentValue = "", includeEmpty = true) {
  const rows = [];
  if (includeEmpty) {
    rows.push(`<option value="">선택 안함</option>`);
  }
  state.productMeta.categoryOptions.forEach((category) => {
    const selected = String(category.id) === String(currentValue) ? "selected" : "";
    rows.push(`<option value="${category.id}" ${selected}>${escapeHtml(category.name)}</option>`);
  });
  return rows.join("");
}

function buildTaxStatusOptions(currentValue = "TAXABLE") {
  const rows = state.productMeta.taxStatusOptions.length
    ? state.productMeta.taxStatusOptions
    : [
        { code: "TAXABLE", label: "과세" },
        { code: "ZERO", label: "영세" },
        { code: "EXEMPT", label: "면세" },
      ];
  return rows
    .map(
      (row) =>
        `<option value="${escapeHtml(row.code)}" ${row.code === currentValue ? "selected" : ""}>${escapeHtml(row.label)}</option>`,
    )
    .join("");
}

function renderBadgeCheckboxes(selectedBadgeTypes = [], disabled = false) {
  const selectedSet = new Set((selectedBadgeTypes || []).map((item) => String(item)));
  const rows = state.productMeta.badgeOptions.length
    ? state.productMeta.badgeOptions
    : [
        { code: "HOT", label: "HOT" },
        { code: "BESTSELLER", label: "BESTSELLER" },
        { code: "DISCOUNT", label: "DISCOUNT" },
        { code: "NEW", label: "NEW" },
        { code: "RECOMMENDED", label: "RECOMMENDED" },
      ];
  return rows
    .map(
      (row) => `
      <label class="admin-check-inline">
        <input type="checkbox" data-role="badge-type" value="${escapeHtml(row.code)}" ${selectedSet.has(row.code) ? "checked" : ""} ${disabled ? "disabled" : ""} />
        <span>${escapeHtml(row.label)}</span>
      </label>
    `,
    )
    .join("");
}

function getSelectedBadgeTypes(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll("input[data-role='badge-type']:checked"))
    .map((input) => String(input.value || "").trim())
    .filter(Boolean);
}

function renderSectorRows(sector = {}, labels = {}) {
  return Object.entries(labels)
    .map(([key, label]) => `<p><span>${escapeHtml(label)}</span><strong>${Number(sector?.[key] ?? 0)}건</strong></p>`)
    .join("");
}

function showInquiryEditorSavedState(message, type = "success") {
  if (!el.inquiryEditorSavedState) return;
  el.inquiryEditorSavedState.textContent = message;
  el.inquiryEditorSavedState.classList.remove("hidden");
  el.inquiryEditorSavedState.style.borderColor = type === "error" ? "#fecaca" : "#bbf7d0";
  el.inquiryEditorSavedState.style.background = type === "error" ? "#fef2f2" : "#f0fdf4";
  el.inquiryEditorSavedState.style.color = type === "error" ? "#991b1b" : "#166534";
}

function hideInquiryEditorSavedState() {
  if (!el.inquiryEditorSavedState) return;
  el.inquiryEditorSavedState.classList.add("hidden");
  el.inquiryEditorSavedState.textContent = "";
}

function setActiveTab(tabId) {
  if (!TAB_IDS.includes(tabId)) return;
  state.activeTab = tabId;

  el.navButtons.forEach((button) => {
    const isActive = button.dataset.tabBtn === tabId;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  el.tabPanels.forEach((panel) => {
    const isActive = panel.dataset.tabPanel === tabId;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

function renderSummary() {
  const summary = state.dashboard?.summary || {};
  el.summary.innerHTML = `
    <article>
      <p>${escapeHtml(summary.currentMonth || "-")} 주문건수</p>
      <strong>${summary.thisMonthOrderCount || 0}건</strong>
    </article>
    <article>
      <p>${escapeHtml(summary.currentMonth || "-")} 주문금액</p>
      <strong>${formatCurrency(summary.thisMonthOrderAmount || 0)}</strong>
    </article>
    <article>
      <p>${escapeHtml(summary.currentMonth || "-")} 결제완료 주문</p>
      <strong>${summary.thisMonthPaidOrderCount || 0}건</strong>
    </article>
    <article>
      <p>${escapeHtml(summary.currentMonth || "-")} 결제금액</p>
      <strong>${formatCurrency(summary.thisMonthPaidAmount || 0)}</strong>
    </article>
    <article>
      <p>${escapeHtml(summary.currentMonth || "-")} 환불금액</p>
      <strong>${formatCurrency(summary.thisMonthRefundAmount || 0)}</strong>
    </article>
    <article>
      <p>${escapeHtml(summary.currentMonth || "-")} 신규회원</p>
      <strong>${summary.thisMonthNewUserCount || 0}명</strong>
    </article>
    <article>
      <p>${escapeHtml(summary.currentMonth || "-")} CS 문의</p>
      <strong>${summary.thisMonthInquiryCount || 0}건</strong>
    </article>
    <article>
      <p>${escapeHtml(summary.currentMonth || "-")} 정산 지급완료</p>
      <strong>${formatCurrency(summary.thisMonthPaidSettlementAmount || 0)}</strong>
    </article>
    <article>
      <p>진행 주문건</p>
      <strong>${summary.openOrderCount || 0}건</strong>
    </article>
    <article>
      <p>반품 진행건</p>
      <strong>${summary.openReturnCount || 0}건</strong>
    </article>
    <article>
      <p>반품 완료건</p>
      <strong>${summary.completedReturnCount || 0}건</strong>
    </article>
    <article>
      <p>CS 미처리</p>
      <strong>${summary.openInquiryCount || 0}건</strong>
    </article>
    <article>
      <p>CS SLA 지연</p>
      <strong>${summary.overdueInquiryCount || 0}건</strong>
    </article>
    <article>
      <p>정산 예정금</p>
      <strong>${formatCurrency(summary.pendingSettlementAmount || 0)}</strong>
    </article>
    <article>
      <p>정산 지급완료 누적</p>
      <strong>${formatCurrency(summary.paidSettlementAmount || 0)}</strong>
    </article>
  `;
}

function renderDashboardMonthly() {
  const rows = state.dashboard?.monthlyMetrics || [];
  if (!rows.length) {
    el.dashboardMonthly.innerHTML = '<p class="empty">월별 지표 데이터가 없습니다.</p>';
    return;
  }

  el.dashboardMonthly.innerHTML = `
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-dashboard-monthly-table">
        <thead>
          <tr>
            <th>월</th>
            <th>주문건수</th>
            <th>결제완료 주문</th>
            <th>주문금액</th>
            <th>결제금액</th>
            <th>환불금액</th>
            <th>반품요청건</th>
            <th>신규회원</th>
            <th>CS 문의</th>
            <th>정산지급건</th>
            <th>정산지급금액</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `
            <tr>
              <td>${escapeHtml(row.month)}</td>
              <td>${row.orderCount}건</td>
              <td>${row.paidOrderCount}건</td>
              <td>${formatCurrency(row.orderAmount)}</td>
              <td>${formatCurrency(row.paidAmount)}</td>
              <td>${formatCurrency(row.refundAmount)}</td>
              <td>${row.returnRequestCount}건</td>
              <td>${row.newUserCount}명</td>
              <td>${row.inquiryCount}건</td>
              <td>${row.paidSettlementCount}건</td>
              <td>${formatCurrency(row.paidSettlementAmount)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderDashboardSectors() {
  const sectors = state.dashboard?.statusSectors || {};
  el.dashboardShipping.innerHTML = renderSectorRows(sectors.shipping, {
    ready: "배송준비",
    preparing: "상품준비중",
    shipped: "배송중",
    delivered: "배송완료",
  });
  el.dashboardReturns.innerHTML = renderSectorRows(sectors.returns, {
    requested: "요청",
    approved: "승인",
    refunding: "환불처리중",
    refunded: "환불완료",
    rejected: "반려",
  });
  el.dashboardInquiries.innerHTML = renderSectorRows(sectors.inquiries, {
    open: "접수",
    answered: "답변완료",
    closed: "종결",
  });
  el.dashboardSettlements.innerHTML = renderSectorRows(sectors.settlements, {
    pending: "정산대기",
    hold: "정산보류",
    scheduled: "지급예정",
    paid: "지급완료",
  });
}

function renderDashboardBoards() {
  renderDashboardMonthly();
  renderDashboardSectors();
}

function renderOrders() {
  if (!state.orders.length) {
    el.orders.innerHTML = '<p class="empty">조건에 맞는 주문이 없습니다.</p>';
    return;
  }

  el.orders.innerHTML = `
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-orders-table">
        <thead>
          <tr>
            <th>작업</th>
            <th>주문번호</th>
            <th>주문일시</th>
            <th>상품수</th>
            <th>총결제금액</th>
            <th>주문자명</th>
            <th>수령인</th>
            <th>연락처</th>
            <th>우편번호</th>
            <th>도로명주소</th>
            <th>지번주소</th>
            <th>상세주소</th>
            <th>주문상태</th>
            <th>결제상태</th>
            <th>배송상태</th>
            <th>정산상태</th>
            <th>반품요청건</th>
            <th>반품진행</th>
            <th>택배사</th>
            <th>송장번호</th>
          </tr>
        </thead>
        <tbody>
          ${state.orders
            .map((order) => {
              const editing = isRowEditing("orders", order.orderNo);
              const disabled = editing ? "" : "disabled";
              return `
              <tr data-order-no="${escapeHtml(order.orderNo)}" class="${editing ? "is-editing" : "is-readonly"}">
                <td class="admin-cell-actions">
                  <div class="admin-inline-actions">
                    ${
                      editing
                        ? `
                          <button class="ghost" type="button" data-action="issueInvoice">송장발급</button>
                          <button class="ghost" type="button" data-action="markDelivered">배송완료</button>
                          <button class="primary" type="button" data-action="saveOrder">저장</button>
                          <button class="ghost" type="button" data-action="cancelOrderEdit">취소</button>
                        `
                        : `<button class="primary" type="button" data-action="editOrder">수정</button>`
                    }
                  </div>
                </td>
                <td><strong>${escapeHtml(order.orderNo)}</strong></td>
                <td>${formatDateTime(order.createdAt)}</td>
                <td>${order.itemCount}개</td>
                <td>${formatCurrency(order.totalAmount)}</td>
                <td>${escapeHtml(order.userName || "-")}</td>
                <td><input type="text" data-role="recipient" value="${escapeHtml(order.recipient || "")}" ${disabled} /></td>
                <td><input type="text" data-role="phone" value="${escapeHtml(order.phone || "")}" ${disabled} /></td>
                <td><input type="text" data-role="postal-code" value="${escapeHtml(order.postalCode || "")}" ${disabled} /></td>
                <td><input type="text" data-role="road-address" value="${escapeHtml(order.roadAddress || "")}" ${disabled} /></td>
                <td><input type="text" data-role="jibun-address" value="${escapeHtml(order.jibunAddress || "")}" ${disabled} /></td>
                <td><input type="text" data-role="detail-address" value="${escapeHtml(order.detailAddress || "")}" ${disabled} /></td>
                <td class="admin-cell-select">
                  <select data-role="order-status" ${disabled}>${buildOptions(ORDER_STATUS_OPTIONS, order.status, ORDER_STATUS_LABELS)}</select>
                </td>
                <td class="admin-cell-select">
                  <select data-role="payment-status" ${disabled}>${buildOptions(PAYMENT_STATUS_OPTIONS, order.paymentStatus, PAYMENT_STATUS_LABELS)}</select>
                </td>
                <td class="admin-cell-select">
                  <select data-role="shipping-status" ${disabled}>${buildOptions(SHIPPING_STATUS_OPTIONS, order.shippingStatus, SHIPPING_STATUS_LABELS)}</select>
                </td>
                <td>${renderStatusBadge(order.settlementStatus || "-", SETTLEMENT_STATUS_LABELS)}</td>
                <td>${order.returnRequestCount}건</td>
                <td>${order.hasOpenReturn ? "진행중" : "-"}</td>
                <td>
                  <input type="text" data-role="courier-name" value="${escapeHtml(order.courierName || "")}" ${disabled} />
                </td>
                <td>
                  <input type="text" data-role="tracking-no" value="${escapeHtml(order.trackingNo || "")}" ${disabled} />
                </td>
              </tr>
            `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderReturns() {
  if (!state.returns.length) {
    el.returns.innerHTML = '<p class="empty">반품/환불 데이터가 없습니다.</p>';
    return;
  }

  el.returns.innerHTML = `
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-returns-table">
        <thead>
          <tr>
            <th>작업</th>
            <th>주문번호</th>
            <th>회원</th>
            <th>요청사유</th>
            <th>상세사유</th>
            <th>요청금액</th>
            <th>상태</th>
            <th>승인금액</th>
            <th>회수택배사</th>
            <th>회수송장번호</th>
            <th>반려사유</th>
            <th>메모</th>
            <th>요청일시</th>
          </tr>
        </thead>
        <tbody>
          ${state.returns
            .map((row) => {
              const editing = isRowEditing("returns", row.id);
              const disabled = editing ? "" : "disabled";
              return `
              <tr data-return-id="${row.id}" class="${editing ? "is-editing" : "is-readonly"}">
                <td class="admin-cell-actions">
                  <div class="admin-inline-actions">
                    ${
                      editing
                        ? `
                          <button class="primary" type="button" data-action="saveReturn">저장</button>
                          <button class="ghost" type="button" data-action="cancelReturnEdit">취소</button>
                        `
                        : `<button class="primary" type="button" data-action="editReturn">수정</button>`
                    }
                    <button class="danger" type="button" data-action="deleteReturn">삭제</button>
                  </div>
                </td>
                <td><strong>${escapeHtml(row.orderNo)}</strong></td>
                <td>${escapeHtml(row.userEmail || "-")}</td>
                <td>${escapeHtml(row.reasonTitle || "-")}</td>
                <td>${escapeHtml(row.reasonDetail || "-")}</td>
                <td>${formatCurrency(row.requestedAmount)}</td>
                <td>
                  <select data-role="return-status" ${disabled}>${buildOptions(RETURN_STATUS_OPTIONS, row.status, RETURN_STATUS_LABELS)}</select>
                </td>
                <td>
                  <input type="number" min="0" data-role="approved-amount" value="${row.approvedAmount || 0}" ${disabled} />
                </td>
                <td>
                  <input type="text" data-role="pickup-courier" placeholder="회수 택배사" value="${escapeHtml(row.pickupCourierName || "")}" ${disabled} />
                </td>
                <td>
                  <input type="text" data-role="pickup-tracking" placeholder="회수 송장번호" value="${escapeHtml(row.pickupTrackingNo || "")}" ${disabled} />
                </td>
                <td>
                  <input type="text" data-role="rejected-reason" placeholder="반려 사유" value="${escapeHtml(row.rejectedReason || "")}" ${disabled} />
                </td>
                <td>
                  <input type="text" data-role="admin-note" placeholder="관리 메모" value="${escapeHtml(row.adminNote || "")}" ${disabled} />
                </td>
                <td>${formatDateTime(row.requestedAt)}</td>
              </tr>
            `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderSettlements() {
  if (!state.settlements.length) {
    el.settlements.innerHTML = '<p class="empty">정산 데이터가 없습니다.</p>';
    return;
  }

  el.settlements.innerHTML = `
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-settlements-table">
        <thead>
          <tr>
            <th rowspan="2">작업</th>
            <th rowspan="2">주문번호</th>
            <th rowspan="2">주문일시</th>
            <th rowspan="2">회원</th>
            <th colspan="4">주문 데이터</th>
            <th colspan="3">정산 공제</th>
            <th colspan="5">정산 결과</th>
          </tr>
          <tr>
            <th>주문소계</th>
            <th>배송비</th>
            <th>할인금액</th>
            <th>총결제금액</th>
            <th>PG수수료</th>
            <th>플랫폼수수료</th>
            <th>반품차감</th>
            <th>정산상태</th>
            <th>정산금</th>
            <th>지급예정일</th>
            <th>지급완료일</th>
            <th>메모</th>
          </tr>
        </thead>
        <tbody>
          ${state.settlements
            .map((row) => {
              const editing = isRowEditing("settlements", row.id);
              const disabled = editing ? "" : "disabled";
              return `
              <tr data-settlement-id="${row.id}" class="${editing ? "is-editing" : "is-readonly"}">
                <td class="admin-cell-actions">
                  <div class="admin-inline-actions">
                    ${
                      editing
                        ? `
                          <button class="ghost" type="button" data-action="markSettlementPaid">지급완료</button>
                          <button class="primary" type="button" data-action="saveSettlement">저장</button>
                          <button class="ghost" type="button" data-action="cancelSettlementEdit">취소</button>
                        `
                        : `<button class="primary" type="button" data-action="editSettlement">수정</button>`
                    }
                    <button class="danger" type="button" data-action="deleteSettlement">삭제</button>
                  </div>
                </td>
                <td><strong>${escapeHtml(row.orderNo)}</strong></td>
                <td>${formatDateTime(row.orderCreatedAt)}</td>
                <td>${escapeHtml(row.userEmail || "-")}</td>
                <td>${formatCurrency(row.orderSubtotalAmount)}</td>
                <td>${formatCurrency(row.orderShippingFee)}</td>
                <td>${formatCurrency(row.orderDiscountAmount)}</td>
                <td>${formatCurrency(row.orderTotalAmount)}</td>
                <td><input type="number" data-role="pg-fee" value="${row.pgFee}" ${disabled} /></td>
                <td><input type="number" data-role="platform-fee" value="${row.platformFee}" ${disabled} /></td>
                <td><input type="number" data-role="return-deduction" value="${row.returnDeduction}" ${disabled} /></td>
                <td>
                  <select data-role="settlement-status" ${disabled}>${buildOptions(SETTLEMENT_STATUS_OPTIONS, row.status, SETTLEMENT_STATUS_LABELS)}</select>
                </td>
                <td>${formatCurrency(row.settlementAmount)}</td>
                <td><input type="date" data-role="expected-payout-date" value="${escapeHtml(row.expectedPayoutDate || "")}" ${disabled} /></td>
                <td>${formatDateTime(row.paidAt)}</td>
                <td><input type="text" data-role="settlement-memo" value="${escapeHtml(row.memo || "")}" ${disabled} /></td>
              </tr>
            `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderInquiries() {
  if (!state.inquiries.length) {
    el.inquiries.innerHTML = '<p class="empty">문의 내역이 없습니다.</p>';
    return;
  }

  el.inquiries.innerHTML = `
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-cs-table">
        <thead>
          <tr>
            <th class="admin-cs-col-actions">작업</th>
            <th class="admin-cs-col-id">ID</th>
            <th class="admin-cs-col-member">회원명</th>
            <th class="admin-cs-col-member-email">회원이메일</th>
            <th class="admin-cs-col-title">문의제목</th>
            <th class="admin-cs-col-content">문의내용</th>
            <th class="admin-cs-col-category">카테고리</th>
            <th class="admin-cs-col-status">상태</th>
            <th class="admin-cs-col-sla">SLA 지연</th>
            <th class="admin-cs-col-priority">우선순위</th>
            <th class="admin-cs-col-created">등록일시</th>
          </tr>
        </thead>
        <tbody>
          ${state.inquiries
            .map((inquiry) => {
              const hasAnswer = Boolean(String(inquiry.answer || "").trim());
              const isSelected = Number(inquiry.id) === Number(state.selectedInquiryId);
              const isExpanded = hasAnswer && Number(inquiry.id) === Number(state.expandedInquiryId);
              const answerText = hasAnswer ? formatMultilineText(inquiry.answer) : "";

              return `
              <tr class="${isSelected ? "is-selected" : ""}">
                <td class="admin-cs-col-actions">
                  <div class="admin-inline-actions">
                    ${
                      hasAnswer
                        ? `
                          <button class="ghost admin-cs-btn-edit" type="button" data-action="openInquiryEditor" data-inquiry-id="${inquiry.id}">수정</button>
                          <button class="ghost admin-cs-btn-view ${isExpanded ? "is-open" : ""}" type="button" data-action="toggleInquiryAnswer" data-inquiry-id="${inquiry.id}">확인</button>
                        `
                        : `<button class="primary admin-cs-btn-answer" type="button" data-action="openInquiryEditor" data-inquiry-id="${inquiry.id}">답변</button>`
                    }
                  </div>
                </td>
                <td class="admin-cs-col-id">${inquiry.id}</td>
                <td class="admin-cs-col-member">${escapeHtml(inquiry.userName || "회원")}</td>
                <td class="admin-cs-col-member-email">${escapeHtml(inquiry.userEmail || "-")}</td>
                <td class="admin-cs-col-title">${escapeHtml(inquiry.title)}</td>
                <td class="admin-cs-col-content">${formatTextPreview(inquiry.content, 180)}</td>
                <td class="admin-cs-col-category">${escapeHtml(getLabel(inquiry.category, CATEGORY_LABELS))}</td>
                <td class="admin-cs-col-status">${renderStatusBadge(inquiry.status, INQUIRY_STATUS_LABELS)}</td>
                <td class="admin-cs-col-sla">${inquiry.isSlaOverdue ? '<span class="admin-status overdue">지연</span>' : "-"}</td>
                <td class="admin-cs-col-priority">${escapeHtml(getLabel(inquiry.priority, PRIORITY_LABELS))}</td>
                <td class="admin-cs-col-created">${formatDateTime(inquiry.createdAt)}</td>
              </tr>
              ${
                isExpanded
                  ? `
                    <tr class="admin-cs-answer-row">
                      <td colspan="11">
                        <section class="admin-cs-inline-answer">
                          <p class="admin-cs-inline-answer-meta">답변 등록일 ${formatDateTime(inquiry.answeredAt || inquiry.updatedAt)}</p>
                          <div class="admin-cs-inline-answer-body">${answerText}</div>
                        </section>
                      </td>
                    </tr>
                  `
                  : ""
              }
            `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function toggleInquiryAnswer(inquiryId) {
  const inquiry = state.inquiries.find((row) => Number(row.id) === Number(inquiryId));
  if (!inquiry || !String(inquiry.answer || "").trim()) return;

  if (Number(state.expandedInquiryId) === Number(inquiryId)) {
    state.expandedInquiryId = null;
  } else {
    state.expandedInquiryId = inquiryId;
  }

  renderInquiries();
}

function openInquiryEditor(inquiryId) {
  const inquiry = state.inquiries.find((row) => Number(row.id) === Number(inquiryId));
  if (!inquiry) {
    state.selectedInquiryId = null;
    el.inquiryEditor?.classList.add("hidden");
    return;
  }

  state.selectedInquiryId = inquiry.id;
  hideInquiryEditorSavedState();

  if (el.inquiryEditorMeta) {
    const meta = `${getLabel(inquiry.category, CATEGORY_LABELS)} · ${escapeHtml(inquiry.userName || inquiry.userEmail || "회원")} · ${formatDateTime(inquiry.createdAt)}`;
    el.inquiryEditorMeta.textContent = `${inquiry.title} (${meta})`;
  }

  el.inquiryEditorStatus.value = inquiry.status || "OPEN";
  el.inquiryEditorCategory.value = inquiry.category || "ETC";
  el.inquiryEditorPriority.value = inquiry.priority || "NORMAL";
  el.inquiryEditorAssignedAdmin.innerHTML = buildStaffOptions(inquiry.assignedAdminId);
  el.inquiryEditorSlaDueAt.value = toLocalInputValue(inquiry.slaDueAt);
  el.inquiryEditorAnswer.value = inquiry.answer || "";
  el.inquiryEditorInternalNote.value = inquiry.internalNote || "";
  if (el.inquiryEditorDeleteBtn) {
    el.inquiryEditorDeleteBtn.disabled = !inquiry.answer;
  }

  el.inquiryEditor?.classList.remove("hidden");
  renderInquiries();
}

function closeInquiryEditor() {
  state.selectedInquiryId = null;
  if (el.inquiryEditor) {
    el.inquiryEditor.classList.add("hidden");
  }
  if (el.inquiryEditorMeta) {
    el.inquiryEditorMeta.textContent = "문의를 선택하면 답변 입력창이 열립니다.";
  }
  hideInquiryEditorSavedState();
  if (el.inquiryEditorDeleteBtn) {
    el.inquiryEditorDeleteBtn.disabled = true;
  }
  renderInquiries();
}

function renderReviews() {
  if (!state.reviews.length) {
    el.reviews.innerHTML = '<p class="empty">리뷰가 없습니다.</p>';
    return;
  }

  el.reviews.innerHTML = `
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-review-table">
        <thead>
          <tr>
            <th>작업</th>
            <th>ID</th>
            <th>상품ID</th>
            <th>상품명</th>
            <th>작성자명</th>
            <th>작성자이메일</th>
            <th>별점</th>
            <th>제목</th>
            <th>내용</th>
            <th>이미지</th>
            <th>상태</th>
            <th>작성일시</th>
          </tr>
        </thead>
        <tbody>
          ${state.reviews
            .map(
              (review) => `
              <tr data-review-id="${review.id}">
                <td>
                  <div class="admin-inline-actions">
                    <button class="ghost" type="button" data-action="hideReview" ${review.status === "HIDDEN" ? "disabled" : ""}>숨기기</button>
                    <button class="primary" type="button" data-action="showReview" ${review.status === "VISIBLE" ? "disabled" : ""}>노출</button>
                    <button class="danger" type="button" data-action="deleteReview" ${review.status === "DELETED" ? "disabled" : ""}>삭제</button>
                  </div>
                </td>
                <td>${review.id}</td>
                <td>${review.productId}</td>
                <td>${escapeHtml(review.productName)}</td>
                <td>${escapeHtml(review.userName || "회원")}</td>
                <td>${escapeHtml(review.userEmail || "-")}</td>
                <td>${review.score} / 5</td>
                <td>${escapeHtml(review.title || "(제목 없음)")}</td>
                <td>${escapeHtml(review.content)}</td>
                <td>
                  ${
                    review.images.length
                      ? `<div class="admin-review-image-grid">
                          ${review.images
                            .slice(0, 3)
                            .map((image, index) => `<img src="${escapeHtml(image)}" alt="리뷰 이미지 ${index + 1}" />`)
                            .join("")}
                        </div>`
                      : '<small>이미지 없음</small>'
                  }
                </td>
                <td>${renderStatusBadge(review.status, REVIEW_STATUS_LABELS)}</td>
                <td>${formatDateTime(review.createdAt)}</td>
              </tr>
            `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderReviewPagination() {
  if (!el.reviewPagination) return;

  const totalPages = Math.max(state.reviewTotalPages || 1, 1);
  const currentPage = Math.min(Math.max(state.reviewPage || 1, 1), totalPages);

  if (totalPages <= 1) {
    el.reviewPagination.innerHTML = "";
    return;
  }

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  const pageButtons = [];

  for (let page = start; page <= end; page += 1) {
    pageButtons.push(`
      <button class="ghost ${page === currentPage ? "active" : ""}" type="button" data-action="goReviewPage" data-page="${page}">${page}</button>
    `);
  }

  el.reviewPagination.innerHTML = `
    <button class="ghost" type="button" data-action="goReviewPage" data-page="${currentPage - 1}" ${currentPage <= 1 ? "disabled" : ""}>이전</button>
    ${pageButtons.join("")}
    <button class="ghost" type="button" data-action="goReviewPage" data-page="${currentPage + 1}" ${currentPage >= totalPages ? "disabled" : ""}>다음</button>
    <span class="admin-page-summary">총 ${state.reviewTotalCount}건</span>
  `;
}

function renderCoupons() {
  if (!state.coupons.length) {
    el.coupons.innerHTML = '<p class="empty">쿠폰 데이터가 없습니다.</p>';
    return;
  }

  el.coupons.innerHTML = `
    <div class="admin-excel-wrap">
      <table class="admin-excel-table">
        <thead>
          <tr>
            <th>작업</th>
            <th>회원</th>
            <th>쿠폰명</th>
            <th>쿠폰코드</th>
            <th>할인금액</th>
            <th>최소주문금액</th>
            <th>상태</th>
            <th>만료</th>
          </tr>
        </thead>
        <tbody>
          ${state.coupons
            .map(
              (coupon) => `
              <tr data-coupon-id="${coupon.id}">
                <td>
                  <button class="danger" type="button" data-action="deleteCoupon" ${coupon.isUsed ? "disabled" : ""}>삭제</button>
                </td>
                <td>${escapeHtml(coupon.userEmail || "-")}</td>
                <td>${escapeHtml(coupon.name)}</td>
                <td>${escapeHtml(coupon.code)}</td>
                <td>${formatCurrency(coupon.discountAmount)}</td>
                <td>${coupon.minOrderAmount ? formatCurrency(coupon.minOrderAmount) : "-"}</td>
                <td>${coupon.isUsed ? "사용완료" : coupon.isExpired ? "만료" : "사용가능"}</td>
                <td>${formatDateTime(coupon.expiresAt)}</td>
              </tr>
            `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderManagedBanners() {
  if (!state.managedBanners.length) {
    el.managedBanners.innerHTML = '<p class="empty">등록된 배너가 없습니다.</p>';
    return;
  }

  el.managedBanners.innerHTML = `
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-banners-table">
        <thead>
          <tr>
            <th>작업</th>
            <th>ID</th>
            <th>제목</th>
            <th>서브타이틀</th>
            <th>설명</th>
            <th>CTA</th>
            <th>링크</th>
            <th>순서</th>
            <th>활성</th>
            <th>이미지</th>
          </tr>
        </thead>
        <tbody>
          ${state.managedBanners
            .map((banner) => {
              const editing = isRowEditing("banners", banner.id);
              const disabled = editing ? "" : "disabled";
              return `
                <tr data-banner-id="${banner.id}" class="${editing ? "is-editing" : "is-readonly"}">
                  <td class="admin-cell-actions">
                    <div class="admin-inline-actions">
                      ${
                        editing
                          ? `
                            <button class="primary" type="button" data-action="saveBanner">저장</button>
                            <button class="ghost" type="button" data-action="cancelBannerEdit">취소</button>
                          `
                          : `<button class="primary" type="button" data-action="editBanner">수정</button>`
                      }
                      <button class="danger" type="button" data-action="deleteBanner">삭제</button>
                    </div>
                  </td>
                  <td>${banner.id}</td>
                  <td><input type="text" data-role="title" value="${escapeHtml(banner.title)}" ${disabled} /></td>
                  <td><input type="text" data-role="subtitle" value="${escapeHtml(banner.subtitle)}" ${disabled} /></td>
                  <td><input type="text" data-role="description" value="${escapeHtml(banner.description)}" ${disabled} /></td>
                  <td><input type="text" data-role="cta-text" value="${escapeHtml(banner.ctaText)}" ${disabled} /></td>
                  <td><input type="text" data-role="link-url" value="${escapeHtml(banner.linkUrl)}" ${disabled} /></td>
                  <td><input type="number" data-role="sort-order" min="0" value="${banner.sortOrder}" ${disabled} /></td>
                  <td>
                    <label class="admin-check-inline">
                      <input type="checkbox" data-role="is-active" ${banner.isActive ? "checked" : ""} ${disabled} />
                      <span>활성</span>
                    </label>
                  </td>
                  <td>
                    <div class="admin-image-cell">
                      ${banner.imageUrl ? `<img class="admin-banner-thumb" src="${escapeHtml(banner.imageUrl)}" alt="배너 ${banner.id}" />` : '<span class="empty">이미지 없음</span>'}
                      <input class="admin-file-input" type="file" data-role="image-file" accept="image/*" ${disabled} />
                    </div>
                  </td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderManagedProducts() {
  if (!state.managedProducts.length) {
    el.managedProducts.innerHTML = '<p class="empty">등록된 상품이 없습니다.</p>';
    return;
  }

  el.managedProducts.innerHTML = `
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-managed-products-table">
        <thead>
          <tr>
            <th>작업</th>
            <th>ID</th>
            <th>카테고리</th>
            <th>SKU</th>
            <th>상품명</th>
            <th>한줄소개</th>
            <th>제조사</th>
            <th>원산지</th>
            <th>세금구분</th>
            <th>판매가</th>
            <th>정상가</th>
            <th>재고</th>
            <th>배송비</th>
            <th>무료배송기준</th>
            <th>출시일</th>
            <th>노출시작</th>
            <th>노출종료</th>
            <th>검색키워드</th>
            <th>배지</th>
            <th>활성</th>
            <th>썸네일</th>
            <th>추가이미지수</th>
            <th>이미지관리</th>
            <th>복용법</th>
            <th>권장대상</th>
            <th>설명</th>
          </tr>
        </thead>
        <tbody>
          ${state.managedProducts
            .map((product) => {
              const editing = isRowEditing("products", product.id);
              const disabled = editing ? "" : "disabled";
              const images = Array.isArray(product.images) ? product.images.filter((image) => image.imageUrl) : [];
              const additionalImageCount = images.filter((image) => !image.isThumbnail).length;
              return `
                <tr data-product-id="${product.id}" class="${editing ? "is-editing" : "is-readonly"}">
                  <td class="admin-cell-actions">
                    <div class="admin-inline-actions">
                      ${
                        editing
                          ? `
                            <button class="primary" type="button" data-action="saveManagedProduct">저장</button>
                            <button class="ghost" type="button" data-action="cancelManagedProductEdit">취소</button>
                          `
                          : `<button class="primary" type="button" data-action="editManagedProduct">수정</button>`
                      }
                      <button class="danger" type="button" data-action="deleteManagedProduct">삭제</button>
                    </div>
                  </td>
                  <td>${product.id}</td>
                  <td>
                    <select data-role="category-id" ${disabled}>${buildCategoryOptions(product.categoryId || "", true)}</select>
                  </td>
                  <td><input type="text" data-role="sku" value="${escapeHtml(product.sku || "")}" ${disabled} /></td>
                  <td><input type="text" data-role="name" value="${escapeHtml(product.name)}" ${disabled} /></td>
                  <td><input type="text" data-role="one-line" value="${escapeHtml(product.oneLine)}" ${disabled} /></td>
                  <td><input type="text" data-role="manufacturer" value="${escapeHtml(product.manufacturer || "")}" ${disabled} /></td>
                  <td><input type="text" data-role="origin-country" value="${escapeHtml(product.originCountry || "")}" ${disabled} /></td>
                  <td>
                    <select data-role="tax-status" ${disabled}>${buildTaxStatusOptions(product.taxStatus || "TAXABLE")}</select>
                  </td>
                  <td><input type="number" min="0" data-role="price" value="${product.price}" ${disabled} /></td>
                  <td><input type="number" min="0" data-role="original-price" value="${product.originalPrice}" ${disabled} /></td>
                  <td><input type="number" min="0" data-role="stock" value="${product.stock}" ${disabled} /></td>
                  <td><input type="number" min="0" data-role="delivery-fee" value="${product.deliveryFee || 0}" ${disabled} /></td>
                  <td><input type="number" min="0" data-role="free-shipping-amount" value="${product.freeShippingAmount || 0}" ${disabled} /></td>
                  <td><input type="date" data-role="release-date" value="${escapeHtml(toDateInputValue(product.releaseDate))}" ${disabled} /></td>
                  <td><input type="datetime-local" data-role="display-start-at" value="${escapeHtml(toLocalInputValue(product.displayStartAt))}" ${disabled} /></td>
                  <td><input type="datetime-local" data-role="display-end-at" value="${escapeHtml(toLocalInputValue(product.displayEndAt))}" ${disabled} /></td>
                  <td><input type="text" data-role="search-keywords" value="${escapeHtml((product.searchKeywords || []).join(","))}" ${disabled} /></td>
                  <td>
                    <div data-role="badge-types" class="admin-badge-checkboxes ${editing ? "" : "is-disabled"}">
                      ${renderBadgeCheckboxes(product.badgeTypes || [], !editing)}
                    </div>
                  </td>
                  <td>
                    <label class="admin-check-inline">
                      <input type="checkbox" data-role="is-active" ${product.isActive ? "checked" : ""} ${disabled} />
                      <span>활성</span>
                    </label>
                  </td>
                  <td>
                    <div class="admin-image-cell">
                      ${product.thumbnailUrl ? `<img class="admin-product-thumb" src="${escapeHtml(product.thumbnailUrl)}" alt="상품 ${product.id}" />` : '<span class="empty">이미지 없음</span>'}
                      <input class="admin-file-input" type="file" data-role="thumbnail-file" accept="image/*" ${disabled} />
                    </div>
                  </td>
                  <td>${additionalImageCount}장</td>
                  <td>
                    <div class="admin-image-cell">
                      ${
                        images.length
                          ? `
                            <div class="admin-managed-image-grid">
                              ${images
                                .map(
                                  (image) => `
                                  <div class="admin-managed-image-item">
                                    <img class="admin-product-thumb" src="${escapeHtml(image.imageUrl || "")}" alt="상품 이미지 ${image.id}" />
                                    <label class="admin-check-inline">
                                      <input type="radio" name="thumbnail-image-id-${product.id}" data-role="thumbnail-image-id" value="${image.id}" ${image.isThumbnail ? "checked" : ""} ${disabled} />
                                      <span>대표</span>
                                    </label>
                                    <label class="admin-check-inline">
                                      <input type="checkbox" data-role="delete-image-id" value="${image.id}" ${disabled} />
                                      <span>삭제</span>
                                    </label>
                                  </div>
                                `,
                                )
                                .join("")}
                            </div>
                          `
                          : '<span class="empty">등록 이미지 없음</span>'
                      }
                      <input class="admin-file-input" type="file" data-role="image-files" accept="image/*" multiple ${disabled} />
                    </div>
                  </td>
                  <td><input type="text" data-role="intake" value="${escapeHtml(product.intake || "")}" ${disabled} /></td>
                  <td><input type="text" data-role="target" value="${escapeHtml(product.target || "")}" ${disabled} /></td>
                  <td><input type="text" data-role="description" value="${escapeHtml(product.description)}" ${disabled} /></td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderManagedUsers() {
  if (!state.managedUsers.length) {
    el.managedUsers.innerHTML = '<p class="empty">조회된 회원이 없습니다.</p>';
    return;
  }

  el.managedUsers.innerHTML = `
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-members-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>이메일</th>
            <th>이름</th>
            <th>전화번호</th>
            <th>상태</th>
            <th>권한</th>
            <th>주문수</th>
            <th>리뷰수</th>
            <th>문의수</th>
            <th>가입일</th>
            <th>최근로그인</th>
          </tr>
        </thead>
        <tbody>
          ${state.managedUsers
            .map((user) => {
              return `
                <tr data-user-id="${user.id}" class="is-readonly">
                  <td>${user.id}</td>
                  <td>${escapeHtml(user.email)}</td>
                  <td>${escapeHtml(user.name || "-")}</td>
                  <td>${escapeHtml(user.phone || "-")}</td>
                  <td>${user.isActive ? "활성" : "비활성"}</td>
                  <td>${user.isStaff ? "관리자" : "일반회원"}</td>
                  <td>${user.orderCount}</td>
                  <td>${user.reviewCount}</td>
                  <td>${user.inquiryCount}</td>
                  <td>${formatDateTime(user.createdAt)}</td>
                  <td>${formatDateTime(user.lastLogin)}</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

async function syncHeader() {
  const user = (await syncCurrentUser()) || getUser();
  let count = 0;
  try {
    count = await cartCount();
  } catch {
    count = 0;
  }

  syncSiteHeader(headerRefs, {
    userName: user?.name || user?.email || null,
    isAdmin: Boolean(user?.is_staff ?? user?.isStaff),
    cartCountValue: count,
  });
}

async function loadDashboard() {
  state.dashboard = await fetchAdminDashboard();
  renderSummary();
  renderDashboardBoards();
}

async function loadStaffUsers() {
  state.staffUsers = await fetchAdminStaffUsers();
}

function applyProductMetaToForm({ preserveFilter = true } = {}) {
  const currentCategoryFilter = preserveFilter ? String(el.managedProductCategoryFilter?.value || "") : "";
  if (el.productCategoryId) {
    el.productCategoryId.innerHTML = buildCategoryOptions("", true);
  }
  if (el.managedProductCategoryFilter) {
    el.managedProductCategoryFilter.innerHTML = `
      <option value="">카테고리 전체</option>
      ${state.productMeta.categoryOptions
        .map((category) => `<option value="${category.id}">${escapeHtml(category.name)}</option>`)
        .join("")}
    `;
    if (currentCategoryFilter) {
      el.managedProductCategoryFilter.value = currentCategoryFilter;
    }
  }
  if (el.productTaxStatus) {
    el.productTaxStatus.innerHTML = buildTaxStatusOptions("TAXABLE");
  }
  if (el.productBadgeGroup) {
    el.productBadgeGroup.innerHTML = renderBadgeCheckboxes([], false);
  }
}

async function loadProductMeta() {
  state.productMeta = await fetchAdminProductMeta();
  applyProductMetaToForm({ preserveFilter: true });
}

async function loadOrders() {
  state.orders = await fetchAdminOrders({
    q: el.orderSearch.value.trim(),
    status: el.orderStatus.value,
    paymentStatus: el.paymentStatus.value,
    shippingStatus: el.shippingStatus.value,
    hasOpenReturn: el.orderOpenReturnOnly.checked,
  });
  clearRowEditing("orders");
  renderOrders();
}

async function loadReturns() {
  state.returns = await fetchAdminReturnRequests({
    q: el.returnSearch.value.trim(),
    status: el.returnStatus.value,
  });
  clearRowEditing("returns");
  renderReturns();
}

async function loadSettlements() {
  state.settlements = await fetchAdminSettlements({
    q: el.settlementSearch.value.trim(),
    status: el.settlementStatus.value,
  });
  clearRowEditing("settlements");
  renderSettlements();
}

async function loadInquiries() {
  state.inquiries = await fetchAdminInquiries({
    q: el.inquirySearch.value.trim(),
    status: el.inquiryStatus.value,
    category: el.inquiryCategory.value,
    priority: el.inquiryPriority.value,
    overdue: el.inquiryOverdueOnly.checked,
  });

  if (state.expandedInquiryId) {
    const expandedRow = state.inquiries.find((row) => Number(row.id) === Number(state.expandedInquiryId));
    if (!expandedRow || !String(expandedRow.answer || "").trim()) {
      state.expandedInquiryId = null;
    }
  }

  renderInquiries();

  if (state.selectedInquiryId) {
    const exists = state.inquiries.some((row) => Number(row.id) === Number(state.selectedInquiryId));
    if (exists) {
      openInquiryEditor(state.selectedInquiryId);
    } else {
      closeInquiryEditor();
    }
  }
}

async function loadReviews({ page = state.reviewPage } = {}) {
  const result = await fetchAdminReviews({
    status: el.reviewStatus.value,
    sort: el.reviewSort.value,
    q: el.reviewSearch.value.trim(),
    page,
    pageSize: state.reviewPageSize,
  });

  state.reviews = result.items;
  state.reviewPage = result.page;
  state.reviewTotalPages = result.totalPages;
  state.reviewTotalCount = result.count;

  renderReviews();
  renderReviewPagination();
}

async function loadCoupons() {
  state.coupons = await fetchAdminCoupons({ q: el.couponSearch.value.trim() });
  renderCoupons();
}

async function loadManagedBanners() {
  state.managedBanners = await fetchAdminManagedBanners();
  clearRowEditing("banners");
  renderManagedBanners();
}

async function loadManagedProducts() {
  state.managedProducts = await fetchAdminManagedProducts({
    q: el.managedProductSearch.value.trim(),
    categoryId: el.managedProductCategoryFilter.value || undefined,
    isActive:
      el.managedProductActiveFilter.value === ""
        ? undefined
        : el.managedProductActiveFilter.value === "true",
  });
  clearRowEditing("products");
  renderManagedProducts();
}

async function loadManagedUsers() {
  state.managedUsers = await fetchAdminManagedUsers({
    q: el.memberSearch.value.trim(),
    isActive:
      el.memberActiveFilter.value === ""
        ? undefined
        : el.memberActiveFilter.value === "true",
    isStaff:
      el.memberStaffFilter.value === ""
        ? undefined
        : el.memberStaffFilter.value === "true",
  });
  renderManagedUsers();
}

async function reloadAll() {
  await Promise.all([loadStaffUsers(), loadProductMeta()]);
  await Promise.all([
    loadDashboard(),
    loadOrders(),
    loadReturns(),
    loadSettlements(),
    loadInquiries(),
    loadReviews({ page: 1 }),
    loadManagedBanners(),
    loadManagedProducts(),
    loadManagedUsers(),
    loadCoupons(),
    syncHeader(),
  ]);
}

async function handleOrderAction(button) {
  const row = button.closest("tr[data-order-no]");
  if (!row) return;

  const orderNo = row.dataset.orderNo;
  const action = button.dataset.action;

  if (action === "editOrder") {
    setRowEditing("orders", orderNo, true);
    renderOrders();
    return "edit";
  }

  if (action === "cancelOrderEdit") {
    setRowEditing("orders", orderNo, false);
    renderOrders();
    return "cancel";
  }

  if (!isRowEditing("orders", orderNo)) {
    return "noop";
  }

  const payload = {
    recipient: row.querySelector("[data-role='recipient']")?.value?.trim() || "",
    phone: row.querySelector("[data-role='phone']")?.value?.trim() || "",
    postalCode: row.querySelector("[data-role='postal-code']")?.value?.trim() || "",
    roadAddress: row.querySelector("[data-role='road-address']")?.value?.trim() || "",
    jibunAddress: row.querySelector("[data-role='jibun-address']")?.value?.trim() || "",
    detailAddress: row.querySelector("[data-role='detail-address']")?.value?.trim() || "",
    status: row.querySelector("[data-role='order-status']")?.value,
    paymentStatus: row.querySelector("[data-role='payment-status']")?.value,
    shippingStatus: row.querySelector("[data-role='shipping-status']")?.value,
    courierName: row.querySelector("[data-role='courier-name']")?.value?.trim() || "",
    trackingNo: row.querySelector("[data-role='tracking-no']")?.value?.trim() || "",
  };

  if (action === "issueInvoice") payload.issueInvoice = true;
  if (action === "markDelivered") payload.markDelivered = true;

  await updateAdminOrder(orderNo, payload);
  setRowEditing("orders", orderNo, false);
  await Promise.all([loadDashboard(), loadOrders(), loadSettlements()]);
  return action;
}

async function handleReturnAction(button) {
  const row = button.closest("tr[data-return-id]");
  if (!row) return;

  const returnId = Number(row.dataset.returnId);
  const action = button.dataset.action;

  if (action === "editReturn") {
    setRowEditing("returns", returnId, true);
    renderReturns();
    return "edit";
  }

  if (action === "cancelReturnEdit") {
    setRowEditing("returns", returnId, false);
    renderReturns();
    return "cancel";
  }

  if (action === "deleteReturn") {
    if (!confirm("이 반품/환불 요청을 삭제하시겠습니까?")) return;
    await deleteAdminReturnRequest(returnId);
    setRowEditing("returns", returnId, false);
    await Promise.all([loadDashboard(), loadReturns(), loadOrders(), loadSettlements()]);
    return "deleteReturn";
  }

  if (!isRowEditing("returns", returnId)) {
    return "noop";
  }

  await updateAdminReturnRequest(returnId, {
    status: row.querySelector("[data-role='return-status']")?.value,
    approvedAmount: Number(row.querySelector("[data-role='approved-amount']")?.value || 0),
    pickupCourierName: row.querySelector("[data-role='pickup-courier']")?.value?.trim() || "",
    pickupTrackingNo: row.querySelector("[data-role='pickup-tracking']")?.value?.trim() || "",
    rejectedReason: row.querySelector("[data-role='rejected-reason']")?.value?.trim() || "",
    adminNote: row.querySelector("[data-role='admin-note']")?.value?.trim() || "",
  });

  setRowEditing("returns", returnId, false);
  await Promise.all([loadDashboard(), loadReturns(), loadOrders(), loadSettlements()]);
  return "saveReturn";
}

async function handleSettlementAction(button) {
  const row = button.closest("tr[data-settlement-id]");
  if (!row) return;

  const settlementId = Number(row.dataset.settlementId);
  const action = button.dataset.action;

  if (action === "editSettlement") {
    setRowEditing("settlements", settlementId, true);
    renderSettlements();
    return "edit";
  }

  if (action === "cancelSettlementEdit") {
    setRowEditing("settlements", settlementId, false);
    renderSettlements();
    return "cancel";
  }

  if (action === "deleteSettlement") {
    if (!confirm("이 정산 레코드를 삭제하시겠습니까? 지급완료 건은 삭제할 수 없습니다.")) return;
    await deleteAdminSettlement(settlementId);
    setRowEditing("settlements", settlementId, false);
    await Promise.all([loadDashboard(), loadSettlements()]);
    return "deleteSettlement";
  }

  if (!isRowEditing("settlements", settlementId)) {
    return "noop";
  }

  await updateAdminSettlement(settlementId, {
    status: row.querySelector("[data-role='settlement-status']")?.value,
    pgFee: Number(row.querySelector("[data-role='pg-fee']")?.value || 0),
    platformFee: Number(row.querySelector("[data-role='platform-fee']")?.value || 0),
    returnDeduction: Number(row.querySelector("[data-role='return-deduction']")?.value || 0),
    expectedPayoutDate: row.querySelector("[data-role='expected-payout-date']")?.value || null,
    memo: row.querySelector("[data-role='settlement-memo']")?.value?.trim() || "",
    markPaid: action === "markSettlementPaid",
  });

  setRowEditing("settlements", settlementId, false);
  await Promise.all([loadDashboard(), loadSettlements()]);
  return action;
}

async function saveInquiryFromEditor() {
  if (!state.selectedInquiryId) {
    throw new Error("답변할 문의를 먼저 선택해주세요.");
  }

  await answerAdminInquiry(state.selectedInquiryId, {
    answer: el.inquiryEditorAnswer.value.trim(),
    status: el.inquiryEditorStatus.value,
    category: el.inquiryEditorCategory.value,
    priority: el.inquiryEditorPriority.value,
    assignedAdminId: Number(el.inquiryEditorAssignedAdmin.value || 0) || null,
    internalNote: el.inquiryEditorInternalNote.value.trim(),
    slaDueAt: toIsoFromLocal(el.inquiryEditorSlaDueAt.value),
  });

  await Promise.all([loadDashboard(), loadInquiries()]);
  showInquiryEditorSavedState(`저장 완료 · ${formatDateTime(new Date().toISOString())}`);
}

async function deleteInquiryAnswerFromEditor() {
  if (!state.selectedInquiryId) {
    throw new Error("답변을 삭제할 문의를 먼저 선택해주세요.");
  }

  if (!confirm("등록된 답변을 삭제하고 문의 상태를 접수로 되돌리시겠습니까?")) return;

  await answerAdminInquiry(state.selectedInquiryId, {
    deleteAnswer: true,
    status: "OPEN",
  });

  await Promise.all([loadDashboard(), loadInquiries()]);
  showInquiryEditorSavedState(`답변 삭제 완료 · ${formatDateTime(new Date().toISOString())}`);
}

async function handleReviewAction(button) {
  const row = button.closest("tr[data-review-id]");
  if (!row) return;

  const reviewId = Number(row.dataset.reviewId);
  if (button.dataset.action === "hideReview") {
    await setAdminReviewVisibility(reviewId, false);
  }
  if (button.dataset.action === "showReview") {
    await setAdminReviewVisibility(reviewId, true);
  }
  if (button.dataset.action === "deleteReview") {
    if (!confirm("리뷰를 삭제 처리하시겠습니까?")) return;
    await deleteAdminReview(reviewId);
  }

  await Promise.all([loadDashboard(), loadReviews({ page: state.reviewPage })]);
}

async function handleCouponAction(button) {
  const row = button.closest("tr[data-coupon-id]");
  if (!row) return;

  const couponId = Number(row.dataset.couponId);
  if (button.dataset.action === "deleteCoupon") {
    if (!confirm("해당 쿠폰을 삭제하시겠습니까?")) return;
    await deleteAdminCoupon(couponId);
    await Promise.all([loadDashboard(), loadCoupons()]);
  }
}

async function handleManagedBannerAction(button) {
  const row = button.closest("tr[data-banner-id]");
  if (!row) return;

  const bannerId = Number(row.dataset.bannerId);
  const action = button.dataset.action;

  if (action === "editBanner") {
    setRowEditing("banners", bannerId, true);
    renderManagedBanners();
    return "edit";
  }

  if (action === "cancelBannerEdit") {
    setRowEditing("banners", bannerId, false);
    renderManagedBanners();
    return "cancel";
  }

  if (action === "deleteBanner") {
    if (!confirm("이 배너를 삭제하시겠습니까?")) return;
    await deleteAdminManagedBanner(bannerId);
    setRowEditing("banners", bannerId, false);
    await Promise.all([loadManagedBanners(), loadDashboard()]);
    return "deleteBanner";
  }

  if (!isRowEditing("banners", bannerId)) {
    return "noop";
  }

  await updateAdminManagedBanner(bannerId, {
    title: row.querySelector("[data-role='title']")?.value?.trim() || "",
    subtitle: row.querySelector("[data-role='subtitle']")?.value?.trim() || "",
    description: row.querySelector("[data-role='description']")?.value?.trim() || "",
    ctaText: row.querySelector("[data-role='cta-text']")?.value?.trim() || "",
    linkUrl: row.querySelector("[data-role='link-url']")?.value?.trim() || "",
    sortOrder: Number(row.querySelector("[data-role='sort-order']")?.value || 0),
    isActive: row.querySelector("[data-role='is-active']")?.checked,
    imageFile: row.querySelector("[data-role='image-file']")?.files?.[0] || null,
  });
  setRowEditing("banners", bannerId, false);
  await Promise.all([loadManagedBanners(), loadDashboard()]);
  return "saveBanner";
}

async function handleManagedProductAction(button) {
  const row = button.closest("tr[data-product-id]");
  if (!row) return;

  const productId = Number(row.dataset.productId);
  const action = button.dataset.action;

  if (action === "editManagedProduct") {
    setRowEditing("products", productId, true);
    renderManagedProducts();
    return "edit";
  }

  if (action === "cancelManagedProductEdit") {
    setRowEditing("products", productId, false);
    renderManagedProducts();
    return "cancel";
  }

  if (action === "deleteManagedProduct") {
    if (!confirm("이 상품을 삭제하시겠습니까?")) return;
    await deleteAdminManagedProduct(productId);
    setRowEditing("products", productId, false);
    await Promise.all([loadManagedProducts(), loadDashboard(), loadOrders()]);
    return "deleteManagedProduct";
  }

  if (!isRowEditing("products", productId)) {
    return "noop";
  }

  const badgeTypes = getSelectedBadgeTypes(row.querySelector("[data-role='badge-types']"));
  const deleteImageIds = Array.from(row.querySelectorAll("input[data-role='delete-image-id']:checked"))
    .map((input) => Number(input.value || 0))
    .filter((value) => value > 0);
  const thumbnailImageId = Number(
    row.querySelector("input[data-role='thumbnail-image-id']:checked")?.value || 0,
  ) || undefined;
  const imageFiles = Array.from(row.querySelector("[data-role='image-files']")?.files || []);
  const categoryValue = row.querySelector("[data-role='category-id']")?.value || "";

  await updateAdminManagedProduct(productId, {
    categoryId: categoryValue ? Number(categoryValue) : null,
    sku: row.querySelector("[data-role='sku']")?.value?.trim() || "",
    name: row.querySelector("[data-role='name']")?.value?.trim() || "",
    oneLine: row.querySelector("[data-role='one-line']")?.value?.trim() || "",
    description: row.querySelector("[data-role='description']")?.value?.trim() || "",
    intake: row.querySelector("[data-role='intake']")?.value?.trim() || "",
    target: row.querySelector("[data-role='target']")?.value?.trim() || "",
    manufacturer: row.querySelector("[data-role='manufacturer']")?.value?.trim() || "",
    originCountry: row.querySelector("[data-role='origin-country']")?.value?.trim() || "",
    taxStatus: row.querySelector("[data-role='tax-status']")?.value || "TAXABLE",
    deliveryFee: Number(row.querySelector("[data-role='delivery-fee']")?.value || 0),
    freeShippingAmount: Number(row.querySelector("[data-role='free-shipping-amount']")?.value || 0),
    searchKeywords: parseKeywordList(row.querySelector("[data-role='search-keywords']")?.value || ""),
    releaseDate: row.querySelector("[data-role='release-date']")?.value || "",
    displayStartAt: toIsoFromLocal(row.querySelector("[data-role='display-start-at']")?.value || ""),
    displayEndAt: toIsoFromLocal(row.querySelector("[data-role='display-end-at']")?.value || ""),
    price: Number(row.querySelector("[data-role='price']")?.value || 0),
    originalPrice: Number(row.querySelector("[data-role='original-price']")?.value || 0),
    stock: Number(row.querySelector("[data-role='stock']")?.value || 0),
    isActive: row.querySelector("[data-role='is-active']")?.checked,
    badgeTypes,
    thumbnailFile: row.querySelector("[data-role='thumbnail-file']")?.files?.[0] || null,
    imageFiles,
    deleteImageIds,
    thumbnailImageId,
  });
  setRowEditing("products", productId, false);
  await Promise.all([loadManagedProducts(), loadDashboard()]);
  return "saveManagedProduct";
}

function bindSearchWithEnter(target, handler) {
  target?.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    try {
      await handler();
    } catch (error) {
      console.error(error);
      showNotice(error.message || "조회 중 오류가 발생했습니다.", "error");
    }
  });
}

function bindTabs() {
  el.navButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const tab = button.dataset.tabBtn;
      setActiveTab(tab);
      if (tab === "products") {
        try {
          await loadProductMeta();
          await Promise.all([loadManagedBanners(), loadManagedProducts()]);
        } catch (error) {
          console.error(error);
          showNotice(error.message || "배너/상품 정보를 불러오지 못했습니다.", "error");
        }
      }
    });
  });
  setActiveTab(state.activeTab);
}

function bind() {
  bindTabs();
  if (el.inquiryEditorDeleteBtn) {
    el.inquiryEditorDeleteBtn.disabled = true;
  }
  hideInquiryEditorSavedState();

  el.reloadBtn?.addEventListener("click", async () => {
    try {
      await reloadAll();
      showNotice("운영 데이터가 갱신되었습니다.");
    } catch (error) {
      console.error(error);
      showNotice(error.message || "새로고침 중 오류가 발생했습니다.", "error");
    }
  });

  el.generateSettlementBtn?.addEventListener("click", async () => {
    try {
      const result = await generateAdminSettlements({ onlyPaidOrders: true });
      const count = Number(result?.generated_count ?? result?.generatedCount ?? 0);
      showNotice(`정산 레코드 생성/갱신 완료: ${count}건`);
      await Promise.all([loadDashboard(), loadSettlements(), loadOrders()]);
    } catch (error) {
      console.error(error);
      showNotice(error.message || "정산 생성에 실패했습니다.", "error");
    }
  });

  [el.orderSearchBtn, el.orderStatus, el.paymentStatus, el.shippingStatus, el.orderOpenReturnOnly].forEach((target) => {
    const eventName = target?.tagName === "BUTTON" ? "click" : "change";
    target?.addEventListener(eventName, async () => {
      try {
        await loadOrders();
      } catch (error) {
        console.error(error);
        showNotice(error.message || "주문 조회에 실패했습니다.", "error");
      }
    });
  });

  [el.returnSearchBtn, el.returnStatus].forEach((target) => {
    const eventName = target?.tagName === "BUTTON" ? "click" : "change";
    target?.addEventListener(eventName, async () => {
      try {
        await loadReturns();
      } catch (error) {
        console.error(error);
        showNotice(error.message || "반품 조회에 실패했습니다.", "error");
      }
    });
  });

  [el.settlementSearchBtn, el.settlementStatus].forEach((target) => {
    const eventName = target?.tagName === "BUTTON" ? "click" : "change";
    target?.addEventListener(eventName, async () => {
      try {
        await loadSettlements();
      } catch (error) {
        console.error(error);
        showNotice(error.message || "정산 조회에 실패했습니다.", "error");
      }
    });
  });

  [el.inquirySearchBtn, el.inquiryStatus, el.inquiryCategory, el.inquiryPriority, el.inquiryOverdueOnly].forEach((target) => {
    const eventName = target?.tagName === "BUTTON" ? "click" : "change";
    target?.addEventListener(eventName, async () => {
      try {
        await loadInquiries();
      } catch (error) {
        console.error(error);
        showNotice(error.message || "CS 조회에 실패했습니다.", "error");
      }
    });
  });

  [el.reviewSearchBtn, el.reviewStatus, el.reviewSort].forEach((target) => {
    const eventName = target?.tagName === "BUTTON" ? "click" : "change";
    target?.addEventListener(eventName, async () => {
      try {
        state.reviewPage = 1;
        await loadReviews({ page: 1 });
      } catch (error) {
        console.error(error);
        showNotice(error.message || "리뷰 조회에 실패했습니다.", "error");
      }
    });
  });

  [el.managedProductSearchBtn, el.managedProductCategoryFilter, el.managedProductActiveFilter].forEach((target) => {
    const eventName = target?.tagName === "BUTTON" ? "click" : "change";
    target?.addEventListener(eventName, async () => {
      try {
        await loadManagedProducts();
      } catch (error) {
        console.error(error);
        showNotice(error.message || "상품 조회에 실패했습니다.", "error");
      }
    });
  });

  [el.memberSearchBtn, el.memberActiveFilter, el.memberStaffFilter].forEach((target) => {
    const eventName = target?.tagName === "BUTTON" ? "click" : "change";
    target?.addEventListener(eventName, async () => {
      try {
        await loadManagedUsers();
      } catch (error) {
        console.error(error);
        showNotice(error.message || "회원 조회에 실패했습니다.", "error");
      }
    });
  });

  bindSearchWithEnter(el.orderSearch, loadOrders);
  bindSearchWithEnter(el.returnSearch, loadReturns);
  bindSearchWithEnter(el.settlementSearch, loadSettlements);
  bindSearchWithEnter(el.inquirySearch, loadInquiries);
  bindSearchWithEnter(el.reviewSearch, async () => {
    state.reviewPage = 1;
    await loadReviews({ page: 1 });
  });
  bindSearchWithEnter(el.managedProductSearch, loadManagedProducts);
  bindSearchWithEnter(el.memberSearch, loadManagedUsers);

  el.orders?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    try {
      const result = await handleOrderAction(button);
      if (result === "edit") {
        showNotice("수정 모드가 활성화되었습니다.");
        return;
      }
      if (result === "cancel") {
        showNotice("수정이 취소되었습니다.");
        return;
      }
      if (result === "noop" || !result) return;
      showNotice("주문/배송 정보가 저장되었습니다.");
    } catch (error) {
      console.error(error);
      showNotice(error.message || "주문/배송 정보 업데이트에 실패했습니다.", "error");
    }
  });

  el.returnCreateForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      await createAdminReturnRequest({
        orderNo: el.returnOrderNo.value.trim(),
        reasonTitle: el.returnReasonTitle.value.trim(),
        reasonDetail: el.returnReasonDetail.value.trim(),
        requestedAmount: el.returnRequestedAmount.value ? Number(el.returnRequestedAmount.value) : undefined,
      });
      el.returnCreateForm.reset();
      showNotice("반품 요청이 등록되었습니다.");
      await Promise.all([loadDashboard(), loadReturns(), loadOrders(), loadSettlements()]);
    } catch (error) {
      console.error(error);
      showNotice(error.message || "반품 요청 등록에 실패했습니다.", "error");
    }
  });

  el.returns?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    try {
      const result = await handleReturnAction(button);
      if (result === "edit") {
        showNotice("수정 모드가 활성화되었습니다.");
        return;
      }
      if (result === "cancel") {
        showNotice("수정이 취소되었습니다.");
        return;
      }
      if (result === "noop" || !result) return;
      if (result === "deleteReturn") {
        showNotice("반품/환불 요청이 삭제되었습니다.");
      } else {
        showNotice("반품/환불 정보가 저장되었습니다.");
      }
    } catch (error) {
      console.error(error);
      showNotice(error.message || "반품/환불 처리에 실패했습니다.", "error");
    }
  });

  el.settlements?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    try {
      const result = await handleSettlementAction(button);
      if (result === "edit") {
        showNotice("수정 모드가 활성화되었습니다.");
        return;
      }
      if (result === "cancel") {
        showNotice("수정이 취소되었습니다.");
        return;
      }
      if (result === "noop" || !result) return;
      if (result === "deleteSettlement") {
        showNotice("정산 레코드가 삭제되었습니다.");
      } else {
        showNotice("정산 정보가 저장되었습니다.");
      }
    } catch (error) {
      console.error(error);
      showNotice(error.message || "정산 저장에 실패했습니다.", "error");
    }
  });

  el.inquiries?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const inquiryId = Number(button.dataset.inquiryId);
    if (!inquiryId) return;

    if (button.dataset.action === "openInquiryEditor") {
      openInquiryEditor(inquiryId);
      return;
    }

    if (button.dataset.action === "toggleInquiryAnswer") {
      toggleInquiryAnswer(inquiryId);
    }
  });

  el.inquiryEditorCloseBtn?.addEventListener("click", () => {
    closeInquiryEditor();
  });

  el.inquiryEditorSaveBtn?.addEventListener("click", async () => {
    try {
      await saveInquiryFromEditor();
      showNotice("CS 답변이 저장되었습니다.");
    } catch (error) {
      console.error(error);
      showInquiryEditorSavedState(error.message || "CS 저장에 실패했습니다.", "error");
      showNotice(error.message || "CS 저장에 실패했습니다.", "error");
    }
  });

  el.inquiryEditorDeleteBtn?.addEventListener("click", async () => {
    try {
      await deleteInquiryAnswerFromEditor();
      showNotice("CS 답변이 삭제되었습니다.");
    } catch (error) {
      console.error(error);
      showInquiryEditorSavedState(error.message || "CS 답변 삭제에 실패했습니다.", "error");
      showNotice(error.message || "CS 답변 삭제에 실패했습니다.", "error");
    }
  });

  el.bannerCreateForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      await createAdminManagedBanner({
        title: el.bannerTitle.value.trim(),
        subtitle: el.bannerSubtitle.value.trim(),
        description: el.bannerDescription.value.trim(),
        ctaText: el.bannerCtaText.value.trim(),
        linkUrl: el.bannerLinkUrl.value.trim(),
        sortOrder: Number(el.bannerSortOrder.value || 0),
        isActive: el.bannerIsActive.checked,
        imageFile: el.bannerImageFile.files?.[0] || null,
      });
      el.bannerCreateForm.reset();
      if (el.bannerIsActive) el.bannerIsActive.checked = true;
      showNotice("배너가 등록되었습니다.");
      await Promise.all([loadManagedBanners(), loadDashboard()]);
    } catch (error) {
      console.error(error);
      showNotice(error.message || "배너 등록에 실패했습니다.", "error");
    }
  });

  el.managedBanners?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    try {
      const result = await handleManagedBannerAction(button);
      if (result === "edit") {
        showNotice("수정 모드가 활성화되었습니다.");
        return;
      }
      if (result === "cancel") {
        showNotice("수정이 취소되었습니다.");
        return;
      }
      if (result === "noop" || !result) return;
      showNotice(result === "deleteBanner" ? "배너가 삭제되었습니다." : "배너 정보가 저장되었습니다.");
    } catch (error) {
      console.error(error);
      showNotice(error.message || "배너 처리에 실패했습니다.", "error");
    }
  });

  el.productCreateForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      await createAdminManagedProduct({
        categoryId: el.productCategoryId.value ? Number(el.productCategoryId.value) : null,
        sku: el.productSku.value.trim(),
        name: el.productName.value.trim(),
        oneLine: el.productOneLine.value.trim(),
        description: el.productDescription.value.trim(),
        intake: el.productIntake.value.trim(),
        target: el.productTarget.value.trim(),
        manufacturer: el.productManufacturer.value.trim(),
        originCountry: el.productOriginCountry.value.trim(),
        taxStatus: el.productTaxStatus.value || "TAXABLE",
        deliveryFee: Number(el.productDeliveryFee.value || 0),
        freeShippingAmount: Number(el.productFreeShippingAmount.value || 0),
        searchKeywords: parseKeywordList(el.productSearchKeywords.value),
        releaseDate: el.productReleaseDate.value || "",
        displayStartAt: toIsoFromLocal(el.productDisplayStartAt.value),
        displayEndAt: toIsoFromLocal(el.productDisplayEndAt.value),
        price: Number(el.productPrice.value || 0),
        originalPrice: Number(el.productOriginalPrice.value || 0),
        stock: Number(el.productStock.value || 0),
        isActive: el.productIsActive.checked,
        badgeTypes: getSelectedBadgeTypes(el.productBadgeGroup),
        thumbnailFile: el.productThumbnail.files?.[0] || null,
        imageFiles: Array.from(el.productImages.files || []),
      });
      el.productCreateForm.reset();
      if (el.productIsActive) el.productIsActive.checked = true;
      applyProductMetaToForm();
      showNotice("상품이 등록되었습니다.");
      await Promise.all([loadManagedProducts(), loadDashboard(), loadOrders()]);
    } catch (error) {
      console.error(error);
      showNotice(error.message || "상품 등록에 실패했습니다.", "error");
    }
  });

  el.managedProducts?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    try {
      const result = await handleManagedProductAction(button);
      if (result === "edit") {
        showNotice("수정 모드가 활성화되었습니다.");
        return;
      }
      if (result === "cancel") {
        showNotice("수정이 취소되었습니다.");
        return;
      }
      if (result === "noop" || !result) return;
      showNotice(result === "deleteManagedProduct" ? "상품이 삭제되었습니다." : "상품 정보가 저장되었습니다.");
    } catch (error) {
      console.error(error);
      showNotice(error.message || "상품 처리에 실패했습니다.", "error");
    }
  });

  el.reviews?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    try {
      await handleReviewAction(button);
      if (button.dataset.action === "deleteReview") {
        showNotice("리뷰가 삭제 처리되었습니다.");
      } else {
        showNotice("리뷰 노출 상태가 반영되었습니다.");
      }
    } catch (error) {
      console.error(error);
      showNotice(error.message || "리뷰 상태 변경에 실패했습니다.", "error");
    }
  });

  el.reviewPagination?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-action='goReviewPage']");
    if (!button) return;

    const page = Number(button.dataset.page);
    if (!page || page < 1 || page > state.reviewTotalPages || page === state.reviewPage) return;

    try {
      await loadReviews({ page });
    } catch (error) {
      console.error(error);
      showNotice(error.message || "리뷰 페이지 이동에 실패했습니다.", "error");
    }
  });

  el.couponTarget?.addEventListener("change", () => {
    const useEmail = el.couponTarget.value === "EMAIL";
    el.couponEmailField.classList.toggle("hidden", !useEmail);
    el.couponEmail.required = useEmail;
  });

  el.couponForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const result = await issueAdminCoupon({
        target: el.couponTarget.value,
        email: el.couponTarget.value === "EMAIL" ? el.couponEmail.value.trim() : undefined,
        name: el.couponName.value.trim(),
        code: el.couponCode.value.trim(),
        discountAmount: Number(el.couponDiscountAmount.value || 0),
        minOrderAmount: Number(el.couponMinOrderAmount.value || 0),
        expiresAt: toIsoFromLocal(el.couponExpiresAt.value),
      });

      const issuedCount = Number(result?.issued_count ?? result?.issuedCount ?? 0);
      showNotice(`쿠폰 발급 완료: ${issuedCount}건`);
      await Promise.all([loadDashboard(), loadCoupons()]);
    } catch (error) {
      console.error(error);
      showNotice(error.message || "쿠폰 발급에 실패했습니다.", "error");
    }
  });

  let couponSearchTimer = null;
  el.couponSearch?.addEventListener("input", () => {
    if (couponSearchTimer) clearTimeout(couponSearchTimer);
    couponSearchTimer = setTimeout(async () => {
      try {
        await loadCoupons();
      } catch (error) {
        console.error(error);
        showNotice(error.message || "쿠폰 조회에 실패했습니다.", "error");
      }
    }, 250);
  });

  bindSearchWithEnter(el.couponSearch, loadCoupons);

  el.coupons?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-action='deleteCoupon']");
    if (!button) return;

    try {
      await handleCouponAction(button);
      showNotice("쿠폰이 삭제되었습니다.");
    } catch (error) {
      console.error(error);
      showNotice(error.message || "쿠폰 삭제에 실패했습니다.", "error");
    }
  });
}

async function init() {
  const user = (await syncCurrentUser()) || getUser();
  if (!user) {
    alert("관리자 페이지는 로그인 후 이용할 수 있습니다.");
    location.href = "/pages/login.html";
    return;
  }

  if (!isAdminUser(user)) {
    alert("관리자 권한이 없습니다.");
    location.href = "/pages/home.html";
    return;
  }

  state.user = user;
  bind();

  try {
    await reloadAll();
  } catch (error) {
    console.error(error);
    showNotice(error.message || "관리자 데이터를 불러오지 못했습니다.", "error");
  }
}

init();

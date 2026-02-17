import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { mountSiteFooter } from "../components/footer.js";
import { getUser, syncCurrentUser } from "../services/auth-service.js";
import { cartCount } from "../services/cart-service.js";
import {
  answerAdminInquiry,
  fetchAdminCoupons,
  fetchAdminDashboard,
  fetchAdminInquiries,
  fetchAdminOrders,
  fetchAdminReviews,
  issueAdminCoupon,
  setAdminReviewVisibility,
  updateAdminOrder,
} from "../services/api.js";
import { formatCurrency } from "../store-data.js";

const headerRefs = mountSiteHeader({ showCart: true, currentNav: "" });
mountSiteFooter();

const ORDER_STATUS_OPTIONS = ["PENDING", "PAID", "FAILED", "CANCELED", "REFUNDED", "PARTIAL_REFUNDED"];
const PAYMENT_STATUS_OPTIONS = ["UNPAID", "READY", "APPROVED", "CANCELED", "FAILED"];
const SHIPPING_STATUS_OPTIONS = ["READY", "PREPARING", "SHIPPED", "DELIVERED"];
const INQUIRY_STATUS_OPTIONS = ["OPEN", "ANSWERED", "CLOSED"];

const state = {
  user: null,
  dashboard: null,
  orders: [],
  inquiries: [],
  reviews: [],
  coupons: [],
};

const el = {
  reloadBtn: document.getElementById("adminReloadBtn"),
  summary: document.getElementById("adminSummary"),
  orders: document.getElementById("adminOrders"),
  orderSearch: document.getElementById("adminOrderSearch"),
  orderStatus: document.getElementById("adminOrderStatusFilter"),
  paymentStatus: document.getElementById("adminPaymentStatusFilter"),
  shippingStatus: document.getElementById("adminShippingStatusFilter"),
  orderSearchBtn: document.getElementById("adminOrderSearchBtn"),
  inquiryStatus: document.getElementById("adminInquiryStatusFilter"),
  inquiries: document.getElementById("adminInquiries"),
  reviewStatus: document.getElementById("adminReviewStatusFilter"),
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

function isAdminUser(user) {
  return Boolean(user?.is_staff ?? user?.isStaff);
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

function toIsoFromLocal(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function renderStatusBadge(status) {
  const safe = status || "-";
  const cls = safe.toLowerCase();
  return `<span class="admin-status ${cls}">${safe}</span>`;
}

function buildOptions(options, currentValue) {
  return options
    .map((option) => `<option value="${option}" ${option === currentValue ? "selected" : ""}>${option}</option>`)
    .join("");
}

function renderSummary() {
  const summary = state.dashboard?.summary || {};
  el.summary.innerHTML = `
    <article>
      <p>총 주문건수</p>
      <strong>${summary.totalOrders || 0}건</strong>
    </article>
    <article>
      <p>승인 주문건수</p>
      <strong>${summary.paidOrders || 0}건</strong>
    </article>
    <article>
      <p>누적 결제금액</p>
      <strong>${formatCurrency(summary.totalPaidAmount || 0)}</strong>
    </article>
    <article>
      <p>오늘 결제금액</p>
      <strong>${formatCurrency(summary.todayPaidAmount || 0)}</strong>
    </article>
    <article>
      <p>배송 대기</p>
      <strong>${summary.shippingPendingCount || 0}건</strong>
    </article>
    <article>
      <p>배송 중</p>
      <strong>${summary.shippingShippedCount || 0}건</strong>
    </article>
    <article>
      <p>배송 완료</p>
      <strong>${summary.shippingDeliveredCount || 0}건</strong>
    </article>
    <article>
      <p>미답변 문의 / 숨김리뷰</p>
      <strong>${summary.openInquiryCount || 0} / ${summary.hiddenReviewCount || 0}</strong>
    </article>
  `;
}

function renderOrders() {
  if (!state.orders.length) {
    el.orders.innerHTML = '<p class="empty">조건에 맞는 주문이 없습니다.</p>';
    return;
  }

  el.orders.innerHTML = `
    <table class="admin-order-table">
      <thead>
        <tr>
          <th>주문정보</th>
          <th>회원</th>
          <th>결제</th>
          <th>배송</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        ${state.orders
          .map(
            (order) => `
            <tr data-order-no="${order.orderNo}">
              <td>
                <strong>${order.orderNo}</strong>
                <p>${formatDateTime(order.createdAt)} · ${order.itemCount}개</p>
                <p>${order.recipient} (${order.phone})</p>
              </td>
              <td>
                <p>${order.userName || "-"}</p>
                <small>${order.userEmail || "비회원"}</small>
              </td>
              <td>
                <p>${renderStatusBadge(order.status)}</p>
                <p>${renderStatusBadge(order.paymentStatus)}</p>
                <strong>${formatCurrency(order.totalAmount)}</strong>
              </td>
              <td>
                <p>${renderStatusBadge(order.shippingStatus)}</p>
                <p>${order.courierName || "택배사 미입력"}</p>
                <p>${order.trackingNo || "송장번호 미입력"}</p>
                <small>송장발급 ${formatDateTime(order.invoiceIssuedAt)}</small>
              </td>
              <td>
                <div class="admin-order-edit-grid">
                  <select data-role="order-status">
                    ${buildOptions(ORDER_STATUS_OPTIONS, order.status)}
                  </select>
                  <select data-role="payment-status">
                    ${buildOptions(PAYMENT_STATUS_OPTIONS, order.paymentStatus)}
                  </select>
                  <select data-role="shipping-status">
                    ${buildOptions(SHIPPING_STATUS_OPTIONS, order.shippingStatus)}
                  </select>
                  <input type="text" data-role="courier-name" placeholder="택배사" value="${order.courierName || ""}" />
                  <input type="text" data-role="tracking-no" placeholder="송장번호" value="${order.trackingNo || ""}" />
                  <div class="admin-inline-actions">
                    <button class="ghost" type="button" data-action="issueInvoice">송장발급</button>
                    <button class="ghost" type="button" data-action="markDelivered">배송완료</button>
                    <button class="primary" type="button" data-action="saveOrder">저장</button>
                  </div>
                </div>
              </td>
            </tr>
          `,
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderInquiries() {
  if (!state.inquiries.length) {
    el.inquiries.innerHTML = '<p class="empty">문의 내역이 없습니다.</p>';
    return;
  }

  el.inquiries.innerHTML = state.inquiries
    .map(
      (inquiry) => `
      <article class="admin-row-card" data-inquiry-id="${inquiry.id}">
        <div class="admin-row-head">
          <div>
            <strong>${inquiry.title}</strong>
            <p>${inquiry.userName || "회원"} · ${inquiry.userEmail || "-"}</p>
          </div>
          ${renderStatusBadge(inquiry.status)}
        </div>
        <p class="admin-row-content">${inquiry.content}</p>
        <label>
          <span>답변</span>
          <textarea data-role="answer" rows="3" placeholder="답변을 입력하세요.">${inquiry.answer || ""}</textarea>
        </label>
        <div class="admin-inline-actions">
          <select data-role="inquiry-status">
            ${buildOptions(INQUIRY_STATUS_OPTIONS, inquiry.status)}
          </select>
          <button class="primary" type="button" data-action="saveInquiryAnswer">답변 저장</button>
        </div>
      </article>
    `,
    )
    .join("");
}

function renderReviews() {
  if (!state.reviews.length) {
    el.reviews.innerHTML = '<p class="empty">리뷰가 없습니다.</p>';
    return;
  }

  el.reviews.innerHTML = state.reviews
    .map(
      (review) => `
      <article class="admin-row-card" data-review-id="${review.id}">
        <div class="admin-row-head">
          <div>
            <strong>${review.productName}</strong>
            <p>${review.userName || "회원"} · ${review.userEmail || "-"} · ${formatDateTime(review.createdAt)}</p>
          </div>
          <div>
            ${renderStatusBadge(review.status)}
            <span class="admin-score">${"★".repeat(review.score)}${"☆".repeat(5 - review.score)}</span>
          </div>
        </div>
        <p class="admin-row-content">${review.content}</p>
        ${
          review.images.length
            ? `<div class="admin-review-image-grid">
                ${review.images.map((image, index) => `<img src="${image}" alt="리뷰 이미지 ${index + 1}" />`).join("")}
              </div>`
            : ""
        }
        <div class="admin-inline-actions">
          <button class="ghost" type="button" data-action="hideReview" ${review.status === "HIDDEN" ? "disabled" : ""}>숨기기</button>
          <button class="primary" type="button" data-action="showReview" ${review.status === "VISIBLE" ? "disabled" : ""}>노출</button>
        </div>
      </article>
    `,
    )
    .join("");
}

function renderCoupons() {
  if (!state.coupons.length) {
    el.coupons.innerHTML = '<p class="empty">쿠폰 데이터가 없습니다.</p>';
    return;
  }

  el.coupons.innerHTML = `
    <table class="admin-coupon-table">
      <thead>
        <tr>
          <th>회원</th>
          <th>쿠폰</th>
          <th>할인/조건</th>
          <th>상태</th>
          <th>만료</th>
        </tr>
      </thead>
      <tbody>
        ${state.coupons
          .map(
            (coupon) => `
            <tr>
              <td>${coupon.userEmail || "-"}</td>
              <td>
                <strong>${coupon.name}</strong>
                <p>${coupon.code}</p>
              </td>
              <td>
                <p>${formatCurrency(coupon.discountAmount)}</p>
                <small>${coupon.minOrderAmount ? `${formatCurrency(coupon.minOrderAmount)} 이상` : "최소금액 없음"}</small>
              </td>
              <td>${coupon.isUsed ? "사용완료" : coupon.isExpired ? "만료" : "사용가능"}</td>
              <td>${formatDateTime(coupon.expiresAt)}</td>
            </tr>
          `,
          )
          .join("")}
      </tbody>
    </table>
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
}

async function loadOrders() {
  state.orders = await fetchAdminOrders({
    q: el.orderSearch.value.trim(),
    status: el.orderStatus.value,
    paymentStatus: el.paymentStatus.value,
    shippingStatus: el.shippingStatus.value,
  });
  renderOrders();
}

async function loadInquiries() {
  state.inquiries = await fetchAdminInquiries({
    status: el.inquiryStatus.value,
  });
  renderInquiries();
}

async function loadReviews() {
  state.reviews = await fetchAdminReviews({
    status: el.reviewStatus.value,
  });
  renderReviews();
}

async function loadCoupons() {
  state.coupons = await fetchAdminCoupons({ q: el.couponSearch.value.trim() });
  renderCoupons();
}

async function reloadAll() {
  await Promise.all([loadDashboard(), loadOrders(), loadInquiries(), loadReviews(), loadCoupons(), syncHeader()]);
}

async function handleOrderAction(button) {
  const row = button.closest("tr[data-order-no]");
  if (!row) return;

  const orderNo = row.dataset.orderNo;
  const status = row.querySelector("[data-role='order-status']")?.value;
  const paymentStatus = row.querySelector("[data-role='payment-status']")?.value;
  const shippingStatus = row.querySelector("[data-role='shipping-status']")?.value;
  const courierName = row.querySelector("[data-role='courier-name']")?.value?.trim() || "";
  const trackingNo = row.querySelector("[data-role='tracking-no']")?.value?.trim() || "";

  const action = button.dataset.action;
  const payload = {
    status,
    paymentStatus,
    shippingStatus,
    courierName,
    trackingNo,
  };

  if (action === "issueInvoice") payload.issueInvoice = true;
  if (action === "markDelivered") payload.markDelivered = true;

  await updateAdminOrder(orderNo, payload);
  await Promise.all([loadDashboard(), loadOrders()]);
}

async function handleInquiryAction(button) {
  const row = button.closest("[data-inquiry-id]");
  if (!row) return;

  const inquiryId = Number(row.dataset.inquiryId);
  const answer = row.querySelector("[data-role='answer']")?.value?.trim();
  const status = row.querySelector("[data-role='inquiry-status']")?.value;

  if (!answer) {
    alert("답변 내용을 입력해주세요.");
    return;
  }

  await answerAdminInquiry(inquiryId, { answer, status });
  await Promise.all([loadDashboard(), loadInquiries()]);
}

async function handleReviewAction(button) {
  const row = button.closest("[data-review-id]");
  if (!row) return;
  const reviewId = Number(row.dataset.reviewId);

  if (button.dataset.action === "hideReview") {
    await setAdminReviewVisibility(reviewId, false);
  }
  if (button.dataset.action === "showReview") {
    await setAdminReviewVisibility(reviewId, true);
  }

  await Promise.all([loadDashboard(), loadReviews()]);
}

function bind() {
  el.reloadBtn?.addEventListener("click", async () => {
    try {
      await reloadAll();
    } catch (error) {
      console.error(error);
      alert(error.message || "새로고침 중 오류가 발생했습니다.");
    }
  });

  el.orderSearchBtn?.addEventListener("click", async () => {
    try {
      await loadOrders();
    } catch (error) {
      console.error(error);
      alert(error.message || "주문 조회에 실패했습니다.");
    }
  });

  [el.orderStatus, el.paymentStatus, el.shippingStatus].forEach((select) => {
    select?.addEventListener("change", async () => {
      try {
        await loadOrders();
      } catch (error) {
        console.error(error);
        alert(error.message || "주문 조회에 실패했습니다.");
      }
    });
  });

  el.inquiryStatus?.addEventListener("change", async () => {
    try {
      await loadInquiries();
    } catch (error) {
      console.error(error);
      alert(error.message || "문의 목록 조회에 실패했습니다.");
    }
  });

  el.reviewStatus?.addEventListener("change", async () => {
    try {
      await loadReviews();
    } catch (error) {
      console.error(error);
      alert(error.message || "리뷰 목록 조회에 실패했습니다.");
    }
  });

  el.orders?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    try {
      await handleOrderAction(button);
      alert("주문/배송 정보가 저장되었습니다.");
    } catch (error) {
      console.error(error);
      alert(error.message || "주문/배송 정보 업데이트에 실패했습니다.");
    }
  });

  el.inquiries?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-action='saveInquiryAnswer']");
    if (!button) return;

    try {
      await handleInquiryAction(button);
      alert("문의 답변이 저장되었습니다.");
    } catch (error) {
      console.error(error);
      alert(error.message || "문의 답변 저장에 실패했습니다.");
    }
  });

  el.reviews?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    try {
      await handleReviewAction(button);
      alert("리뷰 노출 상태가 반영되었습니다.");
    } catch (error) {
      console.error(error);
      alert(error.message || "리뷰 상태 변경에 실패했습니다.");
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
      alert(`쿠폰 발급 완료: ${issuedCount}건`);
      await Promise.all([loadDashboard(), loadCoupons()]);
    } catch (error) {
      console.error(error);
      alert(error.message || "쿠폰 발급에 실패했습니다.");
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
        alert(error.message || "쿠폰 조회에 실패했습니다.");
      }
    }, 250);
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
    alert(error.message || "관리자 데이터를 불러오지 못했습니다.");
  }
}

init();

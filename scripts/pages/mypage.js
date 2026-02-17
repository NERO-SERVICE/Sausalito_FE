import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { mountSiteFooter } from "../components/footer.js";
import { getUser, syncCurrentUser } from "../services/auth-service.js";
import { cartCount } from "../services/cart-service.js";
import { fetchMyOrders, fetchMyPageDashboard } from "../services/api.js";
import { formatCurrency } from "../store-data.js";

const headerRefs = mountSiteHeader({ showCart: true, currentNav: "" });
mountSiteFooter();

const SECTION_META = {
  dashboard: {
    title: "마이쇼핑 홈",
    description: "총 주문/혜택/진행현황을 한눈에 확인하세요.",
  },
  orders: {
    title: "주문내역조회",
    description: "기간별 주문내역과 처리 상태를 조회할 수 있습니다.",
  },
  claims: {
    title: "취소/반품/교환내역",
    description: "취소/반품/교환 관련 주문 이력을 확인합니다.",
  },
  coupons: {
    title: "쿠폰내역",
    description: "보유 쿠폰의 할인 정보와 사용 가능 기간을 확인하세요.",
  },
};

const state = {
  user: null,
  dashboard: null,
  orders: [],
  activeSection: "dashboard",
};

const el = {
  sidebarGreeting: document.getElementById("myshopSidebarGreeting"),
  sectionTitle: document.getElementById("myshopSectionTitle"),
  sectionDescription: document.getElementById("myshopSectionDescription"),
  navLinks: Array.from(document.querySelectorAll("[data-section-link]")),
  sections: Array.from(document.querySelectorAll("[data-section]")),
  kpi: document.getElementById("myshopKpi"),
  orderStage: document.getElementById("myshopOrderStage"),
  orderStatusFilter: document.getElementById("myshopOrderStatusFilter"),
  orderRangeFilter: document.getElementById("myshopOrderRangeFilter"),
  orderTable: document.getElementById("myshopOrderTable"),
  claimStatusFilter: document.getElementById("myshopClaimStatusFilter"),
  claimRangeFilter: document.getElementById("myshopClaimRangeFilter"),
  claimTable: document.getElementById("myshopClaimTable"),
  couponTable: document.getElementById("myshopCouponTable"),
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

function getRangeDate(range) {
  const now = new Date();
  if (range === "today") {
    now.setHours(0, 0, 0, 0);
    return now;
  }
  if (range === "1m") {
    now.setMonth(now.getMonth() - 1);
    return now;
  }
  if (range === "3m") {
    now.setMonth(now.getMonth() - 3);
    return now;
  }
  now.setMonth(now.getMonth() - 6);
  return now;
}

function isWithinRange(dateValue, range) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;
  const boundary = getRangeDate(range);
  return date >= boundary;
}

function deriveOrderProgressStatus(order) {
  if (order.status === "CANCELED") return "주문취소";
  if (order.status === "REFUNDED" || order.status === "PARTIAL_REFUNDED") return "환불완료";
  if (order.paymentStatus === "UNPAID" || order.paymentStatus === "READY") return "입금전";
  if (order.shippingStatus === "SHIPPED") return "배송중";
  if (order.shippingStatus === "DELIVERED") return "배송완료";
  if (order.shippingStatus === "READY" || order.shippingStatus === "PREPARING") return "배송준비중";
  if (order.status === "FAILED" || order.paymentStatus === "FAILED") return "결제실패";
  if (order.paymentStatus === "APPROVED") return "결제완료";
  return "주문접수";
}

function getOrderStatusLabel(order) {
  const progress = deriveOrderProgressStatus(order);
  if (progress === "입금전" || progress === "배송준비중" || progress === "배송중" || progress === "배송완료") {
    return progress;
  }
  if (order.status === "FAILED" || order.paymentStatus === "FAILED") return "결제실패";
  if (order.status === "PAID") return "결제완료";
  if (order.status === "CANCELED") return "주문취소";
  if (order.status === "REFUNDED" || order.status === "PARTIAL_REFUNDED") return "환불완료";
  if (order.status === "PENDING") return "주문접수";
  return order.status || "-";
}

function matchesOrderStatusFilter(order, filter) {
  if (filter === "ALL") return true;
  if (filter === "PREPARING") {
    return deriveOrderProgressStatus(order) === "배송준비중";
  }
  if (filter === "SHIPPED") {
    return deriveOrderProgressStatus(order) === "배송중";
  }
  if (filter === "DELIVERED") {
    return deriveOrderProgressStatus(order) === "배송완료";
  }
  if (filter === "PENDING") {
    return deriveOrderProgressStatus(order) === "입금전";
  }
  if (filter === "REFUNDED") {
    return order.status === "REFUNDED" || order.status === "PARTIAL_REFUNDED";
  }
  return order.status === filter || order.paymentStatus === filter;
}

function mapClaimType(order) {
  if (order.status === "CANCELED") return "CANCEL";
  if (order.status === "REFUNDED" || order.status === "PARTIAL_REFUNDED") return "RETURN";
  return "";
}

function mapClaimLabel(type) {
  if (type === "CANCEL") return "취소";
  if (type === "RETURN") return "반품/환불";
  return "교환";
}

function renderSectionVisibility() {
  el.navLinks.forEach((link) => {
    const section = link.dataset.sectionLink;
    link.classList.toggle("is-active", section === state.activeSection);
  });
  el.sections.forEach((section) => {
    const visible = section.dataset.section === state.activeSection;
    section.hidden = !visible;
  });

  const meta = SECTION_META[state.activeSection] || SECTION_META.dashboard;
  el.sectionTitle.textContent = meta.title;
  el.sectionDescription.textContent = meta.description;
}

function setActiveSection(section, syncUrl = true) {
  if (!SECTION_META[section]) return;
  state.activeSection = section;
  renderSectionVisibility();
  if (syncUrl) {
    const url = new URL(location.href);
    url.searchParams.set("tab", section);
    history.replaceState({}, "", url.toString());
  }
}

function renderKpi() {
  const summary = state.dashboard?.shopping?.summary || {
    pointBalance: 0,
    couponCount: 0,
    orderCount: 0,
  };
  el.kpi.innerHTML = `
    <article>
      <p>총 적립금</p>
      <strong>${formatCurrency(summary.pointBalance)}</strong>
    </article>
    <article>
      <p>쿠폰(개수)</p>
      <strong>${summary.couponCount}장</strong>
    </article>
    <article>
      <p>총주문(횟수)</p>
      <strong>${summary.orderCount}회</strong>
    </article>
  `;
}

function renderOrderStage() {
  const counts = {
    beforePayment: 0,
    preparing: 0,
    shipping: 0,
    delivered: 0,
  };
  state.orders.forEach((order) => {
    const status = deriveOrderProgressStatus(order);
    if (status === "입금전") counts.beforePayment += 1;
    if (status === "배송준비중") counts.preparing += 1;
    if (status === "배송중") counts.shipping += 1;
    if (status === "배송완료") counts.delivered += 1;
  });

  el.orderStage.innerHTML = `
    <article><p>입금전</p><strong>${counts.beforePayment}</strong></article>
    <article><p>배송준비중</p><strong>${counts.preparing}</strong></article>
    <article><p>배송중</p><strong>${counts.shipping}</strong></article>
    <article><p>배송완료</p><strong>${counts.delivered}</strong></article>
  `;
}

function renderOrderTable() {
  const statusFilter = el.orderStatusFilter.value;
  const rangeFilter = el.orderRangeFilter.value;
  const rows = state.orders
    .filter((order) => isWithinRange(order.createdAt, rangeFilter))
    .filter((order) => matchesOrderStatusFilter(order, statusFilter));

  if (!rows.length) {
    el.orderTable.innerHTML = '<p class="empty">조회 조건에 맞는 주문내역이 없습니다.</p>';
    return;
  }

  el.orderTable.innerHTML = `
    <div class="myshop-table-wrap">
      <table class="myshop-table">
        <thead>
          <tr>
            <th>주문일자</th>
            <th>주문번호</th>
            <th>상품수</th>
            <th>주문금액</th>
            <th>주문처리상태</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (order) => `
            <tr>
              <td>${formatDate(order.createdAt)}</td>
              <td><a href="/pages/mypage.html?tab=orders">${escapeHtml(order.orderNo)}</a></td>
              <td>${order.itemCount}개</td>
              <td>${formatCurrency(order.totalAmount)}</td>
              <td>${escapeHtml(getOrderStatusLabel(order))}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderClaimTable() {
  const statusFilter = el.claimStatusFilter.value;
  const rangeFilter = el.claimRangeFilter.value;
  const rows = state.orders
    .filter((order) => isWithinRange(order.createdAt, rangeFilter))
    .map((order) => ({
      order,
      claimType: mapClaimType(order),
    }))
    .filter((row) => row.claimType);

  const filtered = rows.filter((row) => {
    if (statusFilter === "ALL") return true;
    if (statusFilter === "EXCHANGE") return false;
    return row.claimType === statusFilter;
  });

  if (!filtered.length) {
    el.claimTable.innerHTML = '<p class="empty">조회 조건에 맞는 취소/반품/교환내역이 없습니다.</p>';
    return;
  }

  el.claimTable.innerHTML = `
    <div class="myshop-table-wrap">
      <table class="myshop-table">
        <thead>
          <tr>
            <th>접수일자</th>
            <th>주문번호</th>
            <th>구분</th>
            <th>처리상태</th>
            <th>금액</th>
          </tr>
        </thead>
        <tbody>
          ${filtered
            .map(
              ({ order, claimType }) => `
            <tr>
              <td>${formatDate(order.createdAt)}</td>
              <td>${escapeHtml(order.orderNo)}</td>
              <td>${mapClaimLabel(claimType)}</td>
              <td>${escapeHtml(getOrderStatusLabel(order))}</td>
              <td>${formatCurrency(order.totalAmount)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderCouponTable() {
  const coupons = state.dashboard?.shopping?.couponHistory || [];
  if (!coupons.length) {
    el.couponTable.innerHTML = '<p class="empty">보유한 쿠폰이 없습니다.</p>';
    return;
  }

  el.couponTable.innerHTML = `
    <div class="myshop-table-wrap">
      <table class="myshop-table">
        <thead>
          <tr>
            <th>쿠폰명</th>
            <th>할인금액/비율</th>
            <th>사용가능 기간</th>
            <th>쿠폰적용상품</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          ${coupons
            .map(
              (coupon) => `
            <tr>
              <td>${escapeHtml(coupon.name)}</td>
              <td>${formatCurrency(coupon.discountAmount)} / -</td>
              <td>${formatDate(coupon.createdAt)} ~ ${coupon.expiresAt ? formatDate(coupon.expiresAt) : "무기한"}</td>
              <td>전상품</td>
              <td>${coupon.isUsed ? "사용완료" : coupon.isExpired ? "만료" : "사용가능"}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderAll() {
  const profile = state.dashboard?.profile || {};
  el.sidebarGreeting.textContent = `${profile.name || profile.email || "회원"}님의 쇼핑 정보를 확인하세요.`;
  renderKpi();
  renderOrderStage();
  renderOrderTable();
  renderClaimTable();
  renderCouponTable();
  renderSectionVisibility();
}

async function syncHeader() {
  let count = 0;
  try {
    count = await cartCount();
  } catch {
    count = 0;
  }
  syncSiteHeader(headerRefs, {
    userName: state.user?.name || state.user?.email || null,
    isAdmin: Boolean(state.user?.is_staff ?? state.user?.isStaff),
    cartCountValue: count,
  });
}

el.navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const section = link.dataset.sectionLink;
    if (!section) return;
    event.preventDefault();
    setActiveSection(section);
  });
});

[el.orderStatusFilter, el.orderRangeFilter].forEach((target) => {
  target?.addEventListener("change", renderOrderTable);
});

[el.claimStatusFilter, el.claimRangeFilter].forEach((target) => {
  target?.addEventListener("change", renderClaimTable);
});

(async function init() {
  const user = (await syncCurrentUser()) || getUser();
  if (!user) {
    alert("마이페이지는 로그인 후 이용할 수 있습니다.");
    location.href = "/pages/login.html";
    return;
  }
  state.user = user;

  const tab = new URLSearchParams(location.search).get("tab");
  if (tab && SECTION_META[tab]) {
    state.activeSection = tab;
  }

  try {
    const [dashboard, orders] = await Promise.all([fetchMyPageDashboard(), fetchMyOrders()]);
    state.dashboard = dashboard;
    state.orders = orders;
    renderAll();
    await syncHeader();
  } catch (error) {
    console.error(error);
    alert(error.message || "마이페이지 데이터를 불러오지 못했습니다.");
  }
})();

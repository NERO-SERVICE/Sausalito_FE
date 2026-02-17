import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { mountSiteFooter } from "../components/footer.js";
import { getUser, logout, syncCurrentUser } from "../services/auth-service.js";
import { cartCount } from "../services/cart-service.js";
import {
  changeMyPassword,
  createMyInquiry,
  fetchMyPageDashboard,
  removeWishlistItem,
  updateMyProfile,
} from "../services/api.js";
import { formatCurrency, resolveProductImage } from "../store-data.js";

const headerRefs = mountSiteHeader({ showCart: true, currentNav: "" });
mountSiteFooter();

const state = {
  user: null,
  dashboard: null,
  inquiryFormOpen: false,
};

const el = {
  greeting: document.getElementById("mypageGreeting"),
  summary: document.getElementById("mypageSummary"),
  orders: document.getElementById("mypageOrders"),
  pointHistory: document.getElementById("mypagePointHistory"),
  depositHistory: document.getElementById("mypageDepositHistory"),
  couponHistory: document.getElementById("mypageCouponHistory"),
  recentProducts: document.getElementById("mypageRecentProducts"),
  wishlistProducts: document.getElementById("mypageWishlistProducts"),
  myReviews: document.getElementById("mypageMyReviews"),
  profileForm: document.getElementById("mypageProfileForm"),
  passwordForm: document.getElementById("mypagePasswordForm"),
  inquiryForm: document.getElementById("mypageInquiryForm"),
  inquiryHistory: document.getElementById("mypageInquiryHistory"),
  email: document.getElementById("mypageEmail"),
  name: document.getElementById("mypageName"),
  phone: document.getElementById("mypagePhone"),
  oldPassword: document.getElementById("mypageOldPassword"),
  newPassword: document.getElementById("mypageNewPassword"),
  newPasswordConfirm: document.getElementById("mypageNewPasswordConfirm"),
  inquiryTitle: document.getElementById("inquiryTitle"),
  inquiryContent: document.getElementById("inquiryContent"),
  openInquiryBtn: document.getElementById("openInquiryBtn"),
  cancelInquiryBtn: document.getElementById("cancelInquiryBtn"),
  logoutBtn: document.getElementById("mypageLogoutBtn"),
};

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

function renderListBlock(target, listHtml, emptyText) {
  if (!target) return;
  if (!listHtml) {
    target.innerHTML = `<p class="empty">${emptyText}</p>`;
    return;
  }
  target.innerHTML = listHtml;
}

function renderSummary() {
  const summary = state.dashboard?.shopping?.summary || {
    orderCount: 0,
    pointBalance: 0,
    depositBalance: 0,
    couponCount: 0,
  };
  el.summary.innerHTML = `
    <article>
      <p>주문내역</p>
      <strong>${summary.orderCount}건</strong>
    </article>
    <article>
      <p>적립금</p>
      <strong>${formatCurrency(summary.pointBalance)}</strong>
    </article>
    <article>
      <p>예치금</p>
      <strong>${formatCurrency(summary.depositBalance)}</strong>
    </article>
    <article>
      <p>사용 가능 쿠폰</p>
      <strong>${summary.couponCount}장</strong>
    </article>
  `;
}

function renderOrders() {
  const orders = state.dashboard?.shopping?.orders || [];
  const html = orders
    .map((order) => {
      return `
        <article class="mypage-order-row">
          <div>
            <strong>${order.orderNo}</strong>
            <p>${formatDateTime(order.createdAt)} · ${order.itemCount}개 상품</p>
          </div>
          <div>
            <span>${order.status}</span>
            <b>${formatCurrency(order.totalAmount)}</b>
          </div>
        </article>
      `;
    })
    .join("");
  renderListBlock(el.orders, html, "주문내역이 없습니다.");
}

function renderMoneyHistory() {
  const points = state.dashboard?.shopping?.pointHistory || [];
  const deposits = state.dashboard?.shopping?.depositHistory || [];

  const pointHtml = points
    .map(
      (row) => `
      <article class="mypage-money-row">
        <div>
          <strong>${row.description || "적립금 변동"}</strong>
          <p>${formatDateTime(row.createdAt)}</p>
        </div>
        <div>
          <b class="${row.amount >= 0 ? "up" : "down"}">${row.amount >= 0 ? "+" : ""}${formatCurrency(row.amount)}</b>
          <small>잔액 ${formatCurrency(row.balanceAfter)}</small>
        </div>
      </article>
    `,
    )
    .join("");
  renderListBlock(el.pointHistory, pointHtml, "적립금 내역이 없습니다.");

  const depositHtml = deposits
    .map(
      (row) => `
      <article class="mypage-money-row">
        <div>
          <strong>${row.description || "예치금 변동"}</strong>
          <p>${formatDateTime(row.createdAt)}</p>
        </div>
        <div>
          <b class="${row.amount >= 0 ? "up" : "down"}">${row.amount >= 0 ? "+" : ""}${formatCurrency(row.amount)}</b>
          <small>잔액 ${formatCurrency(row.balanceAfter)}</small>
        </div>
      </article>
    `,
    )
    .join("");
  renderListBlock(el.depositHistory, depositHtml, "예치금 내역이 없습니다.");
}

function renderCoupons() {
  const coupons = state.dashboard?.shopping?.couponHistory || [];
  const html = coupons
    .map(
      (coupon) => `
      <article class="mypage-coupon-row">
        <div>
          <strong>${coupon.name}</strong>
          <p>${coupon.code} · ${coupon.minOrderAmount ? `${formatCurrency(coupon.minOrderAmount)} 이상` : "최소 금액 제한 없음"}</p>
        </div>
        <div>
          <b>${formatCurrency(coupon.discountAmount)}</b>
          <small>${coupon.isUsed ? "사용완료" : coupon.isExpired ? "만료" : "사용가능"}</small>
        </div>
      </article>
    `,
    )
    .join("");
  renderListBlock(el.couponHistory, html, "보유 쿠폰이 없습니다.");
}

function renderProductGrid(target, products, emptyText, showRemove = false) {
  const html = products
    .map(
      (product) => `
      <article class="mypage-product-card">
        <a href="/pages/detail.html?id=${product.id}">
          <img src="${resolveProductImage(product.image)}" alt="${product.name}" />
        </a>
        <div>
          <a class="mypage-product-name" href="/pages/detail.html?id=${product.id}">${product.name}</a>
          <p>${formatCurrency(product.price)}</p>
          ${
            showRemove
              ? `<button class="ghost mypage-wish-remove" data-action="removeWishlist" data-id="${product.id}">삭제</button>`
              : ""
          }
        </div>
      </article>
    `,
    )
    .join("");
  renderListBlock(target, html, emptyText);
}

function renderReviews() {
  const reviews = state.dashboard?.activity?.myReviews || [];
  const html = reviews
    .map(
      (review) => `
      <article class="mypage-review-row">
        <div>
          <b>${"★".repeat(review.score)}${"☆".repeat(5 - review.score)}</b>
          <span>${review.date}</span>
        </div>
        <p>${review.text}</p>
        <a href="/pages/detail.html?id=${review.productId}">상품 보러가기</a>
      </article>
    `,
    )
    .join("");
  renderListBlock(el.myReviews, html, "작성한 리뷰가 없습니다.");
}

function renderInquiries() {
  const inquiries = state.dashboard?.inquiries || [];
  const html = inquiries
    .map(
      (inquiry) => `
      <article class="mypage-inquiry-row">
        <div>
          <strong>${inquiry.title}</strong>
          <span>${inquiry.status}</span>
        </div>
        <p>${inquiry.content}</p>
        <small>${formatDateTime(inquiry.created_at || inquiry.createdAt)}</small>
      </article>
    `,
    )
    .join("");
  renderListBlock(el.inquiryHistory, html, "등록된 문의가 없습니다.");
}

function renderProfile() {
  const profile = state.dashboard?.profile || {};
  el.email.value = profile.email || "";
  el.name.value = profile.name || "";
  el.phone.value = profile.phone || "";
}

function renderInquiryForm() {
  if (!el.inquiryForm) return;
  el.inquiryForm.classList.toggle("hidden", !state.inquiryFormOpen);
}

function render() {
  const profile = state.dashboard?.profile || {};
  el.greeting.textContent = `${profile.name || profile.email || "회원"}님, 쇼핑/활동 내역을 확인하세요.`;
  renderSummary();
  renderOrders();
  renderMoneyHistory();
  renderCoupons();
  renderProductGrid(
    el.recentProducts,
    state.dashboard?.activity?.recentProducts || [],
    "최근 본 상품이 없습니다.",
  );
  renderProductGrid(
    el.wishlistProducts,
    state.dashboard?.activity?.wishlistProducts || [],
    "위시리스트가 비어 있습니다.",
    true,
  );
  renderReviews();
  renderProfile();
  renderInquiries();
  renderInquiryForm();
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
  state.dashboard = await fetchMyPageDashboard();
  render();
}

el.profileForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await updateMyProfile({
      name: el.name.value.trim(),
      phone: el.phone.value.trim(),
    });
    await loadDashboard();
    await syncHeader();
    alert("회원 정보가 저장되었습니다.");
  } catch (error) {
    console.error(error);
    alert(error.message || "회원 정보 저장에 실패했습니다.");
  }
});

el.passwordForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await changeMyPassword({
      oldPassword: el.oldPassword.value,
      newPassword: el.newPassword.value,
      newPasswordConfirm: el.newPasswordConfirm.value,
    });
    el.oldPassword.value = "";
    el.newPassword.value = "";
    el.newPasswordConfirm.value = "";
    alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
    await logout();
    location.href = "/pages/login.html";
  } catch (error) {
    console.error(error);
    alert(error.message || "비밀번호 변경에 실패했습니다.");
  }
});

el.openInquiryBtn?.addEventListener("click", () => {
  state.inquiryFormOpen = true;
  renderInquiryForm();
});

el.cancelInquiryBtn?.addEventListener("click", () => {
  state.inquiryFormOpen = false;
  renderInquiryForm();
});

el.inquiryForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await createMyInquiry({
      title: el.inquiryTitle.value.trim(),
      content: el.inquiryContent.value.trim(),
    });
    el.inquiryTitle.value = "";
    el.inquiryContent.value = "";
    state.inquiryFormOpen = false;
    await loadDashboard();
    alert("문의가 접수되었습니다.");
  } catch (error) {
    console.error(error);
    alert(error.message || "문의 등록에 실패했습니다.");
  }
});

el.wishlistProducts?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action='removeWishlist']");
  if (!button) return;

  const productId = Number(button.dataset.id);
  if (!productId) return;

  try {
    await removeWishlistItem(productId);
    await loadDashboard();
  } catch (error) {
    console.error(error);
    alert(error.message || "위시리스트 삭제에 실패했습니다.");
  }
});

el.logoutBtn?.addEventListener("click", async () => {
  await logout();
  location.href = "/pages/home.html";
});

(async function init() {
  const user = (await syncCurrentUser()) || getUser();
  if (!user) {
    alert("마이페이지는 로그인 후 이용할 수 있습니다.");
    location.href = "/pages/login.html";
    return;
  }
  state.user = user;

  try {
    await loadDashboard();
    await syncHeader();
  } catch (error) {
    console.error(error);
    alert(error.message || "마이페이지 데이터를 불러오지 못했습니다.");
  }
})();

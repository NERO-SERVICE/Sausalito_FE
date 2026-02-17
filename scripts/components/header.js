import { logout } from "../services/auth-service.js";

const MAIN_LOGO_SRC = "../dist/assets/logo/main_logo.svg";
const MAIN_LOGO_FALLBACKS = ["/dist/assets/logo/main_logo.svg", "dist/assets/logo/main_logo.svg"];

export function mountSiteHeader({ showCart = true, currentNav = "" } = {}) {
  const mount = document.getElementById("siteHeaderMount");
  if (!mount) return { accountLink: null, adminLink: null, logoutBtn: null, cartCount: null };

  mount.innerHTML = `
    <header class="site-header">
      <div class="site-header-top">
        <a class="brand" href="/pages/home.html">
          <img src="${MAIN_LOGO_SRC}" alt="소살리토" class="brand-logo" />
          <div>
            <h1>소살리토</h1>
            <p>러너를 위한 웰니스 브랜드</p>
          </div>
        </a>
        <div class="header-actions">
          <div class="header-account">
            <a class="text-btn" href="/pages/login.html" id="accountLink">로그인</a>
            <a class="text-btn" href="/pages/admin.html" id="adminLink" hidden>관리자</a>
            <button class="icon-btn header-logout-btn" id="logoutBtn" type="button" hidden>로그아웃</button>
          </div>
          ${
            showCart
              ? `<a class="icon-btn cart-link" href="/pages/cart.html" aria-label="장바구니">
                   <svg class="cart-svg" viewBox="0 0 24 24" aria-hidden="true">
                     <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                     <circle cx="10" cy="19" r="1.6" fill="currentColor"/>
                     <circle cx="17" cy="19" r="1.6" fill="currentColor"/>
                   </svg>
                   <span class="cart-link-label">장바구니</span>
                   <span class="count" id="cartCount">0</span>
                 </a>`
              : ""
          }
        </div>
      </div>
      <div class="site-anchor-nav-wrap">
        <nav class="site-anchor-nav">
          <a href="/pages/home.html" class="${currentNav === "home" ? "active" : ""}">홈</a>
          <a href="/pages/brand.html" class="${currentNav === "brand" ? "active" : ""}">브랜드</a>
          <a href="/pages/shop.html" class="${currentNav === "shop" ? "active" : ""}">쇼핑</a>
          <a href="/pages/reviews.html" class="${currentNav === "review" ? "active" : ""}">리뷰</a>
        </nav>
      </div>
    </header>
  `;

  const logoImage = mount.querySelector(".brand-logo");
  if (logoImage) {
    let fallbackIndex = 0;
    logoImage.addEventListener("error", () => {
      if (fallbackIndex >= MAIN_LOGO_FALLBACKS.length) return;
      logoImage.src = MAIN_LOGO_FALLBACKS[fallbackIndex];
      fallbackIndex += 1;
    });
  }

  const logoutBtn = mount.querySelector("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await logout();
      } catch (error) {
        console.error(error);
      } finally {
        location.href = "/pages/home.html";
      }
    });
  }

  return {
    accountLink: mount.querySelector("#accountLink"),
    adminLink: mount.querySelector("#adminLink"),
    logoutBtn,
    cartCount: mount.querySelector("#cartCount"),
  };
}

export function syncSiteHeader(refs, { userName = null, isAdmin = false, cartCountValue = null } = {}) {
  if (refs.accountLink) {
    if (userName) {
      refs.accountLink.textContent = "마이페이지";
      refs.accountLink.href = "/pages/mypage.html";
    } else {
      refs.accountLink.textContent = "로그인";
      refs.accountLink.href = "/pages/login.html";
    }
  }
  if (refs.adminLink) refs.adminLink.hidden = !userName || !isAdmin;
  if (refs.logoutBtn) refs.logoutBtn.hidden = !userName;
  if (refs.cartCount && typeof cartCountValue === "number") refs.cartCount.textContent = cartCountValue;
}

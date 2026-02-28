import { initClientRuntime } from "../services/client-runtime.js";

const MAIN_LOGO_SRC = "/assets/logo/main_logo.svg";
const MAIN_LOGO_FALLBACKS = [];

export function mountSiteHeader({ showCart = true, currentNav = "" } = {}) {
  initClientRuntime();
  const mount = document.getElementById("siteHeaderMount");
  if (!mount) return { accountLink: null, accountLabel: null, cartCount: null };

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
          ${
            showCart
              ? `<a class="icon-btn header-icon-link cart-link" href="/pages/cart.html" aria-label="장바구니">
                   <svg class="header-action-icon cart-svg" viewBox="0 0 24 24" aria-hidden="true">
                     <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                     <circle cx="10" cy="19" r="1.6" fill="currentColor"/>
                     <circle cx="17" cy="19" r="1.6" fill="currentColor"/>
                   </svg>
                   <span class="header-action-label cart-link-label">장바구니</span>
                   <span class="count" id="cartCount">0</span>
                 </a>`
              : ""
          }
          <a class="icon-btn header-icon-link account-link" href="/pages/login.html" id="accountLink" aria-label="로그인">
            <svg class="header-action-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.8" />
              <path d="M4.5 20a7.5 7.5 0 0 1 15 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <span class="header-action-label" id="accountLabel">로그인</span>
          </a>
        </div>
      </div>
      <div class="site-anchor-nav-wrap">
        <nav class="site-anchor-nav">
          <a href="/pages/home.html" class="${currentNav === "home" ? "active" : ""}">홈</a>
          <a href="/pages/brand.html" class="${currentNav === "brand" ? "active" : ""}">브랜드</a>
          <a href="/pages/shop.html" class="${currentNav === "shop" ? "active" : ""}">상품</a>
          <a href="/pages/reviews.html" class="${currentNav === "review" ? "active" : ""}">리뷰</a>
          <a href="/pages/support.html" class="${currentNav === "support" ? "active" : ""}">고객지원</a>
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

  return {
    accountLink: mount.querySelector("#accountLink"),
    accountLabel: mount.querySelector("#accountLabel"),
    cartCount: mount.querySelector("#cartCount"),
  };
}

export function syncSiteHeader(refs, { userName = null, isAdmin = false, cartCountValue = null } = {}) {
  void isAdmin;
  if (refs.accountLink) {
    if (userName) {
      refs.accountLink.href = "/pages/mypage.html";
      refs.accountLink.setAttribute("aria-label", "마이페이지");
      if (refs.accountLabel) refs.accountLabel.textContent = "마이페이지";
    } else {
      refs.accountLink.href = "/pages/login.html";
      refs.accountLink.setAttribute("aria-label", "로그인");
      if (refs.accountLabel) refs.accountLabel.textContent = "로그인";
    }
  }
  if (refs.cartCount && typeof cartCountValue === "number") refs.cartCount.textContent = cartCountValue;
}

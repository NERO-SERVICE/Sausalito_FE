export function mountSiteHeader({ showCart = true, currentNav = "" } = {}) {
  const mount = document.getElementById("siteHeaderMount");
  if (!mount) return { loginLink: null, cartCount: null };

  mount.innerHTML = `
    <header class="site-header">
      <div class="site-header-top">
        <a class="brand" href="/pages/home.html">
          <img src="/dist/assets/logo/main_logo.svg" alt="소살리토" class="brand-logo" />
          <div>
            <h1>소살리토</h1>
            <p>트렌디 웰니스 셀렉트샵</p>
          </div>
        </a>
        <div class="header-actions">
          <a class="text-btn" href="/pages/login.html" id="loginLink">로그인</a>
          ${showCart ? '<a class="icon-btn" href="/pages/cart.html">장바구니 <span class="count" id="cartCount">0</span></a>' : ""}
        </div>
      </div>
      <div class="site-anchor-nav-wrap">
        <nav class="site-anchor-nav">
          <a href="/pages/brand.html" class="${currentNav === "brand" ? "active" : ""}">브랜드</a>
          <a href="/pages/shop.html" class="${currentNav === "shop" ? "active" : ""}">쇼핑</a>
          <a href="/pages/reviews.html" class="${currentNav === "review" ? "active" : ""}">리뷰</a>
        </nav>
      </div>
    </header>
  `;

  return {
    loginLink: mount.querySelector("#loginLink"),
    cartCount: mount.querySelector("#cartCount"),
  };
}

export function syncSiteHeader(refs, { userName = null, cartCountValue = null } = {}) {
  if (refs.loginLink) refs.loginLink.textContent = userName ? `${userName}님` : "로그인";
  if (refs.cartCount && typeof cartCountValue === "number") refs.cartCount.textContent = cartCountValue;
}

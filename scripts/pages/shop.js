import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { fetchProducts } from "../services/api.js";
import { getUser, syncCurrentUser } from "../services/auth-service.js";
import { cartCount } from "../services/cart-service.js";
import { formatCurrency, resolveProductImage } from "../store-data.js";
import { mountSiteFooter } from "../components/footer.js";

const headerRefs = mountSiteHeader({ showCart: true, currentNav: "shop" });
mountSiteFooter();

const state = {
  products: [],
  loadingProducts: true,
  loadError: false,
};

const el = {
  main: document.querySelector(".shop-main"),
  searchInput: document.getElementById("shopSearchInput"),
  sortSelect: document.getElementById("shopSortSelect"),
  productGrid: document.getElementById("shopProductGrid"),
};

function ensurePageLoadHint() {
  if (!el.main) return null;
  let hint = document.getElementById("shopPageLoadHint");
  if (hint) return hint;

  hint = document.createElement("p");
  hint.id = "shopPageLoadHint";
  hint.className = "ux-load-hint ux-page-load";
  hint.setAttribute("aria-live", "polite");
  el.main.insertBefore(hint, el.productGrid);
  return hint;
}

function updatePageLoadHint() {
  const hint = ensurePageLoadHint();
  if (!hint) return;

  if (state.loadingProducts) {
    hint.textContent = "상품 정보를 먼저 표시하고 있습니다. 이미지는 순서대로 나타납니다";
    hint.classList.remove("is-hidden", "is-error");
    return;
  }

  if (state.loadError) {
    hint.textContent = "상품 데이터를 불러오지 못했습니다. 새로고침 후 다시 시도해주세요";
    hint.classList.remove("is-hidden");
    hint.classList.add("is-error");
    return;
  }

  hint.classList.add("is-hidden");
}

function renderProductSkeleton(count = 8) {
  el.productGrid.innerHTML = Array.from({ length: count })
    .map(
      () => `
        <article class="home-product-card is-skeleton" aria-hidden="true">
          <div class="home-product-thumb ux-skeleton"></div>
          <div class="home-product-meta">
            <div class="ux-skeleton ux-skeleton-line is-title"></div>
            <div class="ux-skeleton ux-skeleton-line is-wide"></div>
            <div class="ux-skeleton ux-skeleton-line is-mid"></div>
            <div class="home-product-price">
              <div class="ux-skeleton ux-skeleton-line is-short"></div>
              <div class="ux-skeleton ux-skeleton-line is-mid"></div>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
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

function getFilteredProducts() {
  const keyword = el.searchInput.value.trim().toLowerCase();
  const sort = el.sortSelect.value;

  let list = [...state.products];

  if (keyword) {
    list = list.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword)
        || (product.oneLine || product.description).toLowerCase().includes(keyword),
    );
  }

  if (sort === "popular") list.sort((a, b) => b.popularScore - a.popularScore);
  if (sort === "review") list.sort((a, b) => b.reviews - a.reviews);
  if (sort === "priceAsc") list.sort((a, b) => a.price - b.price);
  if (sort === "priceDesc") list.sort((a, b) => b.price - a.price);
  if (sort === "newest") list.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

  return list;
}

function renderProducts() {
  if (state.loadingProducts) {
    renderProductSkeleton();
    return;
  }

  if (state.loadError) {
    el.productGrid.innerHTML = '<p class="empty">상품 데이터를 불러오지 못했습니다.</p>';
    return;
  }

  const list = getFilteredProducts();

  if (!list.length) {
    el.productGrid.innerHTML = '<p class="empty">검색 결과가 없습니다.</p>';
    return;
  }

  el.productGrid.innerHTML = list
    .map((product, index) => {
      const discountRate = Math.round(
        (1 - product.price / product.originalPrice) * 100,
      );

      return `
        <a class="home-product-card" href="/pages/detail.html?id=${product.id}">
          <div class="home-product-thumb">
            <img
              src="${resolveProductImage(product.image)}"
              alt="${product.name}"
              loading="${index < 4 ? "eager" : "lazy"}"
              decoding="async"
            />
          </div>
          <div class="home-product-meta">
            <strong>${product.name}</strong>
            <p>${product.oneLine || product.description}</p>
            <div class="home-product-price">
              <small>${formatCurrency(product.originalPrice)}</small>
              <div><span>${discountRate}%</span><b>${formatCurrency(product.price)}</b></div>
            </div>
          </div>
        </a>`;
    })
    .join("");
}

function bind() {
  el.searchInput.addEventListener("input", renderProducts);
  el.sortSelect.addEventListener("change", renderProducts);
}

async function init() {
  bind();
  renderProducts();
  updatePageLoadHint();
  el.searchInput.disabled = true;
  el.sortSelect.disabled = true;

  const headerTask = syncHeader().catch((error) => {
    console.error(error);
  });

  const productTask = fetchProducts()
    .then((products) => {
      state.products = Array.isArray(products) ? products : [];
    })
    .catch((error) => {
      console.error(error);
      state.loadError = true;
      state.products = [];
    })
    .finally(() => {
      state.loadingProducts = false;
      el.searchInput.disabled = false;
      el.sortSelect.disabled = false;
      renderProducts();
      updatePageLoadHint();
    });

  await Promise.allSettled([headerTask, productTask]);
}

init();

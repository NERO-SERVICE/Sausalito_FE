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
};

const el = {
  searchInput: document.getElementById("shopSearchInput"),
  sortSelect: document.getElementById("shopSortSelect"),
  productGrid: document.getElementById("shopProductGrid"),
};

async function syncHeader() {
  const user = (await syncCurrentUser()) || getUser();
  let count = 0;
  try {
    count = await cartCount();
  } catch {
    count = 0;
  }

  syncSiteHeader(headerRefs, {
    userName: user?.name || null,
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
        product.name.toLowerCase().includes(keyword) ||
        (product.oneLine || product.description).toLowerCase().includes(keyword),
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
  const list = getFilteredProducts();

  if (!list.length) {
    el.productGrid.innerHTML = '<p class="empty">검색 결과가 없습니다.</p>';
    return;
  }

  el.productGrid.innerHTML = list
    .map((product) => {
      const discountRate = Math.round(
        (1 - product.price / product.originalPrice) * 100,
      );

      return `
        <a class="home-product-card" href="/pages/detail.html?id=${product.id}">
          <div class="home-product-thumb">
            <img src="${resolveProductImage(product.image)}" alt="${product.name}" />
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
  try {
    state.products = await fetchProducts();
    await syncHeader();
    renderProducts();
    bind();
  } catch (error) {
    console.error(error);
    el.productGrid.innerHTML = '<p class="empty">상품 데이터를 불러오지 못했습니다.</p>';
  }
}

init();

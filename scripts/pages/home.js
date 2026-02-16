import { fetchProducts } from "../services/api.js";
import { cartCount } from "../services/cart-service.js";
import { getUser } from "../services/auth-service.js";
import { formatCurrency, resolveProductImage } from "../store-data.js";
import { mountSiteHeader, syncSiteHeader } from "../components/header.js";

const banners = [
  {
    subtitle: "APRIL CURATION",
    title: "이달의 아이템 01",
    description: "매일의 웰니스 루틴을 위한 핵심 구성",
    promo: "매일 아침,\n건강한 시작",
    image: "/dist/img/products/dummy1.png",
  },
  {
    subtitle: "APRIL CURATION",
    title: "이달의 아이템 02",
    description: "한 달 집중 케어를 위한 추천 셀렉션",
    promo: "지금 가장\n인기있는 구성",
    image: "/dist/img/products/dummy2.png",
  },
  {
    subtitle: "APRIL CURATION",
    title: "이달의 아이템 03",
    description: "컨디션 회복을 위한 데일리 루틴",
    promo: "간편하지만\n확실한 루틴",
    image: "/dist/img/products/dummy3.png",
  },
  {
    subtitle: "APRIL CURATION",
    title: "이달의 아이템 04",
    description: "장기 섭취 고객을 위한 가치 패키지",
    promo: "정기 케어\n추천 패키지",
    image: "/dist/img/products/p4.svg",
  },
];

const state = { bannerIndex: 0, products: [] };
let timer = null;
const headerRefs = mountSiteHeader({ showCart: true });

const el = {
  bannerTrack: document.getElementById("homeBannerTrack"),
  bannerDots: document.getElementById("homeBannerDots"),
  bannerPrev: document.getElementById("bannerPrev"),
  bannerNext: document.getElementById("bannerNext"),
  productGrid: document.getElementById("productGrid"),
  searchInput: document.getElementById("searchInput"),
  priceFilter: document.getElementById("priceFilter"),
  sortFilter: document.getElementById("sortFilter"),
};

function setHeaderState() {
  const user = getUser();
  syncSiteHeader(headerRefs, {
    userName: user?.name || null,
    cartCountValue: cartCount(),
  });
}

function setBanner(index) {
  state.bannerIndex = (index + banners.length) % banners.length;
  document.querySelectorAll(".home-banner-slide").forEach((slide, i) => slide.classList.toggle("active", i === state.bannerIndex));
  document.querySelectorAll(".home-banner-dot").forEach((dot, i) => dot.classList.toggle("active", i === state.bannerIndex));
}

function startAuto() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => setBanner(state.bannerIndex + 1), 4000);
}

function renderBanner() {
  el.bannerTrack.innerHTML = banners
    .map(
      (item, i) => `
      <article class="home-banner-slide ${i === 0 ? "active" : ""}">
        <img src="${item.image}" alt="${item.title}" />
        <div class="home-banner-overlay">
          <p class="home-banner-promo">${item.promo.replace(/\n/g, "<br />")}</p>
          <div class="home-banner-copy">
            <p>${item.subtitle}</p>
            <h2>${item.title}</h2>
            <p>${item.description}</p>
          </div>
        </div>
      </article>`,
    )
    .join("");

  el.bannerDots.innerHTML = banners
    .map((_, i) => `<button class="home-banner-dot ${i === 0 ? "active" : ""}" data-dot="${i}" aria-label="${i + 1}번 배너"></button>`)
    .join("");
}

function getFilteredProducts() {
  const keyword = el.searchInput.value.trim().toLowerCase();
  const range = el.priceFilter.value;
  const sort = el.sortFilter.value;
  let list = [...state.products];

  if (keyword) list = list.filter((p) => p.name.toLowerCase().includes(keyword) || p.description.toLowerCase().includes(keyword));
  if (range !== "all") {
    const [min, max] = range.split("-").map(Number);
    list = list.filter((p) => p.price >= min && p.price <= max);
  }

  if (sort === "popular") list.sort((a, b) => b.popularScore - a.popularScore);
  if (sort === "newest") list.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
  if (sort === "priceAsc") list.sort((a, b) => a.price - b.price);
  if (sort === "priceDesc") list.sort((a, b) => b.price - a.price);

  return list;
}

function renderProducts() {
  const list = getFilteredProducts();
  if (!list.length) {
    el.productGrid.innerHTML = '<p class="empty">조건에 맞는 상품이 없습니다.</p>';
    return;
  }

  el.productGrid.innerHTML = list
    .map((p) => {
      const discountRate = Math.round((1 - p.price / p.originalPrice) * 100);
      return `
        <a class="product-card product-card-link" href="/pages/detail.html?id=${p.id}">
          <div class="product-thumb"><img src="${resolveProductImage(p.image)}" alt="${p.name}" /></div>
          <div class="product-meta">
            <h4>${p.name}</h4>
            <p>${p.oneLine || p.description}</p>
          </div>
          <div class="price-stack">
            <small class="old-price">${formatCurrency(p.originalPrice)}</small>
            <div class="new-price-row"><span class="discount-rate">${discountRate}%</span><strong class="new-price">${formatCurrency(p.price)}</strong></div>
          </div>
          <div class="review-count">리뷰 (${p.reviews.toLocaleString("ko-KR")})</div>
        </a>`;
    })
    .join("");
}

function bind() {
  el.bannerPrev.addEventListener("click", () => {
    setBanner(state.bannerIndex - 1);
    startAuto();
  });
  el.bannerNext.addEventListener("click", () => {
    setBanner(state.bannerIndex + 1);
    startAuto();
  });
  el.bannerDots.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-dot]");
    if (!btn) return;
    setBanner(Number(btn.dataset.dot));
    startAuto();
  });

  [el.searchInput, el.priceFilter, el.sortFilter].forEach((node) => {
    node.addEventListener("input", renderProducts);
    node.addEventListener("change", renderProducts);
  });
}

async function init() {
  state.products = await fetchProducts();
  setHeaderState();
  renderBanner();
  setBanner(0);
  startAuto();
  renderProducts();
  bind();
}

init();

import {
  fetchProducts,
  fetchHomeBanners,
  fetchFeaturedReviews,
} from "../services/api.js";
import { cartCount } from "../services/cart-service.js";
import { getUser } from "../services/auth-service.js";
import { formatCurrency, resolveProductImage } from "../store-data.js";
import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { mountSiteFooter } from "../components/footer.js";

const headerRefs = mountSiteHeader({ showCart: true, currentNav: "home" });
mountSiteFooter();

const state = {
  products: [],
  banners: [],
  reviews: [],
  heroIndex: 0,
};

let heroTimer = null;

const el = {
  heroTrack: document.getElementById("homeHeroTrack"),
  heroDots: document.getElementById("homeHeroDots"),
  heroPrev: document.getElementById("heroPrev"),
  heroNext: document.getElementById("heroNext"),
  bestProductGrid: document.getElementById("bestProductGrid"),
  bestReviewList: document.getElementById("bestReviewList"),
};

function setHeaderState() {
  const user = getUser();
  syncSiteHeader(headerRefs, {
    userName: user?.name || null,
    cartCountValue: cartCount(),
  });
}

function setHero(index) {
  state.heroIndex = (index + state.banners.length) % state.banners.length;
  document
    .querySelectorAll(".home-hero-slide")
    .forEach((slide, slideIndex) =>
      slide.classList.toggle("active", slideIndex === state.heroIndex),
    );
  document
    .querySelectorAll(".home-hero-dot")
    .forEach((dot, dotIndex) =>
      dot.classList.toggle("active", dotIndex === state.heroIndex),
    );
}

function startHeroAuto() {
  if (heroTimer) clearInterval(heroTimer);
  heroTimer = setInterval(() => setHero(state.heroIndex + 1), 4000);
}

function renderHero() {
  el.heroTrack.innerHTML = state.banners
    .map(
      (banner, index) => `
      <article class="home-hero-slide ${index === 0 ? "active" : ""}">
        <img src="${banner.image}" alt="${banner.title}" />
        <div class="home-hero-overlay">
          <div class="home-hero-copy">
            <p>${banner.subtitle}</p>
            <h2>${banner.title}</h2>
            <p>${banner.description}</p>
            <a class="home-hero-link" href="${banner.link}">${banner.cta}</a>
          </div>
        </div>
      </article>`,
    )
    .join("");

  el.heroDots.innerHTML = state.banners
    .map(
      (_, index) =>
        `<button class="home-hero-dot ${index === 0 ? "active" : ""}" data-dot="${index}" aria-label="${index + 1}번 배너"></button>`,
    )
    .join("");
}

function renderProductCards(targetEl, products) {
  targetEl.innerHTML = products
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

function renderBestReviews() {
  el.bestReviewList.innerHTML = state.reviews
    .map((review) => {
      const product = state.products.find((item) => item.id === review.productId);
      return `
        <a class="home-review-card" href="/pages/detail.html?id=${review.productId}">
          <div class="home-review-head">
            <strong>${product?.name || "상품"}</strong>
            <span>${review.user} · ${review.date}</span>
          </div>
          <p>${review.text}</p>
          <div class="home-review-foot">
            <b>${"★".repeat(review.score)}${"☆".repeat(5 - review.score)}</b>
            <span>도움돼요 ${review.helpful}</span>
          </div>
        </a>`;
    })
    .join("");
}

function bind() {
  el.heroPrev.addEventListener("click", () => {
    setHero(state.heroIndex - 1);
    startHeroAuto();
  });
  el.heroNext.addEventListener("click", () => {
    setHero(state.heroIndex + 1);
    startHeroAuto();
  });
  el.heroDots.addEventListener("click", (event) => {
    const dotButton = event.target.closest("[data-dot]");
    if (!dotButton) return;
    setHero(Number(dotButton.dataset.dot));
    startHeroAuto();
  });
}

async function init() {
  const [products, banners, reviews] = await Promise.all([
    fetchProducts(),
    fetchHomeBanners(),
    fetchFeaturedReviews(6),
  ]);

  state.products = products;
  state.banners = banners;
  state.reviews = reviews;

  const bestProducts = [...products]
    .sort((a, b) => b.popularScore - a.popularScore)
    .slice(0, 8);
  setHeaderState();
  renderHero();
  setHero(0);
  startHeroAuto();
  renderProductCards(el.bestProductGrid, bestProducts);
  renderBestReviews();
  bind();
}

init();

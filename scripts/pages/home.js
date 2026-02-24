import {
  fetchProducts,
  fetchHomeBanners,
  fetchBestReviews,
} from "../services/api.js";
import { cartCount } from "../services/cart-service.js";
import { getUser, syncCurrentUser } from "../services/auth-service.js";
import { formatCurrency, resolveBannerImage, resolveProductImage } from "../store-data.js";
import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { mountSiteFooter } from "../components/footer.js";

const headerRefs = mountSiteHeader({ showCart: true, currentNav: "home" });
mountSiteFooter();

const state = {
  products: [],
  productMap: new Map(),
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
  bestReviewSection: document.getElementById("bestReview"),
  bestReviewList: document.getElementById("bestReviewList"),
};

async function setHeaderState() {
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

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderStars(score) {
  const safeScore = Math.max(0, Math.min(5, Number(score || 0)));
  return `${"★".repeat(safeScore)}${"☆".repeat(5 - safeScore)}`;
}

function getReviewImage(review) {
  const imageList = Array.isArray(review.images) ? review.images.filter(Boolean) : [];
  if (imageList.length) return imageList[0];
  if (review.image) return review.image;
  const product = state.productMap.get(Number(review.productId));
  return resolveProductImage(product?.image, { useFallback: true });
}

function setHero(index) {
  if (!state.banners.length) return;
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
  if (!state.banners.length) return;
  if (heroTimer) clearInterval(heroTimer);
  heroTimer = setInterval(() => setHero(state.heroIndex + 1), 4000);
}

function renderHero() {
  if (!state.banners.length) {
    el.heroTrack.innerHTML = "";
    el.heroDots.innerHTML = "";
    return;
  }

  el.heroTrack.innerHTML = state.banners
    .map(
      (banner, index) => `
      <article class="home-hero-slide ${index === 0 ? "active" : ""}">
        <img
          src="${resolveBannerImage(banner.image)}"
          alt="${banner.title}"
          loading="${index === 0 ? "eager" : "lazy"}"
          decoding="async"
        />
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
  if (!state.reviews.length) {
    el.bestReviewList.innerHTML = "";
    el.bestReviewSection?.classList.add("is-hidden");
    return;
  }
  el.bestReviewSection?.classList.remove("is-hidden");

  el.bestReviewList.innerHTML = state.reviews
    .map((review) => {
      const reviewImage = getReviewImage(review);
      return `
        <article class="rv-best-card">
          <a class="rv-best-thumb-link" href="/pages/detail.html?id=${review.productId}">
            <img class="rv-best-thumb" src="${escapeHtml(reviewImage)}" alt="리뷰 이미지" />
          </a>
          <div class="rv-best-body">
            <p class="rv-best-title">${escapeHtml(review.title || "고객 리뷰")}</p>
            <p class="rv-best-text">${escapeHtml(review.text || "")}</p>
            <div class="rv-best-stars" aria-label="별점 ${Number(review.score || 0)}점">${renderStars(review.score)}</div>
          </div>
        </article>`;
    })
    .join("");
}

function bind() {
  if (!state.banners.length) return;
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
  try {
    const [products, banners, reviews] = await Promise.all([
      fetchProducts(),
      fetchHomeBanners(),
      fetchBestReviews(10),
    ]);

    state.products = products;
    state.productMap = new Map(products.map((product) => [Number(product.id), product]));
    state.banners = banners;
    state.reviews = reviews;

    const bestProducts = [...products]
      .sort((a, b) => b.popularScore - a.popularScore)
      .slice(0, 8);

    await setHeaderState();
    renderHero();
    setHero(0);
    startHeroAuto();
    renderProductCards(el.bestProductGrid, bestProducts);
    renderBestReviews();
    bind();
  } catch (error) {
    console.error(error);
    alert("홈 데이터를 불러오지 못했습니다. 백엔드 서버 상태를 확인해주세요.");
  }
}

init();

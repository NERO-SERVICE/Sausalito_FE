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
  loading: {
    products: true,
    banners: true,
    reviews: true,
  },
  errors: {
    products: false,
    banners: false,
    reviews: false,
  },
};

let heroTimer = null;
let heroBound = false;

const el = {
  main: document.querySelector(".home-main"),
  heroTrack: document.getElementById("homeHeroTrack"),
  heroDots: document.getElementById("homeHeroDots"),
  heroPrev: document.getElementById("heroPrev"),
  heroNext: document.getElementById("heroNext"),
  bestProductGrid: document.getElementById("bestProductGrid"),
  bestReviewSection: document.getElementById("bestReview"),
  bestReviewList: document.getElementById("bestReviewList"),
};

function ensurePageLoadHint() {
  if (!el.main) return null;
  let hint = document.getElementById("homePageLoadHint");
  if (hint) return hint;

  hint = document.createElement("p");
  hint.id = "homePageLoadHint";
  hint.className = "ux-load-hint ux-page-load";
  hint.setAttribute("aria-live", "polite");
  el.main.prepend(hint);
  return hint;
}

function updatePageLoadHint() {
  const hint = ensurePageLoadHint();
  if (!hint) return;

  const isLoading = state.loading.products || state.loading.banners || state.loading.reviews;
  if (isLoading) {
    hint.textContent = "텍스트와 화면을 먼저 보여드리는 중입니다. 이미지는 순서대로 로딩됩니다";
    hint.classList.remove("is-hidden", "is-error");
    return;
  }

  const hasError = state.errors.products || state.errors.banners || state.errors.reviews;
  if (hasError) {
    hint.textContent = "일부 데이터를 불러오지 못했습니다. 새로고침 후 다시 시도해주세요";
    hint.classList.remove("is-hidden");
    hint.classList.add("is-error");
    return;
  }

  hint.classList.add("is-hidden");
}

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
  const imageList = Array.isArray(review.images)
    ? review.images
      .map((image) => resolveProductImage(image, { useFallback: false }))
      .filter(Boolean)
    : [];
  if (imageList.length) return imageList[0];
  if (review.image) return resolveProductImage(review.image, { useFallback: false });
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

function renderHeroSkeleton() {
  el.heroTrack.innerHTML = `
    <article class="home-hero-slide active" aria-hidden="true">
      <div class="home-hero-skeleton ux-skeleton"></div>
      <div class="home-hero-overlay">
        <div class="home-hero-copy">
          <p class="ux-load-hint">메인 이미지를 준비하고 있습니다</p>
        </div>
      </div>
    </article>
  `;
  el.heroDots.innerHTML = "";
}

function renderHeroFallback() {
  if (heroTimer) clearInterval(heroTimer);
  el.heroTrack.innerHTML = `
    <article class="home-hero-fallback">
      <p>배너를 불러오지 못했습니다.</p>
    </article>
  `;
  el.heroDots.innerHTML = "";
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
              loading="${index < 2 ? "eager" : "lazy"}"
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

function renderProductSkeleton(targetEl, count = 8) {
  targetEl.innerHTML = Array.from({ length: count })
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

function renderBestReviewSkeleton(count = 5) {
  el.bestReviewSection?.classList.remove("is-hidden");
  el.bestReviewList.innerHTML = Array.from({ length: count })
    .map(
      () => `
        <article class="rv-best-card is-skeleton" aria-hidden="true">
          <div class="rv-best-thumb-link ux-skeleton"></div>
          <div class="rv-best-body">
            <div class="ux-skeleton ux-skeleton-line is-mid"></div>
            <div class="ux-skeleton ux-skeleton-line is-wide"></div>
            <div class="ux-skeleton ux-skeleton-line is-short"></div>
          </div>
        </article>
      `,
    )
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
            <img
              class="rv-best-thumb"
              src="${escapeHtml(reviewImage)}"
              alt="리뷰 이미지"
              loading="lazy"
              decoding="async"
            />
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
  if (heroBound) return;
  heroBound = true;

  el.heroPrev.addEventListener("click", () => {
    if (!state.banners.length) return;
    setHero(state.heroIndex - 1);
    startHeroAuto();
  });
  el.heroNext.addEventListener("click", () => {
    if (!state.banners.length) return;
    setHero(state.heroIndex + 1);
    startHeroAuto();
  });
  el.heroDots.addEventListener("click", (event) => {
    if (!state.banners.length) return;
    const dotButton = event.target.closest("[data-dot]");
    if (!dotButton) return;
    setHero(Number(dotButton.dataset.dot));
    startHeroAuto();
  });
}

function renderBestProductSection() {
  if (state.loading.products) {
    renderProductSkeleton(el.bestProductGrid);
    return;
  }

  if (!state.products.length) {
    el.bestProductGrid.innerHTML = '<p class="empty">상품 정보를 불러오지 못했습니다.</p>';
    return;
  }

  const bestProducts = [...state.products]
    .sort((a, b) => b.popularScore - a.popularScore)
    .slice(0, 8);
  renderProductCards(el.bestProductGrid, bestProducts);
}

function renderBestReviewSection() {
  if (state.loading.reviews) {
    renderBestReviewSkeleton();
    return;
  }
  renderBestReviews();
}

function renderHeroSection() {
  if (state.loading.banners) {
    renderHeroSkeleton();
    return;
  }

  if (!state.banners.length) {
    renderHeroFallback();
    return;
  }

  renderHero();
  setHero(0);
  startHeroAuto();
}

async function init() {
  bind();
  renderHeroSection();
  renderBestProductSection();
  renderBestReviewSection();
  updatePageLoadHint();

  const headerTask = setHeaderState().catch((error) => {
    console.error(error);
  });

  const productTask = fetchProducts()
    .then((products) => {
      state.products = Array.isArray(products) ? products : [];
      state.productMap = new Map(state.products.map((product) => [Number(product.id), product]));
    })
    .catch((error) => {
      console.error(error);
      state.errors.products = true;
      state.products = [];
      state.productMap = new Map();
    })
    .finally(() => {
      state.loading.products = false;
      renderBestProductSection();
      if (!state.loading.reviews) {
        renderBestReviewSection();
      }
      updatePageLoadHint();
    });

  const bannerTask = fetchHomeBanners()
    .then((banners) => {
      state.banners = Array.isArray(banners) ? banners : [];
    })
    .catch((error) => {
      console.error(error);
      state.errors.banners = true;
      state.banners = [];
    })
    .finally(() => {
      state.loading.banners = false;
      renderHeroSection();
      updatePageLoadHint();
    });

  const reviewTask = fetchBestReviews(10)
    .then((reviews) => {
      state.reviews = Array.isArray(reviews) ? reviews : [];
    })
    .catch((error) => {
      console.error(error);
      state.errors.reviews = true;
      state.reviews = [];
    })
    .finally(() => {
      state.loading.reviews = false;
      renderBestReviewSection();
      updatePageLoadHint();
    });

  await Promise.allSettled([headerTask, productTask, bannerTask, reviewTask]);
}

init();

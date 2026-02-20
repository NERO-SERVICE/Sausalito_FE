import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { fetchAllReviews, fetchProducts } from "../services/api.js";
import { getUser, syncCurrentUser } from "../services/auth-service.js";
import { cartCount } from "../services/cart-service.js";
import { resolveProductImage } from "../store-data.js";
import { mountSiteFooter } from "../components/footer.js";

const headerRefs = mountSiteHeader({ showCart: true, currentNav: "review" });
mountSiteFooter();

const BEST_PAGE_SIZE = 10;
const ALL_PAGE_SIZE = 5;
const ALL_PAGE_WINDOW = 10;

const state = {
  products: [],
  productMap: new Map(),
  reviews: [],
  bestPage: 1,
  listPage: 1,
  listSort: "score",
  isPolicyOpen: false,
};

const el = {
  bestSection: document.getElementById("rvBestSection"),
  bestGrid: document.getElementById("rvBestGrid"),
  bestPrevButton: document.querySelector("[data-action='bestPrev']"),
  bestNextButton: document.querySelector("[data-action='bestNext']"),
  allList: document.getElementById("rvAllList"),
  allPagination: document.getElementById("rvAllPagination"),
  sortRadios: [...document.querySelectorAll("input[name='rvSort']")],
  policyModal: document.getElementById("rvPolicyModal"),
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toDateText(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

function getReviewTimestamp(review) {
  if (review.createdAt) {
    const created = new Date(review.createdAt).getTime();
    if (Number.isFinite(created)) return created;
  }
  if (typeof review.date === "string" && review.date) {
    const parsed = new Date(review.date.replaceAll(".", "-")).getTime();
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function sortByLatest(list = []) {
  return [...list].sort((a, b) => getReviewTimestamp(b) - getReviewTimestamp(a));
}

function sortByScore(list = []) {
  return [...list].sort((a, b) => b.score - a.score || getReviewTimestamp(b) - getReviewTimestamp(a));
}

function getProduct(review) {
  return state.productMap.get(Number(review.productId)) || null;
}

function getReviewImages(review) {
  const images = Array.isArray(review.images) ? review.images.filter(Boolean) : [];
  if (images.length) return images.slice(0, 3);
  if (review.image) return [review.image];
  const product = getProduct(review);
  if (!product) return [];
  return [resolveProductImage(product.image, { useFallback: true })];
}

function renderStars(score) {
  const safeScore = Math.max(0, Math.min(5, Number(score || 0)));
  return `${"★".repeat(safeScore)}${"☆".repeat(5 - safeScore)}`;
}

function renderAdminReply(review) {
  if (!review.adminReply) return "";
  return `
    <div class="rv-reply">
      <p>${escapeHtml(review.adminReply)}</p>
      <small>관리자 올림</small>
    </div>
  `;
}

function renderBestCard(review) {
  const reviewImage = getReviewImages(review)[0] || resolveProductImage(null);

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
    </article>
  `;
}

function renderListRow(review) {
  const product = getProduct(review);
  const productName = product?.name || "상품";
  const productImage = resolveProductImage(product?.image, { useFallback: true });
  const dateText = review.date || toDateText(review.createdAt);
  const images = getReviewImages(review);

  return `
    <article class="rv-row">
      <div class="rv-row-left">
        <strong>${escapeHtml(review.user || "회원")}</strong>
        <span>${escapeHtml(dateText)}</span>
      </div>
      <div class="rv-row-right">
        <div class="rv-row-stars">${renderStars(review.score)}</div>
        <a class="rv-product-line is-list" href="/pages/detail.html?id=${review.productId}">
          <img class="rv-product-thumb" src="${escapeHtml(productImage)}" alt="${escapeHtml(productName)}" />
          <span>${escapeHtml(productName)}</span>
        </a>
        <p class="rv-row-text">${escapeHtml(review.text || "")}</p>
        <div class="rv-row-images">
          ${images
            .map((image, index) => `<img class="rv-row-image" src="${escapeHtml(image)}" alt="리뷰 이미지 ${index + 1}" />`)
            .join("")}
        </div>
        ${renderAdminReply(review)}
      </div>
    </article>
  `;
}

function renderBestSection() {
  const bestReviews = sortByLatest(state.reviews.filter((review) => review.isBest));
  if (!bestReviews.length) {
    el.bestSection.classList.add("is-hidden");
    el.bestGrid.innerHTML = "";
    if (el.bestPrevButton) el.bestPrevButton.disabled = true;
    if (el.bestNextButton) el.bestNextButton.disabled = true;
    return;
  }
  el.bestSection.classList.remove("is-hidden");

  const totalPages = Math.max(1, Math.ceil(bestReviews.length / BEST_PAGE_SIZE));
  state.bestPage = Math.min(Math.max(1, state.bestPage), totalPages);
  const start = (state.bestPage - 1) * BEST_PAGE_SIZE;
  const visible = bestReviews.slice(start, start + BEST_PAGE_SIZE);

  el.bestGrid.innerHTML = visible.map(renderBestCard).join("");
  if (el.bestPrevButton) el.bestPrevButton.disabled = state.bestPage <= 1;
  if (el.bestNextButton) el.bestNextButton.disabled = state.bestPage >= totalPages;
}

function syncAllImageSizeWithBest() {
  const bestThumb = el.bestGrid?.querySelector(".rv-best-thumb");
  if (!bestThumb) {
    document.documentElement.style.removeProperty("--rv-best-photo-size");
    return;
  }

  const size = Math.round(bestThumb.getBoundingClientRect().width);
  if (size > 0) {
    document.documentElement.style.setProperty("--rv-best-photo-size", `${size}px`);
  } else {
    document.documentElement.style.removeProperty("--rv-best-photo-size");
  }
}

function renderSortToggle() {
  el.sortRadios.forEach((radio) => {
    radio.checked = radio.value === state.listSort;
  });
}

function renderAllPagination(totalPages) {
  if (!el.allPagination) return;
  if (totalPages <= 1) {
    el.allPagination.innerHTML = "";
    return;
  }

  const windowStart = Math.floor((state.listPage - 1) / ALL_PAGE_WINDOW) * ALL_PAGE_WINDOW + 1;
  const windowEnd = Math.min(totalPages, windowStart + ALL_PAGE_WINDOW - 1);
  const buttons = [];

  if (windowStart > 1) {
    const prevWindowPage = windowStart - 1;
    buttons.push(
      `<button class="rv-page-btn rv-page-arrow" type="button" data-action="allPage" data-page="${prevWindowPage}" aria-label="이전 페이지 묶음">‹</button>`,
    );
  }

  for (let page = windowStart; page <= windowEnd; page += 1) {
    const isActive = page === state.listPage;
    buttons.push(
      `<button class="rv-page-btn${isActive ? " is-active" : ""}" type="button" data-action="allPage" data-page="${page}" ${isActive ? "aria-current='page'" : ""}>${page}</button>`,
    );
  }

  if (windowEnd < totalPages) {
    const nextWindowPage = windowEnd + 1;
    buttons.push(
      `<button class="rv-page-btn rv-page-arrow" type="button" data-action="allPage" data-page="${nextWindowPage}" aria-label="다음 페이지 묶음">›</button>`,
    );
  }

  el.allPagination.innerHTML = buttons.join("");
}

function renderAllSection() {
  const source = state.listSort === "score" ? sortByScore(state.reviews) : sortByLatest(state.reviews);

  if (!source.length) {
    el.allList.innerHTML = '<p class="empty">리뷰가 없습니다.</p>';
    if (el.allPagination) el.allPagination.innerHTML = "";
    return;
  }

  const totalPages = Math.max(1, Math.ceil(source.length / ALL_PAGE_SIZE));
  state.listPage = Math.min(Math.max(1, state.listPage), totalPages);
  const start = (state.listPage - 1) * ALL_PAGE_SIZE;
  const visible = source.slice(start, start + ALL_PAGE_SIZE);

  el.allList.innerHTML = visible.map(renderListRow).join("");
  renderAllPagination(totalPages);
}

function renderPolicyModal() {
  if (!el.policyModal) return;
  el.policyModal.classList.toggle("open", state.isPolicyOpen);
}

function render() {
  renderSortToggle();
  renderBestSection();
  syncAllImageSizeWithBest();
  renderAllSection();
  renderPolicyModal();
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

function bind() {
  el.sortRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (!radio.checked) return;
      if (!radio.value || radio.value === state.listSort) return;
      state.listSort = radio.value;
      state.listPage = 1;
      renderAllSection();
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;

    const action = target.dataset.action;
    if (!action) return;

    if (action === "bestPrev") {
      state.bestPage = Math.max(1, state.bestPage - 1);
      renderBestSection();
      syncAllImageSizeWithBest();
      return;
    }
    if (action === "bestNext") {
      state.bestPage += 1;
      renderBestSection();
      syncAllImageSizeWithBest();
      return;
    }
    if (action === "allPage") {
      const nextPage = Number(target.dataset.page);
      if (!Number.isFinite(nextPage) || nextPage <= 0) return;
      if (nextPage === state.listPage) return;
      state.listPage = nextPage;
      renderAllSection();
      return;
    }
    if (action === "openPolicy") {
      state.isPolicyOpen = true;
      renderPolicyModal();
      return;
    }
    if (action === "closePolicy") {
      state.isPolicyOpen = false;
      renderPolicyModal();
    }
  });

  window.addEventListener("resize", () => {
    syncAllImageSizeWithBest();
  });
}

async function init() {
  try {
    const [products, reviews] = await Promise.all([fetchProducts(), fetchAllReviews({ sort: "latest" })]);
    state.products = products;
    state.productMap = new Map(products.map((product) => [Number(product.id), product]));
    state.reviews = Array.isArray(reviews) ? reviews : [];
    await syncHeader();
    render();
    bind();
  } catch (error) {
    console.error(error);
    if (el.bestSection) el.bestSection.classList.add("is-hidden");
    el.allList.innerHTML = '<p class="empty">리뷰 데이터를 불러오지 못했습니다.</p>';
  }
}

init();

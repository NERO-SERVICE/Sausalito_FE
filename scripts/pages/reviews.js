import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { fetchAllReviews, fetchProducts } from "../services/api.js";
import { getUser, syncCurrentUser } from "../services/auth-service.js";
import { cartCount } from "../services/cart-service.js";
import { resolveProductImage } from "../store-data.js";
import { mountSiteFooter } from "../components/footer.js";

const headerRefs = mountSiteHeader({ showCart: true, currentNav: "review" });
mountSiteFooter();
const PER_PAGE = 12;

const state = {
  products: [],
  reviews: [],
  currentPage: 1,
};

const el = {
  productFilter: document.getElementById("reviewProductFilter"),
  sortSelect: document.getElementById("reviewSortSelect"),
  reviewGrid: document.getElementById("reviewGrid"),
  pagination: document.getElementById("reviewPagination"),
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

function getReviewImage(review, index) {
  if (review.image) return review.image;
  const product = state.products.find((item) => item.id === review.productId);
  if (!product || index % 3 === 0) return "/dist/img/reviews/empty_review.svg";
  return resolveProductImage(product.image) || "/dist/img/reviews/empty_review.svg";
}

function getFilteredReviews() {
  const productId = el.productFilter.value;
  const sort = el.sortSelect.value;

  let list = [...state.reviews];

  if (productId !== "all") {
    list = list.filter((review) => review.productId === Number(productId));
  }

  if (sort === "latest") {
    list.sort((a, b) => Number(b.date.replaceAll(".", "")) - Number(a.date.replaceAll(".", "")));
  }
  if (sort === "helpful") {
    list.sort((a, b) => b.helpful - a.helpful);
  }
  if (sort === "score") {
    list.sort((a, b) => b.score - a.score);
  }

  return list;
}

function renderReviewGrid() {
  const list = getFilteredReviews();
  const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  state.currentPage = Math.min(totalPages, Math.max(1, state.currentPage));

  const start = (state.currentPage - 1) * PER_PAGE;
  const visible = list.slice(start, start + PER_PAGE);

  if (!visible.length) {
    el.reviewGrid.innerHTML = '<p class="empty">리뷰가 없습니다.</p>';
    el.pagination.innerHTML = "";
    return;
  }

  el.reviewGrid.innerHTML = visible
    .map((review, index) => {
      const product = state.products.find((item) => item.id === review.productId);
      const image = getReviewImage(review, index + start);
      return `
        <a class="review-card" href="/pages/detail.html?id=${review.productId}">
          <div class="review-thumb">
            <img src="${image}" alt="리뷰 이미지" />
          </div>
          <div class="review-body">
            <p class="review-product">${product?.name || "상품"}</p>
            <p class="review-text">${review.text}</p>
            <div class="review-meta">
              <span>${review.user} · ${review.date}</span>
              <b>${"★".repeat(review.score)}${"☆".repeat(5 - review.score)}</b>
            </div>
          </div>
        </a>`;
    })
    .join("");

  el.pagination.innerHTML = `
    <button class="ghost" data-action="prev" ${state.currentPage <= 1 ? "disabled" : ""}>이전</button>
    <span>${state.currentPage} / ${totalPages}</span>
    <button class="ghost" data-action="next" ${state.currentPage >= totalPages ? "disabled" : ""}>다음</button>
  `;
}

function renderProductFilter() {
  el.productFilter.innerHTML = `
    <option value="all">전체 상품</option>
    ${state.products.map((product) => `<option value="${product.id}">${product.name}</option>`).join("")}
  `;
}

function bind() {
  el.productFilter.addEventListener("change", () => {
    state.currentPage = 1;
    renderReviewGrid();
  });

  el.sortSelect.addEventListener("change", () => {
    state.currentPage = 1;
    renderReviewGrid();
  });

  el.pagination.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    if (button.dataset.action === "prev") state.currentPage -= 1;
    if (button.dataset.action === "next") state.currentPage += 1;
    renderReviewGrid();
  });
}

async function init() {
  try {
    const [products, reviews] = await Promise.all([fetchProducts(), fetchAllReviews()]);
    state.products = products;
    state.reviews = reviews;

    await syncHeader();
    renderProductFilter();
    renderReviewGrid();
    bind();
  } catch (error) {
    console.error(error);
    el.reviewGrid.innerHTML = '<p class="empty">리뷰 데이터를 불러오지 못했습니다.</p>';
  }
}

init();

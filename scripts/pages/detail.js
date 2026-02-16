import {
  fetchProductById,
  fetchProductDetailMeta,
  fetchReviewsByProduct,
} from "../services/api.js";
import { addToCart, cartCount } from "../services/cart-service.js";
import { getUser, syncCurrentUser } from "../services/auth-service.js";
import { formatCurrency, resolveProductImage } from "../store-data.js";
import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { mountSiteFooter } from "../components/footer.js";

const id = Number(new URLSearchParams(location.search).get("id"));

const state = {
  product: null,
  meta: null,
  reviews: [],
  imageIndex: 0,
  quantity: 1,
  reviewPage: 1,
  activeSection: "section-detail",
  open: { shipping: false, inquiry: false },
  policyOpen: false,
};

const headerRefs = mountSiteHeader({ showCart: true, currentNav: "shop" });
mountSiteFooter();

const el = {
  root: document.getElementById("detailRoot"),
};

let observer = null;
const PER_PAGE = 10;
let pullStartY = null;
let pullTriggered = false;

function initMobilePullBack() {
  if (window.matchMedia("(min-width: 821px)").matches) return;

  window.addEventListener(
    "touchstart",
    (event) => {
      if (window.scrollY > 0) return;
      pullStartY = event.touches[0].clientY;
      pullTriggered = false;
    },
    { passive: true },
  );

  window.addEventListener(
    "touchmove",
    (event) => {
      if (pullStartY === null || pullTriggered) return;
      if (window.scrollY > 0) return;
      const currentY = event.touches[0].clientY;
      const diff = currentY - pullStartY;
      if (diff > 90) {
        pullTriggered = true;
        if (history.length > 1) history.back();
        else location.href = "/pages/home.html";
      }
    },
    { passive: true },
  );

  window.addEventListener(
    "touchend",
    () => {
      pullStartY = null;
      pullTriggered = false;
    },
    { passive: true },
  );
}

async function setHeader() {
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

function getImages() {
  const base = resolveProductImage(state.product.image, { useFallback: false });
  const fromProduct = Array.isArray(state.product.images) ? state.product.images : [];
  const extra = Array.isArray(state.meta?.detailImages) ? state.meta.detailImages : [];
  const uploaded = [...new Set([base, ...fromProduct, ...extra].filter((image) => typeof image === "string" && image.trim()))];
  if (uploaded.length) return uploaded;
  return [resolveProductImage(null)];
}

function getReviewPaged() {
  const totalPages = Math.max(1, Math.ceil(state.reviews.length / PER_PAGE));
  state.reviewPage = Math.min(totalPages, Math.max(1, state.reviewPage));
  const start = (state.reviewPage - 1) * PER_PAGE;
  return { totalPages, list: state.reviews.slice(start, start + PER_PAGE) };
}

function setTab(sectionId) {
  state.activeSection = sectionId;
  document.querySelectorAll(".pd-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.target === sectionId);
  });
}

function initSpy() {
  if (observer) observer.disconnect();
  const sections = [...document.querySelectorAll(".pd-section")];
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setTab(visible.target.id);
    },
    { threshold: [0.3, 0.6], rootMargin: "-20% 0px -45% 0px" },
  );
  sections.forEach((section) => observer.observe(section));
}

function render() {
  if (!state.product) {
    el.root.innerHTML = '<p class="empty">상품을 찾을 수 없습니다.</p>';
    return;
  }

  const images = getImages();
  const hasMultipleImages = images.length > 1;
  state.imageIndex = Math.min(images.length - 1, Math.max(0, state.imageIndex));
  const currentImage = images[state.imageIndex] || resolveProductImage(null);
  const option = (state.meta.options && state.meta.options[0]) || { price: state.product.price };
  const total = option.price * state.quantity;

  const discountRate = Math.round((1 - state.product.price / state.product.originalPrice) * 100);
  const reviewAvg = state.reviews.length
    ? (state.reviews.reduce((s, r) => s + r.score, 0) / state.reviews.length).toFixed(1)
    : Number(state.product.rating || 0).toFixed(1);
  const { list, totalPages } = getReviewPaged();

  el.root.innerHTML = `
    <section class="pd-top">
      <div class="pd-media">
        <div class="pd-media-stage">
          <img src="${currentImage}" alt="${state.product.name}" />
          ${
            hasMultipleImages
              ? `<button class="pd-gallery-nav prev" data-action="prevImage">‹</button>
          <button class="pd-gallery-nav next" data-action="nextImage">›</button>`
              : ""
          }
        </div>
        ${
          hasMultipleImages
            ? `<div class="pd-gallery-thumbs" style="--pd-thumb-columns: ${Math.min(images.length, 4)};">
          ${images
            .map(
              (img, idx) => `<button class="pd-gallery-thumb ${idx === state.imageIndex ? "active" : ""}" data-action="selectImage" data-index="${idx}"><img src="${img}" alt="thumb"/></button>`,
            )
            .join("")}
        </div>`
            : ""
        }
      </div>
      <div class="pd-info">
        <p class="pd-eyebrow">${state.product.badges?.join(" · ") || "추천"}</p>
        <h2>${state.product.name}</h2>
        <p class="pd-one-line">${state.product.oneLine || state.product.description}</p>
        <div class="pd-rating">★ ${reviewAvg} (${state.product.reviews})</div>
        <div class="pd-price"><small>${formatCurrency(state.product.originalPrice)}</small><div><span>${discountRate}%</span><strong>${formatCurrency(state.product.price)}</strong></div></div>

        <div class="pd-qty-row"><h4>수량</h4><div class="qty-controls"><button data-action="decreaseQty">-</button><span>${state.quantity}</span><button data-action="increaseQty">+</button></div></div>
        <div class="pd-total-box"><p class="final">총 결제예상금액 <strong>${formatCurrency(total)}</strong></p></div>
        <div class="pd-static-cta">
          <button class="ghost" data-action="toggleWish">찜하기</button>
          <button class="ghost" data-action="addCart">장바구니담기</button>
          <button class="primary" data-action="buyNow">바로구매</button>
        </div>
      </div>
    </section>

    <section class="pd-tabs">
      <div class="pd-tab-head">
        <button class="pd-tab ${state.activeSection === "section-detail" ? "active" : ""}" data-action="scrollTab" data-target="section-detail">상세정보</button>
        <button class="pd-tab ${state.activeSection === "section-review" ? "active" : ""}" data-action="scrollTab" data-target="section-review">리뷰</button>
      </div>
      <section class="pd-section-card pd-section" id="section-detail">
        <h3 class="pd-section-label">상세정보</h3>
        <h4>제품 설명</h4><p>${state.product.description}</p>
        <h4>핵심 성분</h4><ul>${state.product.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
        <h4>섭취 방법</h4><p>${state.product.intake}</p>
        <div class="pd-accordion">
          <button class="pd-accordion-head" data-action="toggleOpen" data-key="shipping">배송/교환 <span>${state.open.shipping ? "−" : "+"}</span></button>
          <div class="pd-accordion-body ${state.open.shipping ? "open" : ""}"><p>출고 1~2일, 수령 2~3일 소요됩니다.</p></div>
        </div>
        <div class="pd-accordion">
          <button class="pd-accordion-head" data-action="toggleOpen" data-key="inquiry">상품문의 <span>${state.open.inquiry ? "−" : "+"}</span></button>
          <div class="pd-accordion-body ${state.open.inquiry ? "open" : ""}"><p>평일 10:00~18:00, 고객센터를 이용해주세요.</p></div>
        </div>
      </section>
      <section class="pd-section-card pd-section" id="section-review">
        <h3 class="pd-section-label">리뷰</h3>
        <div class="pd-review-links">
          <button class="text-btn pd-policy-link" data-action="openPolicy">운영정책</button>
          <a class="text-btn pd-write-link" href="/pages/review-write.html?productId=${state.product.id}">리뷰작성</a>
        </div>
        ${
          list.length
            ? list
                .map((r) => {
                  const reviewImage = r.image || "";
                  return `<article class="pd-review-item">
                      <div><strong class="pd-review-stars">${"★".repeat(r.score)}${"☆".repeat(5 - r.score)}</strong><span>${r.user} · ${r.date}</span></div>
                      <p>${r.text}</p>
                      ${
                        reviewImage
                          ? `<img class="pd-review-thumb" src="${reviewImage}" alt="리뷰 이미지" />`
                          : ""
                      }
                    </article>`;
                })
                .join("")
            : "<p>리뷰가 없습니다.</p>"
        }
        <div class="pd-review-pagination">
          <button class="ghost" data-action="prevReview" ${state.reviewPage <= 1 ? "disabled" : ""}>이전</button>
          <span>${state.reviewPage} / ${totalPages}</span>
          <button class="ghost" data-action="nextReview" ${state.reviewPage >= totalPages ? "disabled" : ""}>다음</button>
        </div>
      </section>
    </section>

    <div class="pd-policy-modal ${state.policyOpen ? "open" : ""}">
      <div class="pd-policy-backdrop" data-action="closePolicy"></div>
      <section class="pd-policy-dialog" role="dialog" aria-modal="true" aria-label="리뷰 운영정책">
        <h4>리뷰 운영정책</h4>
        <ul>
          <li>타인을 비방하거나 허위 사실이 포함된 리뷰는 비노출 처리될 수 있습니다.</li>
          <li>개인정보, 연락처, URL 등 부적절한 정보가 포함된 리뷰는 삭제될 수 있습니다.</li>
          <li>상품과 무관한 내용, 반복/도배성 게시물은 운영정책에 따라 제한됩니다.</li>
        </ul>
        <button class="primary" data-action="closePolicy">확인</button>
      </section>
    </div>

    <div class="pd-floating-cta">
      <button class="ghost" data-action="toggleWish">찜하기</button>
      <button class="ghost" data-action="addCart">장바구니담기</button>
      <button class="primary" data-action="buyNow">바로구매</button>
    </div>
  `;

  initSpy();
}

document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;

  if (action === "prevImage") state.imageIndex -= 1;
  if (action === "nextImage") state.imageIndex += 1;
  if (action === "selectImage") state.imageIndex = Number(btn.dataset.index);
  if (action === "increaseQty") state.quantity = Math.min(99, state.quantity + 1);
  if (action === "decreaseQty") state.quantity = Math.max(1, state.quantity - 1);

  if (action === "scrollTab") {
    const target = document.getElementById(btn.dataset.target);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    state.activeSection = btn.dataset.target;
  }

  if (action === "toggleOpen") {
    const key = btn.dataset.key;
    state.open[key] = !state.open[key];
  }

  if (action === "prevReview") state.reviewPage = Math.max(1, state.reviewPage - 1);
  if (action === "nextReview") state.reviewPage += 1;
  if (action === "openPolicy") state.policyOpen = true;
  if (action === "closePolicy") state.policyOpen = false;

  if (action === "addCart") {
    try {
      await addToCart(state.product.id, state.quantity);
      alert("장바구니에 담았습니다.");
      await setHeader();
    } catch (error) {
      console.error(error);
      alert(error.message || "장바구니 담기에 실패했습니다.");
      if (error.status === 401 || error.message.includes("로그인")) {
        location.href = "/pages/login.html";
        return;
      }
    }
  }

  if (action === "buyNow") {
    try {
      await addToCart(state.product.id, state.quantity);
      location.href = "/pages/cart.html";
      return;
    } catch (error) {
      console.error(error);
      alert(error.message || "장바구니 담기에 실패했습니다.");
      if (error.status === 401 || error.message.includes("로그인")) {
        location.href = "/pages/login.html";
        return;
      }
    }
  }

  if (action === "toggleWish") {
    alert("찜 API 연동 예정입니다.");
  }

  render();
});

async function init() {
  try {
    state.product = await fetchProductById(id);
    state.meta = await fetchProductDetailMeta(id);
    state.reviews = await fetchReviewsByProduct(id);
    initMobilePullBack();
    await setHeader();
    render();
  } catch (error) {
    console.error(error);
    el.root.innerHTML = '<p class="empty">상품 데이터를 불러오지 못했습니다.</p>';
  }
}

init();

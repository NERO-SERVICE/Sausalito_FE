import {
  fetchProductById,
  fetchProductDetailMeta,
  fetchReviewsByProduct,
  trackRecentProduct,
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
  selectedBundles: [],
  selectedOptionId: null,
  selectedOptionDurationMonths: null,
  reviewPage: 1,
  activeSection: "section-detail",
  open: { shipping: false, inquiry: false, refund: false },
  policyOpen: false,
  currentUser: null,
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
    .replace(/"/g, "&quot;")
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

function formatPercent(value, digits = 1) {
  const safe = Number.isFinite(Number(value)) ? Number(value) : 0;
  return `${safe.toFixed(digits)}%`;
}

function daysUntil(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const diff = date.getTime() - Date.now();
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}

const PACKAGE_DURATIONS = [1, 2, 3, 6];
const PACKAGE_NAME_MAP = {
  1: "1개월분",
  2: "2개월분 (1+1)",
  3: "3개월분 (2+1)",
  6: "6개월분 (4+2)",
};
const PACKAGE_BENEFIT_MAP = {
  1: "제품 상세선택",
  2: "1+1",
  3: "2+1",
  6: "4+2",
};
const PACKAGE_DISCOUNT_RATE_MAP = {
  1: 0,
  2: 8,
  3: 14,
  6: 20,
};

function buildDefaultPackagePrice(basePrice, durationMonths) {
  const safeBase = Math.max(Number(basePrice || 0), 0);
  const discountRate = Number(PACKAGE_DISCOUNT_RATE_MAP[durationMonths] || 0);
  return Math.max(0, Math.round((safeBase * durationMonths * (100 - discountRate)) / 100));
}

function extractOptionDuration(option = {}) {
  const direct = Number(option.durationMonths || option.duration_months || 0);
  if (PACKAGE_DURATIONS.includes(direct)) return direct;

  const match = String(option.name || "").match(/(\d+)\s*개월/);
  if (!match) return null;
  const value = Number(match[1] || 0);
  return PACKAGE_DURATIONS.includes(value) ? value : null;
}

function buildSelectableOptions() {
  const sourceRaw = Array.isArray(state.product?.options) && state.product.options.length
    ? state.product.options
    : Array.isArray(state.meta?.options)
      ? state.meta.options
      : [];
  const basePrice = Number(state.product?.price || 0);
  const baseStock = Math.max(Number(state.product?.stock || 0), 0);

  const sourceByDuration = new Map();
  sourceRaw.forEach((row) => {
    const durationMonths = extractOptionDuration(row);
    if (!durationMonths || sourceByDuration.has(durationMonths)) return;
    sourceByDuration.set(durationMonths, row);
  });

  return PACKAGE_DURATIONS.map((durationMonths) => {
    const source = sourceByDuration.get(durationMonths);
    const price = source ? Math.max(Number(source.price || 0), 0) : buildDefaultPackagePrice(basePrice, durationMonths);
    const stock = source ? Math.max(Number(source.stock || 0), 0) : baseStock;
    const benefitLabel = String(source?.benefitLabel || source?.benefit_label || "").trim()
      || PACKAGE_BENEFIT_MAP[durationMonths]
      || "";
    return {
      id: source?.id ? Number(source.id) : null,
      durationMonths,
      name: String(source?.name || "").trim() || PACKAGE_NAME_MAP[durationMonths] || `${durationMonths}개월분`,
      benefitLabel,
      price,
      stock,
      isActive: source ? Boolean(source.isActive ?? source.is_active ?? true) : true,
    };
  });
}

function createOptionKey(option = {}) {
  const optionId = Number(option.id || 0);
  if (optionId > 0) return `id:${optionId}`;
  const durationMonths = Number(option.durationMonths || option.duration_months || 0);
  if (durationMonths > 0) return `duration:${durationMonths}`;
  return null;
}

function createOptionKeyFromPayload(optionId, durationMonths) {
  const safeOptionId = Number(optionId || 0);
  if (safeOptionId > 0) return `id:${safeOptionId}`;
  const safeDurationMonths = Number(durationMonths || 0);
  if (safeDurationMonths > 0) return `duration:${safeDurationMonths}`;
  return null;
}

function clampQuantity(quantity, maxQuantity) {
  const safeMax = Math.max(1, Math.min(99, Number(maxQuantity || 99)));
  return Math.min(safeMax, Math.max(1, Number(quantity || 1)));
}

function syncSelectedBundles(selectableOptions = []) {
  const optionMap = new Map();
  selectableOptions.forEach((option) => {
    const key = createOptionKey(option);
    if (!key) return;
    optionMap.set(key, option);
  });

  state.selectedBundles = state.selectedBundles
    .map((bundle) => {
      const key = bundle.optionKey || createOptionKeyFromPayload(bundle.optionId, bundle.durationMonths);
      const option = key ? optionMap.get(key) : null;
      if (!key || !option || !option.isActive || Number(option.stock || 0) <= 0) return null;
      return {
        optionKey: key,
        optionId: option.id || null,
        durationMonths: option.durationMonths || null,
        quantity: clampQuantity(bundle.quantity, option.stock),
      };
    })
    .filter(Boolean);
}

function buildSelectedSummary(selectableOptions = []) {
  const optionMap = new Map();
  selectableOptions.forEach((option) => {
    const key = createOptionKey(option);
    if (!key) return;
    optionMap.set(key, option);
  });

  const oneMonthOption = selectableOptions.find((option) => Number(option.durationMonths) === 1) || selectableOptions[0] || null;
  const oneMonthPrice = Math.max(Number(oneMonthOption?.price || state.product?.price || 0), 0);

  const lines = [];
  let subtotal = 0;
  let originalTotal = 0;
  let totalQuantity = 0;

  state.selectedBundles.forEach((bundle) => {
    const option = optionMap.get(bundle.optionKey);
    if (!option) return;
    const quantity = clampQuantity(bundle.quantity, option.stock);
    const unitPrice = Math.max(Number(option.price || 0), 0);
    const lineTotal = unitPrice * quantity;
    const regularLineTotal = Math.max(oneMonthPrice * Number(option.durationMonths || 1) * quantity, lineTotal);
    subtotal += lineTotal;
    originalTotal += regularLineTotal;
    totalQuantity += quantity;
    lines.push({
      optionKey: bundle.optionKey,
      optionId: option.id || null,
      durationMonths: Number(option.durationMonths || 1),
      name: option.name,
      benefitLabel: option.benefitLabel || "",
      quantity,
      unitPrice,
      lineTotal,
      maxQuantity: Math.max(1, Math.min(99, Number(option.stock || 99))),
    });
  });

  return {
    lines,
    subtotal,
    originalTotal: Math.max(originalTotal, subtotal),
    totalQuantity,
    oneMonthPrice,
  };
}

function buildShippingProgress(subtotal, shippingFee, freeShippingThreshold) {
  const safeSubtotal = Math.max(Number(subtotal || 0), 0);
  const safeShippingFee = Math.max(Number(shippingFee || 0), 0);
  const safeThreshold = Math.max(Number(freeShippingThreshold || 0), 0);
  if (safeThreshold <= 0) {
    return {
      progress: 100,
      isFreeShipping: true,
      remainingAmount: 0,
      message: safeShippingFee > 0 ? `무료배송(${formatCurrency(safeShippingFee)} 절약했어요!)` : "무료배송",
    };
  }

  const progress = Math.max(0, Math.min(100, Math.round((safeSubtotal / safeThreshold) * 100)));
  const remainingAmount = Math.max(safeThreshold - safeSubtotal, 0);
  const isFreeShipping = remainingAmount <= 0;

  return {
    progress,
    isFreeShipping,
    remainingAmount,
    message: isFreeShipping
      ? `무료배송(${formatCurrency(safeShippingFee)} 절약했어요!)`
      : `${formatCurrency(remainingAmount)} 더 담으면 무료배송`,
  };
}

function buildCouponPreview(orderAmount, originalAmount) {
  const benefit = state.product?.couponBenefit || null;
  const safeOrderAmount = Math.max(0, Number(orderAmount || 0));
  const safeOriginalAmount = Math.max(1, Number(originalAmount || safeOrderAmount || 1));

  if (!benefit) {
    return {
      isAuthenticated: false,
      hasAvailableCoupon: false,
      hasEligibleCoupon: false,
      availableCouponCount: 0,
      eligibleCouponCount: 0,
      marketingCopy: "로그인하면 보유 쿠폰 기반 추가 할인 혜택을 확인할 수 있어요.",
      bestCoupon: null,
      couponItems: [],
      minRequiredAmount: 0,
    };
  }

  const couponItems = Array.isArray(benefit.couponItems)
    ? benefit.couponItems
        .map((item) => {
          const minOrderAmount = Number(item.minOrderAmount || 0);
          const discountAmount = Number(item.discountAmount || 0);
          const isEligible = safeOrderAmount >= minOrderAmount;
          const requiredAmount = Math.max(minOrderAmount - safeOrderAmount, 0);
          const appliedDiscountAmount = isEligible ? Math.min(safeOrderAmount, discountAmount) : 0;
          const finalPrice = Math.max(safeOrderAmount - appliedDiscountAmount, 0);
          const extraDiscountRate = safeOrderAmount > 0 ? (appliedDiscountAmount / safeOrderAmount) * 100 : 0;
          const finalDiscountRate = (1 - finalPrice / safeOriginalAmount) * 100;
          const daysLeft = daysUntil(item.expiresAt);
          const expiresSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;
          return {
            ...item,
            isEligible,
            requiredAmount,
            appliedDiscountAmount,
            finalPrice,
            extraDiscountRate: Math.max(0, Number(extraDiscountRate.toFixed(2))),
            finalDiscountRate: Math.max(0, Number(finalDiscountRate.toFixed(2))),
            expiresSoon,
            daysLeft,
          };
        })
        .sort((a, b) => b.discountAmount - a.discountAmount)
    : [];

  const eligibleCoupons = couponItems
    .filter((item) => item.isEligible)
    .sort((a, b) => b.appliedDiscountAmount - a.appliedDiscountAmount || b.finalDiscountRate - a.finalDiscountRate);
  const ineligibleCoupons = couponItems
    .filter((item) => !item.isEligible)
    .sort((a, b) => a.requiredAmount - b.requiredAmount);
  const bestCoupon = eligibleCoupons[0] || null;

  return {
    isAuthenticated: Boolean(benefit.isAuthenticated),
    hasAvailableCoupon: Boolean(couponItems.length),
    hasEligibleCoupon: Boolean(bestCoupon),
    availableCouponCount: Number(benefit.availableCouponCount || couponItems.length),
    eligibleCouponCount: Number(eligibleCoupons.length),
    marketingCopy: benefit.marketingCopy || "",
    bestCoupon,
    couponItems: couponItems.slice(0, 4),
    minRequiredAmount: Number(ineligibleCoupons[0]?.requiredAmount || 0),
  };
}

function renderCouponBenefitBlock(preview) {
  if (!preview.isAuthenticated) {
    return `
      <section class="pd-coupon-panel is-locked">
        <p class="pd-coupon-kicker">회원 전용 혜택</p>
        <h4>내 쿠폰으로 추가 할인받기</h4>
        <p class="pd-coupon-copy">${escapeHtml(preview.marketingCopy)}</p>
        <button class="ghost pd-coupon-login-btn" data-action="loginForCoupon">로그인하고 혜택 확인</button>
      </section>
    `;
  }

  if (!preview.hasAvailableCoupon) {
    return `
      <section class="pd-coupon-panel">
        <p class="pd-coupon-kicker">내 쿠폰 혜택</p>
        <h4>현재 사용 가능한 쿠폰이 없어요</h4>
        <p class="pd-coupon-copy">${escapeHtml(preview.marketingCopy || "신규회원/이벤트 쿠폰을 확인해보세요.")}</p>
      </section>
    `;
  }

  const best = preview.bestCoupon;
  return `
    <section class="pd-coupon-panel ${best ? "is-available" : "is-pending"}">
      <div class="pd-coupon-head">
        <div>
          <p class="pd-coupon-kicker">내 쿠폰 추가 할인</p>
          <h4>${best ? "지금 결제 시 최대 추가 할인 가능" : "조금만 더 담으면 쿠폰 할인이 가능해요"}</h4>
        </div>
        <span class="pd-coupon-count">보유 ${preview.availableCouponCount}장</span>
      </div>
      ${
        best
          ? `
            <p class="pd-coupon-final">
              쿠폰 적용 예상가
              <strong>${formatCurrency(best.finalPrice)}</strong>
            </p>
            <p class="pd-coupon-copy">
              ${escapeHtml(best.name)} 적용 시 ${formatCurrency(best.appliedDiscountAmount)} 추가 할인
              (${formatPercent(best.extraDiscountRate)}), 정가 대비 총 할인율 ${formatPercent(best.finalDiscountRate)}
            </p>
          `
          : `
            <p class="pd-coupon-copy">
              현재 수량 기준 적용 가능한 쿠폰이 없습니다.
              ${formatCurrency(preview.minRequiredAmount)} 더 담으면 쿠폰 할인이 적용돼요.
            </p>
          `
      }
      <div class="pd-coupon-list">
        ${preview.couponItems
          .map((item) => {
            const statusLabel = item.isEligible ? "적용 가능" : `${formatCurrency(item.requiredAmount)} 추가 필요`;
            const expiresLabel =
              item.daysLeft === null
                ? ""
                : item.daysLeft < 0
                  ? "만료"
                  : item.daysLeft === 0
                    ? "오늘 만료"
                    : `${item.daysLeft}일 남음`;
            return `
              <article class="pd-coupon-item ${item.isEligible ? "eligible" : "ineligible"}">
                <div>
                  <p>${escapeHtml(item.name)}</p>
                  <small>${escapeHtml(item.code)} · ${formatCurrency(item.discountAmount)} 할인</small>
                </div>
                <div class="pd-coupon-meta">
                  ${item.expiresSoon ? '<span class="pd-coupon-chip is-urgent">곧 만료</span>' : ""}
                  ${expiresLabel ? `<span class="pd-coupon-chip">${expiresLabel}</span>` : ""}
                  <span class="pd-coupon-status">${statusLabel}</span>
                </div>
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function getImages() {
  const base = resolveProductImage(state.product.image, { useFallback: false });
  const fromProduct = Array.isArray(state.product.images)
    ? state.product.images.map((image) => resolveProductImage(image, { useFallback: false }))
    : [];
  const extra = Array.isArray(state.meta?.detailImages)
    ? state.meta.detailImages.map((image) => resolveProductImage(image, { useFallback: false }))
    : [];
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

function renderDetailReviewEmptyState(productId) {
  return `
    <section class="pd-review-empty">
      <p class="pd-review-empty-message">리뷰를 기다리고 있어요</p>
      <a class="pd-review-empty-btn" href="/pages/review-write.html?productId=${productId}">작성하기</a>
    </section>
  `;
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
  const selectableOptions = buildSelectableOptions();
  syncSelectedBundles(selectableOptions);
  const selectedOption = selectableOptions.find((option) => Number(option.id) === Number(state.selectedOptionId))
    || selectableOptions.find((option) => Number(option.durationMonths) === Number(state.selectedOptionDurationMonths))
    || selectableOptions.find((option) => option.isActive && Number(option.stock || 0) > 0)
    || selectableOptions[0]
    || null;
  state.selectedOptionId = selectedOption?.id ?? null;
  state.selectedOptionDurationMonths = selectedOption?.durationMonths ?? null;
  const selectedSummary = buildSelectedSummary(selectableOptions);
  const hasSelectedBundles = selectedSummary.lines.length > 0;
  const total = selectedSummary.subtotal;
  const originalTotal = selectedSummary.originalTotal;
  const couponPreview = buildCouponPreview(total, originalTotal);
  const finalTotal = couponPreview.bestCoupon ? couponPreview.bestCoupon.finalPrice : total;
  const shippingFee = Math.max(Number(state.meta?.shippingFee || 3000), 0);
  const freeShippingThreshold = Math.max(Number(state.meta?.freeShippingThreshold || 50000), 0);
  const shippingProgress = buildShippingProgress(total, shippingFee, freeShippingThreshold);
  const oneMonthReferencePrice = Math.max(Number(selectedSummary.oneMonthPrice || state.product.price || 0), 0);
  const discountRate =
    state.product.originalPrice > 0
      ? Math.max(0, Math.round((1 - state.product.price / state.product.originalPrice) * 100))
      : 0;
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
        ${renderCouponBenefitBlock(couponPreview)}
        <div class="pd-shipping-row">
          <span>배송비</span>
          <p>${formatCurrency(shippingFee)} <small>(${formatCurrency(freeShippingThreshold)} 이상 구매 시 무료)</small></p>
        </div>
        <section class="pd-option-block">
          <h4>${escapeHtml(state.meta?.optionsLabel || "상품구성")}</h4>
          <div class="pd-option-grid">
            ${selectableOptions
              .map((option) => {
                const isSelected = selectedOption
                  ? (
                      (selectedOption.id && option.id && Number(selectedOption.id) === Number(option.id))
                      || Number(selectedOption.durationMonths) === Number(option.durationMonths)
                    )
                  : false;
                const isDisabled = !option.isActive || Number(option.stock || 0) <= 0;
                const regularPrice = oneMonthReferencePrice * Number(option.durationMonths || 1);
                const saveAmount = Math.max(0, regularPrice - Number(option.price || 0));
                const saveRate = regularPrice > 0 ? (saveAmount / regularPrice) * 100 : 0;
                return `
                  <button
                    class="pd-option-btn ${isSelected ? "is-active" : ""}"
                    type="button"
                    data-action="selectOption"
                    data-option-id="${option.id || ""}"
                    data-duration="${option.durationMonths}"
                    ${isDisabled ? "disabled" : ""}
                  >
                    <span class="pd-option-title">${escapeHtml(option.name)}</span>
                    <span class="pd-option-meta">
                      ${option.benefitLabel ? `<em>${escapeHtml(option.benefitLabel)}</em>` : ""}
                      <b>${formatCurrency(option.price)}</b>
                    </span>
                    ${
                      saveAmount > 0
                        ? `<span class="pd-option-savings">1개월분 대비 ${formatCurrency(saveAmount)} (${formatPercent(saveRate, 0)}) 할인</span>`
                        : ""
                    }
                  </button>
                `;
              })
              .join("")}
          </div>
          ${
            selectedOption
              ? `<p class="pd-option-selected">구성을 클릭하면 수량 목록에 추가됩니다. 현재 선택 <strong>${escapeHtml(selectedOption.name)}</strong></p>`
              : ""
          }
        </section>

        <div class="pd-qty-row"><h4>수량</h4><p class="pd-qty-summary">총 ${selectedSummary.totalQuantity}개 선택</p></div>
        <div class="pd-selected-list">
          ${
            selectedSummary.lines.length
              ? selectedSummary.lines
                  .map(
                    (line) => `
                      <article class="pd-selected-item">
                        <div class="pd-selected-main">
                          <p>${escapeHtml(line.name)}</p>
                          <b>${formatCurrency(line.lineTotal)}</b>
                        </div>
                        <div class="pd-selected-controls">
                          <div class="qty-controls">
                            <button data-action="decreaseBundleQty" data-option-key="${escapeHtml(line.optionKey)}">-</button>
                            <span>${line.quantity}</span>
                            <button data-action="increaseBundleQty" data-option-key="${escapeHtml(line.optionKey)}">+</button>
                          </div>
                          <button class="pd-selected-remove" data-action="removeBundle" data-option-key="${escapeHtml(line.optionKey)}" aria-label="구성 삭제">×</button>
                        </div>
                      </article>
                    `,
                  )
                  .join("")
              : '<p class="pd-selected-empty">상품구성 버튼을 눌러 구매 수량을 추가해 주세요.</p>'
          }
        </div>
        <div class="pd-total-box">
          <p><span>총 상품금액</span><b>${formatCurrency(total)}</b></p>
          ${couponPreview.bestCoupon ? `<p><span>쿠폰 할인 적용</span><b class="pd-total-discount">-${formatCurrency(couponPreview.bestCoupon.appliedDiscountAmount)}</b></p>` : ""}
          <p class="final"><span>총 결제금액</span><strong>${formatCurrency(finalTotal)}</strong></p>
          <small>쿠폰 할인은 주문서에 최종 반영됩니다.</small>
        </div>
        <section class="pd-free-shipping ${shippingProgress.isFreeShipping ? "is-complete" : ""}">
          <div class="pd-free-shipping-head">
            <span>무료배송 혜택</span>
            <strong>${shippingProgress.message}</strong>
          </div>
          <div class="pd-free-shipping-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${shippingProgress.progress}">
            <span style="width: ${shippingProgress.progress}%;"></span>
          </div>
          <p class="pd-free-shipping-sub">
            ${
              shippingProgress.isFreeShipping
                ? "주문서에서 배송비 0원으로 적용됩니다."
                : `현재 ${formatCurrency(total)} 담았습니다.`
            }
          </p>
        </section>
        <div class="pd-static-cta">
          <button class="ghost" data-action="addCart" ${hasSelectedBundles ? "" : "disabled"}>장바구니</button>
          <button class="primary" data-action="buyNow" ${hasSelectedBundles ? "" : "disabled"}>구매하기</button>
        </div>
      </div>
    </section>

    <section class="pd-tabs">
      <div class="pd-tab-head">
        <button class="pd-tab ${state.activeSection === "section-detail" ? "active" : ""}" data-action="scrollTab" data-target="section-detail">상세정보</button>
        <button class="pd-tab ${state.activeSection === "section-review" ? "active" : ""}" data-action="scrollTab" data-target="section-review">리뷰</button>
        <button class="pd-tab ${state.activeSection === "section-return" ? "active" : ""}" data-action="scrollTab" data-target="section-return">반품/교환정보</button>
      </div>
      <section class="pd-section-card pd-section" id="section-detail">
        <h3 class="pd-section-label">상세정보</h3>
        <h4>제품 설명</h4><p>${state.product.description}</p>
        <h4>핵심 성분</h4><ul>${state.product.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
        <h4>섭취 방법</h4><p>${state.product.intake}</p>
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
                  const reviewImages = Array.isArray(r.images) && r.images.length
                    ? r.images.slice(0, 3).map((image) => resolveProductImage(image, { useFallback: false }))
                    : r.image
                      ? [resolveProductImage(r.image, { useFallback: false })]
                      : [];
                  const replyDate = r.answeredAt ? toDateText(r.answeredAt) : "";
                  const replyBlock = r.adminReply
                    ? `<div class="pd-review-answer">
                        <strong>관리자 답변</strong>
                        <p>${escapeHtml(r.adminReply)}</p>
                        <span>${escapeHtml(r.answeredBy || "관리자")}${replyDate ? ` · ${replyDate}` : ""}</span>
                      </div>`
                    : "";
                  return `<article class="pd-review-item">
                      <div class="pd-review-head"><strong class="pd-review-stars">${"★".repeat(r.score)}${"☆".repeat(5 - r.score)}</strong><span>${escapeHtml(r.user)} · ${escapeHtml(r.date)}</span></div>
                      <p>${escapeHtml(r.text)}</p>
                      ${
                        reviewImages.length
                          ? `<div class="pd-review-thumb-grid">
                              ${reviewImages
                                .map(
                                  (reviewImage, index) =>
                                    `<img class="pd-review-thumb" src="${reviewImage}" alt="리뷰 이미지 ${index + 1}" />`,
                                )
                                .join("")}
                            </div>`
                          : ""
                      }
                      ${replyBlock}
                    </article>`;
                })
                .join("")
            : renderDetailReviewEmptyState(state.product.id)
        }
        ${
          list.length
            ? `<div class="pd-review-pagination">
                <button class="ghost" data-action="prevReview" ${state.reviewPage <= 1 ? "disabled" : ""}>이전</button>
                <span>${state.reviewPage} / ${totalPages}</span>
                <button class="ghost" data-action="nextReview" ${state.reviewPage >= totalPages ? "disabled" : ""}>다음</button>
              </div>`
            : ""
        }
      </section>
      <section class="pd-section-card pd-section" id="section-return">
        <h3 class="pd-section-label">반품/교환정보</h3>
        <div class="pd-accordion">
          <button class="pd-accordion-head" data-action="toggleOpen" data-key="shipping">상품 결제 정보 <span>${state.open.shipping ? "−" : "+"}</span></button>
          <div class="pd-accordion-body ${state.open.shipping ? "open" : ""}"><p>현재 결제수단은 계좌이체이며, 입금 확인 후 결제완료 처리됩니다.</p></div>
        </div>
        <div class="pd-accordion">
          <button class="pd-accordion-head" data-action="toggleOpen" data-key="inquiry">배송 안내 <span>${state.open.inquiry ? "−" : "+"}</span></button>
          <div class="pd-accordion-body ${state.open.inquiry ? "open" : ""}"><p>출고 1~2일, 수령 2~3일 소요됩니다. 평일 10:00~18:00 고객센터에서 배송 문의를 도와드립니다.</p></div>
        </div>
        <div class="pd-accordion">
          <button class="pd-accordion-head" data-action="toggleOpen" data-key="refund">교환/반품 안내 <span>${state.open.refund ? "−" : "+"}</span></button>
          <div class="pd-accordion-body ${state.open.refund ? "open" : ""}">
            <section class="pd-payment-policy-box">
              <ul>
                <li>현재 결제수단은 계좌이체입니다.</li>
                <li>입금 확인 후 결제완료 처리되며, 입금자명은 주문자명과 동일해야 빠르게 확인됩니다.</li>
                <li>배송/교환/반품 상세정책은 하단 고지 페이지에서 확인할 수 있습니다.</li>
              </ul>
              <p>
                <a href="/pages/guide.html" target="_blank" rel="noopener">이용안내</a>
                <a href="/pages/commerce-notice.html" target="_blank" rel="noopener">전자상거래 고지</a>
              </p>
            </section>
          </div>
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
      <button class="ghost" data-action="addCart" ${hasSelectedBundles ? "" : "disabled"}>장바구니</button>
      <button class="primary" data-action="buyNow" ${hasSelectedBundles ? "" : "disabled"}>구매하기</button>
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
  if (action === "selectOption") {
    const optionId = Number(btn.dataset.optionId || 0) || null;
    const durationMonths = Number(btn.dataset.duration || 0) || null;
    state.selectedOptionId = optionId;
    state.selectedOptionDurationMonths = durationMonths;
    const selectableOptions = buildSelectableOptions();
    const option = selectableOptions.find(
      (item) =>
        (optionId && Number(item.id) === Number(optionId))
        || Number(item.durationMonths) === Number(durationMonths),
    );
    if (option && option.isActive && Number(option.stock || 0) > 0) {
      const optionKey = createOptionKey(option);
      const existing = state.selectedBundles.find((bundle) => bundle.optionKey === optionKey);
      if (existing) {
        existing.quantity = clampQuantity(existing.quantity + 1, option.stock);
      } else if (optionKey) {
        state.selectedBundles.push({
          optionKey,
          optionId: option.id || null,
          durationMonths: option.durationMonths || null,
          quantity: 1,
        });
      }
    }
  }
  if (action === "increaseBundleQty" || action === "decreaseBundleQty" || action === "removeBundle") {
    const optionKey = btn.dataset.optionKey || "";
    const targetBundle = state.selectedBundles.find((bundle) => bundle.optionKey === optionKey);
    if (targetBundle) {
      if (action === "removeBundle") {
        state.selectedBundles = state.selectedBundles.filter((bundle) => bundle.optionKey !== optionKey);
      } else {
        const selectableOptions = buildSelectableOptions();
        const targetOption = selectableOptions.find((option) => createOptionKey(option) === optionKey);
        const maxQuantity = targetOption ? Number(targetOption.stock || 99) : 99;
        if (action === "increaseBundleQty") {
          targetBundle.quantity = clampQuantity(targetBundle.quantity + 1, maxQuantity);
        }
        if (action === "decreaseBundleQty") {
          targetBundle.quantity = clampQuantity(targetBundle.quantity - 1, maxQuantity);
        }
      }
    }
  }

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
  if (action === "loginForCoupon") {
    location.href = "/pages/login.html";
    return;
  }

  if (action === "addCart") {
    const selectableOptions = buildSelectableOptions();
    syncSelectedBundles(selectableOptions);
    const selectedSummary = buildSelectedSummary(selectableOptions);
    if (!selectedSummary.lines.length) {
      alert("상품구성을 먼저 선택해 주세요.");
      render();
      return;
    }
    try {
      for (const line of selectedSummary.lines) {
        await addToCart(state.product.id, line.quantity, line.optionId || null);
      }
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
    const user = state.currentUser || (await syncCurrentUser()) || getUser();
    if (!user) {
      alert("로그인 후 구매가 가능합니다.");
      location.href = "/pages/login.html";
      return;
    }
    state.currentUser = user;
    const selectableOptions = buildSelectableOptions();
    syncSelectedBundles(selectableOptions);
    const selectedSummary = buildSelectedSummary(selectableOptions);
    if (!selectedSummary.lines.length) {
      alert("상품구성을 먼저 선택해 주세요.");
      render();
      return;
    }

    if (selectedSummary.lines.length === 1) {
      const [line] = selectedSummary.lines;
      const checkoutParams = new URLSearchParams({
        buyNow: "1",
        productId: String(state.product.id),
        quantity: String(line.quantity),
      });
      if (line.optionId) {
        checkoutParams.set("optionId", String(line.optionId));
      }
      location.href = `/pages/checkout.html?${checkoutParams.toString()}`;
      return;
    }

    try {
      for (const line of selectedSummary.lines) {
        await addToCart(state.product.id, line.quantity, line.optionId || null);
      }
      await setHeader();
      alert("선택한 구성을 장바구니에 담고 주문서로 이동합니다.");
      location.href = "/pages/checkout.html";
    } catch (error) {
      console.error(error);
      alert(error.message || "주문서 이동에 실패했습니다.");
      if (error.status === 401 || error.message.includes("로그인")) {
        location.href = "/pages/login.html";
        return;
      }
    }
    return;
  }

  render();
});

async function init() {
  try {
    state.product = await fetchProductById(id);
    state.meta = await fetchProductDetailMeta(id);
    state.reviews = await fetchReviewsByProduct(id);
    const initialOptions = buildSelectableOptions();
    const initialOption = initialOptions.find((option) => option.isActive && Number(option.stock || 0) > 0)
      || initialOptions[0]
      || null;
    state.selectedOptionId = initialOption?.id ?? null;
    state.selectedOptionDurationMonths = initialOption?.durationMonths ?? null;

    const currentUser = (await syncCurrentUser()) || getUser();
    state.currentUser = currentUser || null;
    if (currentUser) {
      try {
        await trackRecentProduct(id);
      } catch (error) {
        console.error(error);
      }
    }

    initMobilePullBack();
    await setHeader();
    render();
  } catch (error) {
    console.error(error);
    el.root.innerHTML = '<p class="empty">상품 데이터를 불러오지 못했습니다.</p>';
  }
}

init();

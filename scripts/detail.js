import {
  products,
  reviews,
  productDetailMeta,
  STORAGE_KEYS,
  formatCurrency,
  paymentLabel,
  resolveProductImage,
  resolveProductImageFallback,
} from "./store-data.js";

const productId = Number(new URLSearchParams(window.location.search).get("id"));
const currentProduct = products.find((p) => p.id === productId) || products[0];

const REVIEWS_PER_PAGE = 10;
let sectionObserver = null;

const state = {
  cart: JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || "[]"),
  wishlist: JSON.parse(localStorage.getItem(STORAGE_KEYS.wishlist) || "[]"),
  orders: JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || "[]"),
  user: JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || "null"),
  promoHidden: JSON.parse(localStorage.getItem(STORAGE_KEYS.promoHidden) || "false"),
  authMode: "login",
  coupon: null,
  activeSection: "section-detail",
  reviewPage: 1,
  sectionsOpen: {
    shipping: false,
    inquiry: false,
  },
  detail: {
    purchaseType: 0,
    optionId: null,
    addOnIds: new Set(),
    quantity: 1,
    imageIndex: 0,
  },
};

const couponMap = {
  WELCOME20: { type: "percent", value: 20, label: "신규회원 20%" },
  FREESHIP: { type: "shipping", value: 3000, label: "배송비 무료" },
};

const el = {
  body: document.body,
  promoClose: document.getElementById("promoClose"),
  detailContent: document.getElementById("detailContent"),
  cartCount: document.getElementById("cartCount"),
  wishlistCount: document.getElementById("wishlistCount"),
  cartItems: document.getElementById("cartItems"),
  wishlistItems: document.getElementById("wishlistItems"),
  priceSummary: document.getElementById("priceSummary"),
  couponInput: document.getElementById("couponInput"),
  authBtn: document.getElementById("authBtn"),
  authTitle: document.getElementById("authTitle"),
  authForm: document.getElementById("authForm"),
  authEmail: document.getElementById("authEmail"),
  authPassword: document.getElementById("authPassword"),
  authName: document.getElementById("authName"),
  toggleAuthMode: document.getElementById("toggleAuthMode"),
  checkoutForm: document.getElementById("checkoutForm"),
  ordersList: document.getElementById("ordersList"),
};

function saveState() {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(state.cart));
  localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(state.wishlist));
  localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(state.orders));
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(state.user));
  localStorage.setItem(STORAGE_KEYS.promoHidden, JSON.stringify(state.promoHidden));
}

function getDetailMeta() {
  const raw = productDetailMeta[currentProduct.id] || productDetailMeta.default;
  const fallbackOptions = [
    { id: `${currentProduct.id}-base`, name: "기본 구성", price: currentProduct.price },
    { id: `${currentProduct.id}-double`, name: "더블 구성", price: Math.round(currentProduct.price * 1.9) },
  ];

  return {
    ...productDetailMeta.default,
    ...raw,
    options: raw.options?.length ? raw.options : fallbackOptions,
    detailImages: raw.detailImages?.length
      ? raw.detailImages
      : [resolveProductImage(currentProduct.image), "/dist/img/products/p4.svg", "/dist/img/products/p5.svg"],
  };
}

function getSelectedOption(meta) {
  if (!state.detail.optionId) state.detail.optionId = meta.options[0].id;
  return meta.options.find((option) => option.id === state.detail.optionId) || meta.options[0];
}

function getDetailPrice(meta) {
  const selectedOption = getSelectedOption(meta);
  const addOnTotal = meta.addOns
    .filter((addOn) => state.detail.addOnIds.has(addOn.id))
    .reduce((sum, addOn) => sum + addOn.price, 0);
  const itemTotal = (selectedOption.price + addOnTotal) * state.detail.quantity;
  const shipping = itemTotal >= meta.freeShippingThreshold ? 0 : meta.shippingFee;
  return {
    selectedOption,
    addOnTotal,
    itemTotal,
    shipping,
    paymentTotal: itemTotal + shipping,
  };
}

function getCartDetailedItems() {
  return state.cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return { ...item, product };
    })
    .filter(Boolean);
}

function calculateTotals() {
  const items = getCartDetailedItems();
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 0 && subtotal < 30000 ? 3000 : 0;
  let discount = 0;
  let discountText = "-";

  if (state.coupon?.type === "percent") {
    discount = Math.floor((subtotal * state.coupon.value) / 100);
    discountText = `${state.coupon.label} (-${formatCurrency(discount)})`;
  }

  if (state.coupon?.type === "shipping") {
    discount = Math.min(shipping, state.coupon.value);
    discountText = `${state.coupon.label} (-${formatCurrency(discount)})`;
  }

  return { subtotal, shipping, discount, total: Math.max(0, subtotal + shipping - discount), discountText };
}

function getPagedReviews(productReviews) {
  const totalPages = Math.max(1, Math.ceil(productReviews.length / REVIEWS_PER_PAGE));
  state.reviewPage = Math.min(totalPages, Math.max(1, state.reviewPage));
  const start = (state.reviewPage - 1) * REVIEWS_PER_PAGE;
  const list = productReviews.slice(start, start + REVIEWS_PER_PAGE);
  return { list, totalPages };
}

function setActiveSection(sectionId) {
  state.activeSection = sectionId;
  document.querySelectorAll(".pd-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.target === sectionId);
  });
}

function initScrollSpy() {
  if (sectionObserver) sectionObserver.disconnect();
  const sections = [...document.querySelectorAll(".pd-section")];
  if (!sections.length) return;

  sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActiveSection(visible.target.id);
    },
    {
      threshold: [0.35, 0.55],
      rootMargin: "-20% 0px -45% 0px",
    },
  );

  sections.forEach((section) => sectionObserver.observe(section));
  setActiveSection(state.activeSection || "section-detail");
}

function renderDetail() {
  const meta = getDetailMeta();
  const { selectedOption, addOnTotal, itemTotal, shipping, paymentTotal } = getDetailPrice(meta);

  const productReviews = reviews.filter((review) => review.productId === currentProduct.id);
  const reviewAverage = productReviews.length
    ? (productReviews.reduce((sum, review) => sum + review.score, 0) / productReviews.length).toFixed(1)
    : currentProduct.rating.toFixed(1);
  const { list: reviewPageList, totalPages } = getPagedReviews(productReviews);

  const gallery = meta.detailImages;
  state.detail.imageIndex = Math.min(Math.max(0, state.detail.imageIndex), gallery.length - 1);
  const imageSrc = gallery[state.detail.imageIndex] || resolveProductImage(currentProduct.image);
  const imageFallback = resolveProductImageFallback(currentProduct.image);

  const discountRate = Math.round((1 - currentProduct.price / currentProduct.originalPrice) * 100);

  el.detailContent.innerHTML = `
    <section class="pd-top">
      <div class="pd-media">
        <div class="pd-media-stage">
          <img
            src="${imageSrc}"
            data-fallback="${imageFallback}"
            alt="${currentProduct.name}"
            onerror="if(this.dataset.fallback && this.src !== this.dataset.fallback){this.src=this.dataset.fallback;}"
          />
          <button class="pd-gallery-nav prev" data-action="prevImage" aria-label="이전 이미지">‹</button>
          <button class="pd-gallery-nav next" data-action="nextImage" aria-label="다음 이미지">›</button>
        </div>
        <div class="pd-gallery-thumbs">
          ${gallery
            .map(
              (img, idx) => `
                <button class="pd-gallery-thumb ${idx === state.detail.imageIndex ? "active" : ""}" data-action="selectDetailImage" data-image-index="${idx}">
                  <img src="${img}" alt="${currentProduct.name} ${idx + 1}" />
                </button>`,
            )
            .join("")}
        </div>
      </div>

      <div class="pd-info">
        <p class="pd-eyebrow">${currentProduct.badges?.join(" · ") || "추천 아이템"}</p>
        <h2>${currentProduct.name}</h2>
        <p class="pd-one-line">${currentProduct.oneLine || currentProduct.description}</p>

        <div class="pd-rating">★ ${reviewAverage} (${currentProduct.reviews.toLocaleString("ko-KR")})</div>

        <div class="pd-price">
          <small>${formatCurrency(currentProduct.originalPrice)}</small>
          <div><span>${discountRate}%</span><strong>${formatCurrency(currentProduct.price)}</strong></div>
        </div>

        <div class="pd-meta-lines">
          <p><strong>배송비</strong><span>${formatCurrency(meta.shippingFee)} ( ${formatCurrency(meta.freeShippingThreshold)} 이상 무료 )</span></p>
          <p><strong>쿠폰</strong><span>${meta.couponText}</span></p>
          <p><strong>혜택</strong><span>${meta.interestFreeText}</span></p>
          <p><strong>배송안내</strong><span>${meta.todayShipText}</span></p>
        </div>

        <div class="pd-select-wrap">
          <h4>구매방식</h4>
          <div class="pd-chip-row">
            ${meta.purchaseTypes
              .map(
                (type, idx) =>
                  `<button class="pd-chip ${state.detail.purchaseType === idx ? "active" : ""}" data-action="selectPurchaseType" data-index="${idx}">${type}</button>`,
              )
              .join("")}
          </div>
          <p class="pd-sub-benefit">${meta.subscriptionBenefit}</p>
        </div>

        <div class="pd-select-wrap">
          <h4>${meta.optionsLabel}</h4>
          <div class="pd-option-list">
            ${meta.options
              .map(
                (option) => `
                <button class="pd-option ${selectedOption.id === option.id ? "active" : ""}" data-action="selectOption" data-option-id="${option.id}">
                  <span>${option.name}</span>
                  <strong>${formatCurrency(option.price)}</strong>
                </button>`,
              )
              .join("")}
          </div>
        </div>

        <div class="pd-select-wrap">
          <h4>추가구성</h4>
          <div class="pd-addon-list">
            ${meta.addOns
              .map(
                (addOn) => `
                <button class="pd-addon ${state.detail.addOnIds.has(addOn.id) ? "active" : ""}" data-action="toggleAddon" data-addon-id="${addOn.id}">
                  <span>${addOn.name}</span>
                  <strong>+${formatCurrency(addOn.price)}</strong>
                </button>`,
              )
              .join("")}
          </div>
        </div>

        <div class="pd-qty-row">
          <h4>수량</h4>
          <div class="qty-controls">
            <button data-action="decreaseDetailQty">-</button>
            <span>${state.detail.quantity}</span>
            <button data-action="increaseDetailQty">+</button>
          </div>
        </div>

        <div class="pd-total-box">
          <p>상품금액 <strong>${formatCurrency(itemTotal)}</strong></p>
          <p>옵션추가금액 <strong>${formatCurrency(addOnTotal * state.detail.quantity)}</strong></p>
          <p>배송비 <strong>${formatCurrency(shipping)}</strong></p>
          <p class="final">총 결제예상금액 <strong>${formatCurrency(paymentTotal)}</strong></p>
        </div>
      </div>
    </section>

    <section class="pd-tabs">
      <div class="pd-tab-head">
        <button class="pd-tab ${state.activeSection === "section-detail" ? "active" : ""}" data-action="scrollTab" data-target="section-detail">상세정보</button>
        <button class="pd-tab ${state.activeSection === "section-review" ? "active" : ""}" data-action="scrollTab" data-target="section-review">리뷰 (${currentProduct.reviews})</button>
      </div>

      <div class="pd-tab-panel active pd-section" id="section-detail">
        <h4>제품 설명</h4>
        <p>${currentProduct.description}</p>
        <h4>핵심 성분</h4>
        <ul>${currentProduct.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}</ul>
        <h4>섭취 방법</h4>
        <p>${currentProduct.intake}</p>
        <h4>추천 대상</h4>
        <p>${currentProduct.target}</p>

        <div class="pd-accordion">
          <button class="pd-accordion-head" data-action="toggleSectionOpen" data-section="shipping">
            배송/교환 안내 <span>${state.sectionsOpen.shipping ? "−" : "+"}</span>
          </button>
          <div class="pd-accordion-body ${state.sectionsOpen.shipping ? "open" : ""}">
            <p>주문/결제 완료 후 평균 1~2일 내 출고됩니다. (주말/공휴일 제외)</p>
            <p>상품 수령 후 7일 이내 교환/반품 접수가 가능합니다.</p>
            <p>단순 변심 반품 시 왕복 배송비는 고객 부담입니다.</p>
          </div>
        </div>

        <div class="pd-accordion">
          <button class="pd-accordion-head" data-action="toggleSectionOpen" data-section="inquiry">
            상품문의 안내 <span>${state.sectionsOpen.inquiry ? "−" : "+"}</span>
          </button>
          <div class="pd-accordion-body ${state.sectionsOpen.inquiry ? "open" : ""}">
            <p>상품 문의는 고객센터 또는 1:1 문의를 이용해주세요.</p>
            <p>고객센터 운영시간: 평일 10:00 ~ 18:00</p>
          </div>
        </div>
      </div>

      <div class="pd-tab-panel active pd-section" id="section-review">
        ${
          reviewPageList.length
            ? reviewPageList
                .map(
                  (review) => `
                    <article class="pd-review-item">
                      <div><strong>${"★".repeat(review.score)}${"☆".repeat(5 - review.score)}</strong><span>${review.user} · ${review.date}</span></div>
                      <p>${review.text}</p>
                    </article>`,
                )
                .join("")
            : "<p>아직 등록된 리뷰가 없습니다.</p>"
        }

        <div class="pd-review-pagination">
          <button class="ghost" data-action="reviewPagePrev" ${state.reviewPage <= 1 ? "disabled" : ""}>이전</button>
          <span>${state.reviewPage} / ${totalPages}</span>
          <button class="ghost" data-action="reviewPageNext" ${state.reviewPage >= totalPages ? "disabled" : ""}>다음</button>
        </div>
      </div>
    </section>

    <div class="pd-floating-cta">
      <button class="ghost" data-action="toggleWish" data-id="${currentProduct.id}">${
        state.wishlist.includes(currentProduct.id) ? "찜해제" : "찜하기"
      }</button>
      <button class="ghost" data-action="addDetailToCart">장바구니담기</button>
      <button class="primary" data-action="buyNow">바로구매</button>
    </div>
  `;

  initScrollSpy();
}

function renderCart() {
  const items = getCartDetailedItems();
  el.cartCount.textContent = state.cart.reduce((sum, i) => sum + i.quantity, 0);
  el.cartItems.innerHTML =
    items.length === 0
      ? `<p class="empty">장바구니가 비어 있습니다.</p>`
      : items
          .map(
            (item) => `<article class="cart-item"><strong>${item.product.name}</strong><p>${formatCurrency(item.product.price)} x ${item.quantity}</p><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;"><div class="qty-controls"><button data-action="decreaseQty" data-id="${item.product.id}">-</button><span>${item.quantity}</span><button data-action="increaseQty" data-id="${item.product.id}">+</button></div><button class="text-btn" data-action="removeFromCart" data-id="${item.product.id}">삭제</button></div></article>`,
          )
          .join("");

  const totals = calculateTotals();
  el.priceSummary.innerHTML = `<div>상품금액 <strong>${formatCurrency(totals.subtotal)}</strong></div><div>배송비 <strong>${formatCurrency(totals.shipping)}</strong></div><div>할인 <strong>${totals.discount ? "-" : ""}${formatCurrency(totals.discount)}</strong></div><div style="color:#5d7683;font-size:0.82rem">${totals.discountText}</div><div style="font-size:1.04rem">총 결제금액 <strong>${formatCurrency(totals.total)}</strong></div>`;
}

function renderWishlist() {
  const list = products.filter((p) => state.wishlist.includes(p.id));
  el.wishlistCount.textContent = state.wishlist.length;
  el.wishlistItems.innerHTML =
    list.length === 0
      ? `<p class="empty">찜한 상품이 없습니다.</p>`
      : list
          .map(
            (p) => `<article class="wish-item"><strong>${p.name}</strong><p>${formatCurrency(p.price)}</p><div style="display:flex;gap:8px;"><button class="primary" data-action="addToCart" data-id="${p.id}">장바구니 담기</button><button class="text-btn" data-action="toggleWish" data-id="${p.id}">삭제</button></div></article>`,
          )
          .join("");
}

function renderOrders() {
  if (!state.orders.length) {
    el.ordersList.innerHTML = `<p class="empty">아직 주문 내역이 없습니다.</p>`;
    return;
  }

  el.ordersList.innerHTML = state.orders
    .slice()
    .reverse()
    .map(
      (o) => `<article class="order-item"><strong>${o.orderId} · ${o.date}</strong><p>${o.items.map((i) => `${i.name} x ${i.quantity}`).join(", ")}</p><p>결제수단: ${paymentLabel(o.paymentMethod)} · 총액: ${formatCurrency(o.total)}</p></article>`,
    )
    .join("");
}

function setAuthButton() {
  el.authBtn.textContent = state.user ? `${state.user.name}님` : "로그인";
}

function upsertCart(productId, qty = 1) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;
  const item = state.cart.find((i) => i.productId === productId);
  if (item) item.quantity = Math.min(item.quantity + qty, product.stock);
  else state.cart.push({ productId, quantity: Math.min(qty, product.stock) });
  renderCart();
  saveState();
}

function toggleWishlist(productId) {
  state.wishlist = state.wishlist.includes(productId)
    ? state.wishlist.filter((id) => id !== productId)
    : [...state.wishlist, productId];
  renderWishlist();
  renderDetail();
  saveState();
}

function openDrawer(id) {
  document.getElementById(id).classList.add("open");
}

function closeDrawer(id) {
  document.getElementById(id).classList.remove("open");
}

function openModal(id) {
  document.getElementById(id).classList.add("open");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}

function ensureLogin() {
  if (state.user) return true;
  openModal("authModal");
  return false;
}

function bindEvents() {
  document.addEventListener("click", (e) => {
    const t = e.target;
    const action = t.dataset.action;

    if (action === "selectPurchaseType") {
      state.detail.purchaseType = Number(t.dataset.index);
      renderDetail();
    }

    if (action === "selectOption") {
      state.detail.optionId = t.dataset.optionId;
      renderDetail();
    }

    if (action === "toggleAddon") {
      const addOnId = t.dataset.addonId;
      if (state.detail.addOnIds.has(addOnId)) state.detail.addOnIds.delete(addOnId);
      else state.detail.addOnIds.add(addOnId);
      renderDetail();
    }

    if (action === "increaseDetailQty") {
      state.detail.quantity = Math.min(99, state.detail.quantity + 1);
      renderDetail();
    }

    if (action === "decreaseDetailQty") {
      state.detail.quantity = Math.max(1, state.detail.quantity - 1);
      renderDetail();
    }

    if (action === "prevImage") {
      const meta = getDetailMeta();
      state.detail.imageIndex = (state.detail.imageIndex - 1 + meta.detailImages.length) % meta.detailImages.length;
      renderDetail();
    }

    if (action === "nextImage") {
      const meta = getDetailMeta();
      state.detail.imageIndex = (state.detail.imageIndex + 1) % meta.detailImages.length;
      renderDetail();
    }

    if (action === "selectDetailImage") {
      state.detail.imageIndex = Number(t.dataset.imageIndex || 0);
      renderDetail();
    }

    if (action === "scrollTab") {
      const sectionId = t.dataset.target;
      const section = document.getElementById(sectionId);
      if (!section) return;
      state.activeSection = sectionId;
      setActiveSection(sectionId);
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (action === "toggleSectionOpen") {
      const section = t.dataset.section;
      state.sectionsOpen[section] = !state.sectionsOpen[section];
      renderDetail();
    }

    if (action === "reviewPagePrev") {
      state.reviewPage = Math.max(1, state.reviewPage - 1);
      renderDetail();
    }

    if (action === "reviewPageNext") {
      const total = Math.ceil(reviews.filter((r) => r.productId === currentProduct.id).length / REVIEWS_PER_PAGE) || 1;
      state.reviewPage = Math.min(total, state.reviewPage + 1);
      renderDetail();
    }

    if (action === "addDetailToCart") {
      upsertCart(currentProduct.id, state.detail.quantity);
      openDrawer("cartDrawer");
    }

    if (action === "buyNow") {
      upsertCart(currentProduct.id, state.detail.quantity);
      if (!getCartDetailedItems().length) return;
      if (!ensureLogin()) return;
      openModal("checkoutModal");
    }

    if (action === "addToCart") {
      upsertCart(Number(t.dataset.id), 1);
      openDrawer("cartDrawer");
    }

    if (action === "toggleWish") toggleWishlist(Number(t.dataset.id || currentProduct.id));

    if (action === "removeFromCart") {
      state.cart = state.cart.filter((i) => i.productId !== Number(t.dataset.id));
      renderCart();
      saveState();
    }

    if (action === "increaseQty") upsertCart(Number(t.dataset.id), 1);

    if (action === "decreaseQty") {
      const item = state.cart.find((i) => i.productId === Number(t.dataset.id));
      if (!item) return;
      item.quantity -= 1;
      if (item.quantity <= 0) state.cart = state.cart.filter((i) => i.productId !== Number(t.dataset.id));
      renderCart();
      saveState();
    }

    if (t.dataset.close) {
      if (t.dataset.close.includes("Drawer")) closeDrawer(t.dataset.close);
      else closeModal(t.dataset.close);
    }

    if (t.id === "cartBtn") openDrawer("cartDrawer");
    if (t.id === "wishlistBtn") openDrawer("wishlistDrawer");
    if (t.id === "ordersBtn") {
      renderOrders();
      openModal("ordersModal");
    }
    if (t.id === "authBtn") {
      if (state.user && confirm("로그아웃 하시겠습니까?")) {
        state.user = null;
        saveState();
        setAuthButton();
      } else if (!state.user) {
        openModal("authModal");
      }
    }
  });

  document.addEventListener("click", (e) => {
    const isDrawer = e.target.closest(".drawer");
    const isDrawerBtn = e.target.closest("#cartBtn, #wishlistBtn");
    if (!isDrawer && !isDrawerBtn) {
      closeDrawer("cartDrawer");
      closeDrawer("wishlistDrawer");
    }
  });

  document.querySelectorAll(".modal").forEach((m) => {
    m.addEventListener("click", (e) => {
      if (e.target === m) m.classList.remove("open");
    });
  });

  document.getElementById("applyCouponBtn").addEventListener("click", () => {
    const code = el.couponInput.value.trim().toUpperCase();
    const coupon = couponMap[code];
    if (!coupon) return alert("사용할 수 없는 쿠폰입니다.");
    state.coupon = coupon;
    renderCart();
  });

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (!getCartDetailedItems().length) return alert("장바구니가 비어 있습니다.");
    if (!ensureLogin()) return;
    openModal("checkoutModal");
  });

  el.authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = el.authEmail.value.trim();
    const password = el.authPassword.value.trim();
    const name = el.authName.value.trim();
    if (!email || !password) return;

    if (state.authMode === "signup") {
      if (!name) return alert("이름을 입력해주세요.");
      state.user = { email, name };
    } else {
      state.user = { email, name: email.split("@")[0] };
    }

    saveState();
    setAuthButton();
    closeModal("authModal");
    el.authForm.reset();
  });

  el.toggleAuthMode.addEventListener("click", () => {
    state.authMode = state.authMode === "login" ? "signup" : "login";
    const signup = state.authMode === "signup";
    el.authTitle.textContent = signup ? "회원가입" : "로그인";
    el.authName.classList.toggle("hidden", !signup);
    el.toggleAuthMode.textContent = signup ? "로그인 하기" : "회원가입 하기";
  });

  el.checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(el.checkoutForm).entries());
    if (!formData.paymentMethod) return alert("결제수단을 선택해주세요.");

    const items = getCartDetailedItems();
    if (!items.length) return;
    const totals = calculateTotals();
    state.orders.push({
      orderId: `SL-${Date.now().toString().slice(-8)}`,
      date: new Date().toLocaleDateString("ko-KR"),
      paymentMethod: formData.paymentMethod,
      items: items.map((i) => ({ name: i.product.name, quantity: i.quantity })),
      total: totals.total,
    });
    state.cart = [];
    state.coupon = null;
    saveState();
    renderCart();
    renderOrders();
    closeModal("checkoutModal");
    closeDrawer("cartDrawer");
    openModal("ordersModal");
    el.checkoutForm.reset();
  });

  el.promoClose.addEventListener("click", () => {
    state.promoHidden = true;
    el.body.classList.add("promo-hidden");
    saveState();
  });
}

function init() {
  if (state.promoHidden) el.body.classList.add("promo-hidden");
  renderDetail();
  renderCart();
  renderWishlist();
  renderOrders();
  setAuthButton();
  bindEvents();
}

init();

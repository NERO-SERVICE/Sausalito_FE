import { products, reviews, STORAGE_KEYS, formatCurrency, paymentLabel } from "./store-data.js";

const productId = Number(new URLSearchParams(window.location.search).get("id"));
const currentProduct = products.find((p) => p.id === productId) || products[0];

const state = {
  cart: JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || "[]"),
  wishlist: JSON.parse(localStorage.getItem(STORAGE_KEYS.wishlist) || "[]"),
  orders: JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || "[]"),
  user: JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || "null"),
  promoHidden: JSON.parse(localStorage.getItem(STORAGE_KEYS.promoHidden) || "false"),
  authMode: "login",
  coupon: null,
};

const couponMap = {
  WELCOME20: { type: "percent", value: 20, label: "신규회원 20%" },
  FREESHIP: { type: "shipping", value: 3000, label: "배송비 무료" },
};

const el = {
  body: document.body,
  promoClose: document.getElementById("promoClose"),
  detailContent: document.getElementById("detailContent"),
  relatedProducts: document.getElementById("relatedProducts"),
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

function renderDetail() {
  const relatedReviews = reviews
    .filter((review) => review.productId === currentProduct.id)
    .sort((a, b) => b.helpful - a.helpful)
    .slice(0, 3);

  el.detailContent.innerHTML = `
    <div class="detail-grid">
      <div>
        <div class="product-thumb" style="height:300px;font-size:3.4rem;">${currentProduct.emoji}</div>
        <div class="detail-sections">
          <article class="detail-box">
            <h4>핵심 성분</h4>
            <ul>${currentProduct.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}</ul>
          </article>
          <article class="detail-box">
            <h4>섭취 방법</h4>
            <p>${currentProduct.intake}</p>
          </article>
          <article class="detail-box">
            <h4>추천 대상</h4>
            <p>${currentProduct.target}</p>
          </article>
        </div>
      </div>
      <div>
        <span class="badge">BEST PICK</span>
        <h2 style="margin-top:8px;">${currentProduct.name}</h2>
        <p style="color:#5d7683;line-height:1.55;">${currentProduct.description}</p>
        <p>리뷰 ${currentProduct.reviews}개 · 평점 ${currentProduct.rating} / 5</p>
        <div style="display:flex;gap:8px;align-items:center;margin-top:10px;">
          <strong style="font-size:1.4rem;">${formatCurrency(currentProduct.price)}</strong>
          <small style="text-decoration:line-through;color:#5d7683;">${formatCurrency(currentProduct.originalPrice)}</small>
        </div>
        <div style="display:flex;gap:8px;margin-top:14px;">
          <button class="primary" data-action="addToCart" data-id="${currentProduct.id}">장바구니 담기</button>
          <button class="ghost" data-action="toggleWish" data-id="${currentProduct.id}">${
            state.wishlist.includes(currentProduct.id) ? "찜 해제" : "찜하기"
          }</button>
        </div>

        <div class="detail-sections">
          <article class="detail-box">
            <h4>주의사항</h4>
            <ul>${currentProduct.cautions.map((caution) => `<li>${caution}</li>`).join("")}</ul>
          </article>
          <article class="detail-box">
            <h4>자주 묻는 질문</h4>
            <ul>${currentProduct.faq.map((item) => `<li><strong>Q.</strong> ${item.q}<br/><strong>A.</strong> ${item.a}</li>`).join("")}</ul>
          </article>
          <article class="detail-box">
            <h4>실구매 리뷰</h4>
            <ul>${
              relatedReviews.length
                ? relatedReviews
                    .map((review) => `<li><strong>${"★".repeat(review.score)}</strong> ${review.text} <small>(${review.user})</small></li>`)
                    .join("")
                : "<li>아직 등록된 리뷰가 없습니다.</li>"
            }</ul>
          </article>
        </div>
      </div>
    </div>
  `;
}

function renderRelated() {
  const list = products.filter((p) => p.id !== currentProduct.id).slice(0, 4);
  el.relatedProducts.innerHTML = list.map((p) => renderRelatedProductCard(p)).join("");
}

function renderRelatedProductCard(p) {
  const discountRate = Math.round((1 - p.price / p.originalPrice) * 100);
  const reviewCount = p.reviews.toLocaleString("ko-KR");
  return `
    <a class="product-card product-card-link" href="detail.html?id=${p.id}" aria-label="${p.name} 상세페이지로 이동">
      <div class="product-thumb">
        <div class="product-badges">
          ${(p.badges || []).slice(0, 2).map((badge) => `<span class="product-badge">${badge}</span>`).join("")}
        </div>
        ${p.emoji}
      </div>
      <div class="product-meta">
        <h4>${p.name}</h4>
        <p>${p.oneLine || p.description}</p>
      </div>
      <div class="price-stack">
        <small class="old-price">${formatCurrency(p.originalPrice)}</small>
        <div class="new-price-row">
          <span class="discount-rate">${discountRate}%</span>
          <strong class="new-price">${formatCurrency(p.price)}</strong>
        </div>
      </div>
      <div class="review-count">리뷰 (${reviewCount})</div>
    </a>
  `;
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

    if (action === "addToCart") {
      upsertCart(Number(t.dataset.id), 1);
      openDrawer("cartDrawer");
    }
    if (action === "toggleWish") toggleWishlist(Number(t.dataset.id));
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
  renderRelated();
  renderCart();
  renderWishlist();
  renderOrders();
  setAuthButton();
  bindEvents();
}

init();

import { products, reviews, STORAGE_KEYS, formatCurrency, paymentLabel } from "./store-data.js";

const state = {
  cart: JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || "[]"),
  wishlist: JSON.parse(localStorage.getItem(STORAGE_KEYS.wishlist) || "[]"),
  orders: JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || "[]"),
  user: JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || "null"),
  promoHidden: JSON.parse(localStorage.getItem(STORAGE_KEYS.promoHidden) || "false"),
  authMode: "login",
  coupon: null,
  reviewFilter: "all",
  reviewHighOnly: false,
};

const couponMap = {
  WELCOME20: { type: "percent", value: 20, label: "신규회원 20%" },
  FREESHIP: { type: "shipping", value: 3000, label: "배송비 무료" },
};

const reviewFilters = [
  { key: "all", label: "전체 리뷰" },
  { key: "5", label: "5점 리뷰" },
  { key: "4", label: "4점 이상" },
  { key: "3", label: "3점 이하" },
];

const el = {
  body: document.body,
  promoClose: document.getElementById("promoClose"),
  productGrid: document.getElementById("productGrid"),
  searchInput: document.getElementById("searchInput"),
  priceFilter: document.getElementById("priceFilter"),
  sortFilter: document.getElementById("sortFilter"),
  cartCount: document.getElementById("cartCount"),
  wishlistCount: document.getElementById("wishlistCount"),
  cartItems: document.getElementById("cartItems"),
  wishlistItems: document.getElementById("wishlistItems"),
  priceSummary: document.getElementById("priceSummary"),
  couponInput: document.getElementById("couponInput"),
  reviewSummary: document.getElementById("reviewSummary"),
  reviewFilterRow: document.getElementById("reviewFilterRow"),
  reviewCards: document.getElementById("reviewCards"),
  reviewHighBtn: document.getElementById("reviewHighBtn"),
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

function getFilteredProducts() {
  const keyword = el.searchInput.value.trim().toLowerCase();
  const priceRange = el.priceFilter.value;
  const sort = el.sortFilter.value;
  let list = [...products];

  if (keyword) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(keyword) ||
        p.description.toLowerCase().includes(keyword) ||
        p.ingredients.some((ingredient) => ingredient.toLowerCase().includes(keyword)),
    );
  }

  if (priceRange !== "all") {
    const [min, max] = priceRange.split("-").map(Number);
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
    el.productGrid.innerHTML = `<p class="empty">조건에 맞는 상품이 없습니다.</p>`;
    return;
  }

  el.productGrid.innerHTML = list
    .map((p) => {
      const liked = state.wishlist.includes(p.id);
      const discountRate = Math.round((1 - p.price / p.originalPrice) * 100);
      const lowStock = p.stock <= 30;
      return `
      <article class="product-card">
        <div class="product-thumb">${p.emoji}</div>
        <div class="product-meta">
          <span class="badge ${lowStock ? "low-stock" : ""}">${lowStock ? `재고 ${p.stock}개` : `할인 ${discountRate}%`}</span>
          <h4>${p.name}</h4>
          <p>⭐ ${p.rating} (${p.reviews}) · ${p.ingredients.slice(0, 2).join("/")}</p>
        </div>
        <div class="price-row">
          <span>${formatCurrency(p.price)}</span>
          <small style="color:#5d7683;text-decoration:line-through">${formatCurrency(p.originalPrice)}</small>
        </div>
        <div class="card-actions">
          <button class="primary" data-action="addToCart" data-id="${p.id}">담기</button>
          <button class="ghost" data-action="toggleWish" data-id="${p.id}">${liked ? "♥" : "♡"}</button>
        </div>
        <a class="text-btn link-btn" href="pages/detail.html?id=${p.id}">상세보기</a>
      </article>`;
    })
    .join("");
}

function getFilteredReviews() {
  let list = [...reviews];
  if (state.reviewFilter === "5") list = list.filter((r) => r.score === 5);
  if (state.reviewFilter === "4") list = list.filter((r) => r.score >= 4);
  if (state.reviewFilter === "3") list = list.filter((r) => r.score <= 3);
  if (state.reviewHighOnly) list = list.filter((r) => r.score >= 5);
  return list.sort((a, b) => b.helpful - a.helpful);
}

function renderReviewSummary() {
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => (dist[r.score] += 1));
  const total = reviews.length;
  const avg = (reviews.reduce((sum, r) => sum + r.score, 0) / total).toFixed(1);

  el.reviewSummary.innerHTML = `
    <div class="review-score">
      <strong>${avg}</strong>
      <div>${"★".repeat(Math.round(Number(avg)))}${"☆".repeat(5 - Math.round(Number(avg)))}</div>
      <small>총 ${total}개 리뷰</small>
    </div>
    <div class="review-bars">
      ${[5, 4, 3, 2, 1]
        .map((s) => {
          const c = dist[s];
          const pct = total ? Math.round((c / total) * 100) : 0;
          return `<div class="review-bar"><span>${s}점</span><div class="review-bar-track"><div class="review-bar-fill" style="width:${pct}%"></div></div><span>${c}</span></div>`;
        })
        .join("")}
    </div>`;
}

function renderReviewFilters() {
  el.reviewFilterRow.innerHTML = reviewFilters
    .map((f) => `<button class="review-chip ${state.reviewFilter === f.key ? "active" : ""}" data-review-filter="${f.key}">${f.label}</button>`)
    .join("");
}

function renderReviews() {
  const list = getFilteredReviews();
  if (!list.length) {
    el.reviewCards.innerHTML = `<p class="empty">선택된 조건의 리뷰가 없습니다.</p>`;
    return;
  }

  el.reviewCards.innerHTML = list
    .map((r) => {
      const product = products.find((p) => p.id === r.productId);
      return `<article class="review-card">
        <div class="review-card-head"><span>${r.user} · ${r.date}</span><strong>${"★".repeat(r.score)}${"☆".repeat(5 - r.score)}</strong></div>
        <p>${r.text}</p>
        <small style="color:#5d7683">구매 옵션: ${r.option}</small>
        <div class="review-foot"><span>도움돼요 ${r.helpful}</span><a class="text-btn link-btn" href="pages/detail.html?id=${r.productId}">${product?.name || "상품"} 보기</a></div>
      </article>`;
    })
    .join("");
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
      (o) => `<article class="order-item"><strong>${o.orderId} · ${o.date}</strong><p>${o.items.map((i) => `${i.name} x ${i.quantity}`).join(", ")}</p><p>결제수단: ${paymentLabel(o.paymentMethod)} · 총액: ${formatCurrency(o.total)}</p><button class="ghost" data-action="reorder" data-order-id="${o.orderId}">재주문</button></article>`,
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
  renderProducts();
  renderWishlist();
  saveState();
}

function openDrawer(id) {
  document.getElementById(id).classList.add("open");
}

function closeDrawer(id) {
  document.getElementById(id).classList.remove("open");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}

function openModal(id) {
  document.getElementById(id).classList.add("open");
}

function ensureLogin() {
  if (state.user) return true;
  openModal("authModal");
  return false;
}

function completeOrder(formData) {
  const items = getCartDetailedItems();
  if (!items.length) return;
  const totals = calculateTotals();
  const order = {
    orderId: `SL-${Date.now().toString().slice(-8)}`,
    date: new Date().toLocaleDateString("ko-KR"),
    paymentMethod: formData.paymentMethod,
    items: items.map((i) => ({ name: i.product.name, quantity: i.quantity })),
    total: totals.total,
  };
  state.orders.push(order);
  state.cart = [];
  state.coupon = null;
  saveState();
  renderCart();
  renderOrders();
  closeModal("checkoutModal");
  closeDrawer("cartDrawer");
  openModal("ordersModal");
}

function bindEvents() {
  [el.searchInput, el.priceFilter, el.sortFilter].forEach((i) => {
    i.addEventListener("input", renderProducts);
    i.addEventListener("change", renderProducts);
  });

  el.reviewFilterRow.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-review-filter]");
    if (!btn) return;
    state.reviewFilter = btn.dataset.reviewFilter;
    renderReviewFilters();
    renderReviews();
  });

  el.reviewHighBtn.addEventListener("click", () => {
    state.reviewHighOnly = !state.reviewHighOnly;
    el.reviewHighBtn.textContent = state.reviewHighOnly ? "전체 리뷰 보기" : "평점 4.5 이상만 보기";
    renderReviews();
  });

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
    if (action === "reorder") {
      const order = state.orders.find((o) => o.orderId === t.dataset.orderId);
      if (!order) return;
      order.items.forEach((oi) => {
        const p = products.find((x) => x.name === oi.name);
        if (p) upsertCart(p.id, oi.quantity);
      });
      closeModal("ordersModal");
      openDrawer("cartDrawer");
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
    if (t.id === "heroShopNow" || t.id === "heroBestSeller") {
      if (t.id === "heroBestSeller") {
        el.sortFilter.value = "popular";
        renderProducts();
      }
      document.getElementById("productSection").scrollIntoView({ behavior: "smooth" });
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
    if (!coupon) {
      alert("사용할 수 없는 쿠폰입니다.");
      return;
    }
    state.coupon = coupon;
    renderCart();
  });

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (!getCartDetailedItems().length) {
      alert("장바구니가 비어 있습니다.");
      return;
    }
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
    completeOrder(formData);
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
  renderProducts();
  renderReviewSummary();
  renderReviewFilters();
  renderReviews();
  renderCart();
  renderWishlist();
  renderOrders();
  setAuthButton();
  bindEvents();
}

init();

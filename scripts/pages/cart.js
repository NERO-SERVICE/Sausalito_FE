import { fetchCart, updateCartQuantity, removeFromCart } from "../services/cart-service.js";
import { getUser, syncCurrentUser } from "../services/auth-service.js";
import { formatCurrency } from "../store-data.js";
import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { mountSiteFooter } from "../components/footer.js";

const headerRefs = mountSiteHeader({ showCart: false, currentNav: "shop" });
mountSiteFooter();

const state = {
  cart: {
    items: [],
    subtotal: 0,
    shipping: 0,
    total: 0,
  },
};

const el = {
  cartList: document.getElementById("cartList"),
  cartSummary: document.getElementById("cartSummary"),
};

async function syncHeader() {
  const user = (await syncCurrentUser()) || getUser();
  syncSiteHeader(headerRefs, {
    userName: user?.name || user?.email || null,
    isAdmin: Boolean(user?.is_staff ?? user?.isStaff),
  });
}

function render() {
  const items = state.cart.items;

  if (!items.length) {
    el.cartList.innerHTML = '<p class="empty">장바구니가 비어 있습니다.</p>';
  } else {
    el.cartList.innerHTML = items
      .map(
        (item) => `
        <article class="cart-item">
          <strong>${item.product.name}</strong>
          <p>${formatCurrency(item.lineTotal)} (${item.quantity}개)</p>
          ${item.option ? `<small>옵션: ${item.option.name}</small>` : ""}
          <div class="qty-controls">
            <button data-action="decrease" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button data-action="increase" data-id="${item.id}">+</button>
          </div>
          <button class="text-btn" data-action="remove" data-id="${item.id}">삭제</button>
        </article>`,
      )
      .join("");
  }

  el.cartSummary.innerHTML = `
    <div>상품금액 <strong>${formatCurrency(state.cart.subtotal)}</strong></div>
    <div>배송비 <strong>${formatCurrency(state.cart.shipping)}</strong></div>
    <div>총 결제금액 <strong>${formatCurrency(state.cart.total)}</strong></div>
    <button class="primary" id="checkoutBtn">구매하기</button>
  `;

  const checkout = document.getElementById("checkoutBtn");
  if (checkout) {
    checkout.addEventListener("click", () => {
      if (!state.cart.items.length) {
        alert("장바구니가 비어 있습니다.");
        return;
      }
      location.href = "/pages/checkout.html";
    });
  }
}

async function loadCartAndRender() {
  const user = (await syncCurrentUser()) || getUser();
  if (!user) {
    el.cartList.innerHTML = '<p class="empty">장바구니는 로그인 후 이용할 수 있습니다.</p>';
    el.cartSummary.innerHTML = '<a class="primary" href="/pages/login.html">로그인하러 가기</a>';
    await syncHeader();
    return;
  }

  try {
    state.cart = await fetchCart();
    await syncHeader();
    render();
  } catch (error) {
    console.error(error);
    el.cartList.innerHTML = '<p class="empty">장바구니 데이터를 불러오지 못했습니다.</p>';
  }
}

document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const itemId = Number(btn.dataset.id);
  const action = btn.dataset.action;

  const item = state.cart.items.find((entry) => entry.id === itemId);
  if (!item) return;

  try {
    if (action === "increase") await updateCartQuantity(itemId, item.quantity + 1);
    if (action === "decrease") await updateCartQuantity(itemId, item.quantity - 1);
    if (action === "remove") await removeFromCart(itemId);

    await loadCartAndRender();
  } catch (error) {
    console.error(error);
    alert(error.message || "장바구니 수정에 실패했습니다.");
  }
});

loadCartAndRender();

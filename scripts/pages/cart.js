import { getCartDetailed, updateCartQuantity, removeFromCart, cartTotals } from "../services/cart-service.js";
import { getUser } from "../services/auth-service.js";
import { formatCurrency } from "../store-data.js";
import { mountSiteHeader, syncSiteHeader } from "../components/header.js";

const headerRefs = mountSiteHeader({ showCart: false });

const el = {
  cartList: document.getElementById("cartList"),
  cartSummary: document.getElementById("cartSummary"),
};

function render() {
  const items = getCartDetailed();
  if (!items.length) {
    el.cartList.innerHTML = '<p class="empty">장바구니가 비어 있습니다.</p>';
  } else {
    el.cartList.innerHTML = items
      .map(
        (item) => `
        <article class="cart-item">
          <strong>${item.product.name}</strong>
          <p>${formatCurrency(item.product.price)} x ${item.quantity}</p>
          <div class="qty-controls">
            <button data-action="decrease" data-id="${item.product.id}">-</button>
            <span>${item.quantity}</span>
            <button data-action="increase" data-id="${item.product.id}">+</button>
          </div>
          <button class="text-btn" data-action="remove" data-id="${item.product.id}">삭제</button>
        </article>`,
      )
      .join("");
  }

  const totals = cartTotals();
  el.cartSummary.innerHTML = `
    <div>상품금액 <strong>${formatCurrency(totals.subtotal)}</strong></div>
    <div>배송비 <strong>${formatCurrency(totals.shipping)}</strong></div>
    <div>총 결제금액 <strong>${formatCurrency(totals.total)}</strong></div>
    <button class="primary" id="checkoutBtn">구매하기</button>
  `;

  const checkout = document.getElementById("checkoutBtn");
  if (checkout) {
    checkout.addEventListener("click", () => {
      alert("결제 API 연동 예정 영역입니다.");
    });
  }

  const user = getUser();
  syncSiteHeader(headerRefs, { userName: user?.name || null });
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  const action = btn.dataset.action;

  const items = getCartDetailed();
  const item = items.find((entry) => entry.product.id === id);

  if (action === "increase" && item) updateCartQuantity(id, item.quantity + 1);
  if (action === "decrease" && item) updateCartQuantity(id, item.quantity - 1);
  if (action === "remove") removeFromCart(id);

  render();
});

render();

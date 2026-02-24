import { fetchCart, updateCartQuantity, removeFromCart } from "../services/cart-service.js";
import { getUser, syncCurrentUser } from "../services/auth-service.js";
import { fetchProductById } from "../services/api.js";
import { formatCurrency, resolveProductImage } from "../store-data.js";
import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { mountSiteFooter } from "../components/footer.js";

const headerRefs = mountSiteHeader({ showCart: true, currentNav: "shop" });
mountSiteFooter();

const state = {
  cart: {
    items: [],
    subtotal: 0,
    shipping: 0,
    total: 0,
  },
  productMeta: {},
};

const el = {
  cartInsights: document.getElementById("cartInsights"),
  cartList: document.getElementById("cartList"),
  cartSummary: document.getElementById("cartSummary"),
};

async function syncHeader() {
  const user = (await syncCurrentUser()) || getUser();
  const cartCountValue = state.cart.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  syncSiteHeader(headerRefs, {
    userName: user?.name || user?.email || null,
    isAdmin: Boolean(user?.is_staff ?? user?.isStaff),
    cartCountValue,
  });
}

function getUnitPrice(item) {
  return Number(item.option?.price || item.product?.price || 0);
}

function getOriginalUnitPrice(item) {
  const productId = Number(item.product?.id || 0);
  const metaOriginal = Number(state.productMeta[productId]?.originalPrice || 0);
  const unitPrice = getUnitPrice(item);
  return metaOriginal > 0 ? metaOriginal : unitPrice;
}

function getDiscountRate(item) {
  const unitPrice = getUnitPrice(item);
  const originalUnitPrice = getOriginalUnitPrice(item);
  if (originalUnitPrice <= 0 || unitPrice >= originalUnitPrice) return 0;
  return Math.round((1 - unitPrice / originalUnitPrice) * 100);
}

function getStock(item) {
  const productId = Number(item.product?.id || 0);
  const value = state.productMeta[productId]?.stock;
  if (!Number.isFinite(Number(value))) return null;
  return Number(value);
}

function getTotalDiscount(items = []) {
  return items.reduce((sum, item) => {
    const unitPrice = getUnitPrice(item);
    const originalUnitPrice = getOriginalUnitPrice(item);
    const lineDiscount = Math.max(originalUnitPrice - unitPrice, 0) * Number(item.quantity || 0);
    return sum + lineDiscount;
  }, 0);
}

async function enrichCartItems(items = []) {
  const productIds = [...new Set(items.map((item) => Number(item.product?.id || 0)).filter(Boolean))];
  const missingIds = productIds.filter((productId) => !state.productMeta[productId]);
  if (!missingIds.length) return;

  const rows = await Promise.all(
    missingIds.map(async (productId) => {
      try {
        const product = await fetchProductById(productId);
        return {
          productId,
          originalPrice: Number(product?.originalPrice || product?.price || 0),
          stock: Number(product?.stock ?? NaN),
        };
      } catch (error) {
        console.error(error);
        return {
          productId,
          originalPrice: 0,
          stock: NaN,
        };
      }
    }),
  );

  rows.forEach((row) => {
    state.productMeta[row.productId] = {
      originalPrice: row.originalPrice,
      stock: row.stock,
    };
  });
}

function renderInsights(items = []) {
  if (!el.cartInsights) return;

  if (!items.length) {
    el.cartInsights.innerHTML = "";
    return;
  }

  const maxDiscountRate = items.reduce((max, item) => Math.max(max, getDiscountRate(item)), 0);
  const totalDiscount = getTotalDiscount(items);
  const lowStockCount = items.filter((item) => {
    const stock = getStock(item);
    return Number.isFinite(stock) && stock <= 5;
  }).length;

  el.cartInsights.innerHTML = `
    <section class="cart-insight-grid">
      <article>
        <p>장바구니 최대 할인율</p>
        <strong>${maxDiscountRate}%</strong>
      </article>
      <article>
        <p>재고 임박 상품</p>
        <strong>${lowStockCount}개</strong>
      </article>
      <article>
        <p>내가 받은 총 할인 혜택</p>
        <strong>${formatCurrency(totalDiscount)}</strong>
      </article>
    </section>
  `;
}

function render() {
  const items = state.cart.items;
  renderInsights(items);

  if (!items.length) {
    el.cartList.innerHTML = '<p class="empty">장바구니가 비어 있습니다.</p>';
  } else {
    el.cartList.innerHTML = items
      .map((item) => {
        const discountRate = getDiscountRate(item);
        const stock = getStock(item);
        const stockLabel =
          stock === null
            ? "재고 확인중"
            : stock <= 5
              ? `재고 임박 ${stock}개`
              : `재고 ${stock}개`;

        return `
          <article class="cart-item">
            <div class="cart-item-head">
              <img src="${resolveProductImage(item.product.image)}" alt="${item.product.name}" />
              <div class="cart-item-info">
                <strong>${item.product.name}</strong>
                <p>${formatCurrency(item.lineTotal)} (${item.quantity}개)</p>
                <div class="cart-item-meta">
                  ${
                    discountRate > 0
                      ? `<span class="cart-chip discount">할인 ${discountRate}%</span>`
                      : '<span class="cart-chip">할인 없음</span>'
                  }
                  <span class="cart-chip ${stock !== null && stock <= 5 ? "warning" : ""}">${stockLabel}</span>
                </div>
                ${item.option ? `<small>옵션: ${item.option.name}</small>` : ""}
              </div>
            </div>
            <div class="qty-controls">
              <button data-action="decrease" data-id="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button data-action="increase" data-id="${item.id}">+</button>
            </div>
            <button class="text-btn" data-action="remove" data-id="${item.id}">삭제</button>
          </article>`;
      })
      .join("");
  }

  el.cartSummary.innerHTML = `
    <div>상품금액 <strong>${formatCurrency(state.cart.subtotal)}</strong></div>
    <div>총 할인 혜택 <strong class="cart-benefit-amount">-${formatCurrency(getTotalDiscount(items))}</strong></div>
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
    if (el.cartInsights) el.cartInsights.innerHTML = "";
    el.cartList.innerHTML = '<p class="empty">장바구니는 로그인 후 이용할 수 있습니다.</p>';
    el.cartSummary.innerHTML = '<a class="primary" href="/pages/login.html">로그인하러 가기</a>';
    await syncHeader();
    return;
  }

  try {
    state.cart = await fetchCart();
    await enrichCartItems(state.cart.items);
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

import { apiRequest } from "./api.js";
import { isAuthenticated } from "./auth-service.js";

function emptyCart() {
  return {
    id: null,
    items: [],
    subtotal: 0,
    shipping: 0,
    total: 0,
  };
}

function normalizeCartItem(item = {}) {
  const product = item.product || {};
  const option = item.option || null;

  return {
    id: item.id,
    quantity: Number(item.quantity || 0),
    lineTotal: Number(item.line_total || 0),
    product: {
      id: product.id,
      name: product.name || "",
      price: Number(product.price || 0),
      image: product.image || "",
    },
    option: option
      ? {
          id: option.id,
          name: option.name || "",
          price: Number(option.price || 0),
        }
      : null,
  };
}

function normalizeCart(raw = {}) {
  return {
    id: raw.id || null,
    items: Array.isArray(raw.items) ? raw.items.map(normalizeCartItem) : [],
    subtotal: Number(raw.subtotal || 0),
    shipping: Number(raw.shipping || 0),
    total: Number(raw.total || 0),
  };
}

export async function fetchCart() {
  if (!isAuthenticated()) {
    return emptyCart();
  }

  const data = await apiRequest("/cart");
  return normalizeCart(data);
}

export async function getCartDetailed() {
  const cart = await fetchCart();
  return cart.items;
}

export async function addToCart(productId, quantity = 1, optionId = null) {
  if (!isAuthenticated()) {
    throw new Error("로그인이 필요합니다.");
  }

  await apiRequest("/cart/items", {
    method: "POST",
    body: {
      product_id: productId,
      option_id: optionId,
      quantity,
    },
  });

  return fetchCart();
}

export async function updateCartQuantity(itemId, quantity) {
  if (!isAuthenticated()) {
    throw new Error("로그인이 필요합니다.");
  }

  if (quantity <= 0) {
    await removeFromCart(itemId);
    return fetchCart();
  }

  await apiRequest(`/cart/items/${itemId}`, {
    method: "PATCH",
    body: { quantity },
  });

  return fetchCart();
}

export async function removeFromCart(itemId) {
  if (!isAuthenticated()) {
    throw new Error("로그인이 필요합니다.");
  }

  await apiRequest(`/cart/items/${itemId}`, {
    method: "DELETE",
  });

  return fetchCart();
}

export async function cartCount() {
  if (!isAuthenticated()) return 0;
  const cart = await fetchCart();
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

export async function cartTotals() {
  const cart = await fetchCart();
  return {
    subtotal: cart.subtotal,
    shipping: cart.shipping,
    total: cart.total,
  };
}

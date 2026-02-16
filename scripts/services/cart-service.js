import { STORAGE_KEYS, readJson, writeJson } from "./storage.js";
import { products } from "../store-data.js";

export function getCart() {
  return readJson(STORAGE_KEYS.cart, []);
}

export function setCart(cart) {
  writeJson(STORAGE_KEYS.cart, cart);
}

export function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const found = cart.find((item) => item.productId === productId);
  if (found) found.quantity += quantity;
  else cart.push({ productId, quantity });
  setCart(cart);
}

export function updateCartQuantity(productId, quantity) {
  const cart = getCart().map((item) => (item.productId === productId ? { ...item, quantity } : item));
  setCart(cart.filter((item) => item.quantity > 0));
}

export function removeFromCart(productId) {
  setCart(getCart().filter((item) => item.productId !== productId));
}

export function getCartDetailed() {
  return getCart()
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean);
}

export function cartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function cartTotals() {
  const detailed = getCartDetailed();
  const subtotal = detailed.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 0 && subtotal < 30000 ? 3000 : 0;
  return { subtotal, shipping, total: subtotal + shipping };
}

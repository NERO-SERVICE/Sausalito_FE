export const STORAGE_KEYS = {
  cart: "sausalito_cart",
  wishlist: "sausalito_wishlist",
  user: "sausalito_user",
};

export function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const STORAGE_KEYS = {
  cart: "sausalito_cart",
  wishlist: "sausalito_wishlist",
  user: "sausalito_user",
  tokens: "sausalito_tokens",
};

function getBrowserStorages() {
  const storages = [];
  try {
    if (window.localStorage) {
      storages.push(window.localStorage);
    }
  } catch {
    // ignore
  }
  try {
    if (window.sessionStorage && window.sessionStorage !== window.localStorage) {
      storages.push(window.sessionStorage);
    }
  } catch {
    // ignore
  }
  return storages;
}

export function readJson(key, fallback) {
  const storages = getBrowserStorages();
  for (const storage of storages) {
    try {
      const raw = storage.getItem(key);
      if (raw === null) continue;
      return JSON.parse(raw);
    } catch {
      // ignore and continue other storage
    }
  }
  return fallback;
}

export function writeJson(key, value) {
  const payload = JSON.stringify(value);
  const storages = getBrowserStorages();
  for (const storage of storages) {
    try {
      storage.setItem(key, payload);
    } catch {
      // ignore and continue other storage
    }
  }
}

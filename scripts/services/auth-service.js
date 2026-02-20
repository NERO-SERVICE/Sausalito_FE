import { STORAGE_KEYS, readJson, writeJson } from "./storage.js";
import {
  apiGetKakaoAuthorizeUrl,
  apiKakaoCallback,
  apiFetchMe,
  apiLogin,
  apiLogout,
  apiRegister,
  clearStoredTokens,
  getStoredTokens,
  setStoredTokens,
} from "./api.js";

export function getUser() {
  return readJson(STORAGE_KEYS.user, null);
}

export function getTokens() {
  return getStoredTokens();
}

export function isAuthenticated() {
  return Boolean(getTokens()?.access);
}

export async function login({ email, password }) {
  const data = await apiLogin({ email, password });
  const tokens = data?.tokens || null;
  const user = data?.user || null;

  setStoredTokens(tokens);
  writeJson(STORAGE_KEYS.user, user);

  return user;
}

export async function register({
  email,
  password,
  passwordConfirm,
  name,
  phone,
  recipient,
  recipientPhone = "",
  postalCode,
  roadAddress,
  detailAddress = "",
  agreeTerms,
  agreePrivacy,
  agreeAgeOver14,
  agreeHealthFunctionalFood,
  agreeSmsMarketing = false,
  agreeEmailMarketing = false,
}) {
  const data = await apiRegister({
    email,
    password,
    passwordConfirm,
    name,
    phone,
    recipient,
    recipientPhone,
    postalCode,
    roadAddress,
    detailAddress,
    agreeTerms,
    agreePrivacy,
    agreeAgeOver14,
    agreeHealthFunctionalFood,
    agreeSmsMarketing,
    agreeEmailMarketing,
  });
  const tokens = data?.tokens || null;
  const user = data?.user || null;

  setStoredTokens(tokens);
  writeJson(STORAGE_KEYS.user, user);

  return user;
}

export async function requestKakaoAuthorizeUrl({ redirectUri, state } = {}) {
  return apiGetKakaoAuthorizeUrl({ redirectUri, state });
}

export async function loginWithKakaoCode({ code, redirectUri, state } = {}) {
  const data = await apiKakaoCallback({ code, redirectUri, state });
  const tokens = data?.tokens || null;
  const user = data?.user || null;

  setStoredTokens(tokens);
  writeJson(STORAGE_KEYS.user, user);

  return user;
}

export async function logout() {
  const refresh = getTokens()?.refresh;
  try {
    if (refresh) {
      await apiLogout({ refresh });
    }
  } catch {
    // 로그아웃 API 실패 시에도 로컬 세션은 정리
  }
  clearAuth();
}

export function clearAuth() {
  clearStoredTokens();
  writeJson(STORAGE_KEYS.user, null);
}

export async function syncCurrentUser() {
  if (!isAuthenticated()) return null;
  try {
    const user = await apiFetchMe();
    writeJson(STORAGE_KEYS.user, user);
    return user;
  } catch {
    clearAuth();
    return null;
  }
}

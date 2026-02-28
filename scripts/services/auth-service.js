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

const AUTH_FAILURE_CODES = new Set([
  "AUTHENTICATION_FAILED",
  "INVALID_TOKEN",
  "NOT_AUTHENTICATED",
  "TOKEN_BLACKLISTED",
  "TOKEN_INVALID",
  "TOKEN_NOT_VALID",
  "USER_NOT_FOUND",
]);

function shouldClearAuthOnSyncError(error) {
  const status = Number(error?.status || 0);
  if (status === 401 || status === 403) return true;
  const code = String(error?.code || "").trim().toUpperCase();
  return AUTH_FAILURE_CODES.has(code);
}

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
  const cachedUser = getUser();
  if (!isAuthenticated()) return null;
  try {
    const user = await apiFetchMe();
    writeJson(STORAGE_KEYS.user, user);
    return user;
  } catch (error) {
    if (shouldClearAuthOnSyncError(error)) {
      clearAuth();
      return null;
    }
    return cachedUser;
  }
}

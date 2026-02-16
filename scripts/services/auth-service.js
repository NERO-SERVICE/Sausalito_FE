import { STORAGE_KEYS, readJson, writeJson } from "./storage.js";

export function getUser() {
  return readJson(STORAGE_KEYS.user, null);
}

export function login({ email, name }) {
  const user = { email, name };
  writeJson(STORAGE_KEYS.user, user);
  return user;
}

export function logout() {
  writeJson(STORAGE_KEYS.user, null);
}

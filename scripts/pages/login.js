import { login, getUser, requestKakaoAuthorizeUrl, syncCurrentUser } from "../services/auth-service.js";
import { mountSiteHeader } from "../components/header.js";
import { mountSiteFooter } from "../components/footer.js";

const KAKAO_STATE_STORAGE_KEY = "sausalito_kakao_signup_state";
const KAKAO_CALLBACK_PATH = "/pages/kakao-callback.html";

const form = document.getElementById("loginForm");
const kakaoQuickLoginBtn = document.getElementById("kakaoQuickLoginBtn");
const loginNotice = document.getElementById("loginNotice");
mountSiteHeader({ showCart: false });
mountSiteFooter();

function setNotice(message, { isError = false } = {}) {
  if (!loginNotice) return;
  loginNotice.textContent = message || "";
  loginNotice.classList.toggle("is-error", isError);
  loginNotice.classList.toggle("is-success", Boolean(message) && !isError);
}

function generateKakaoState() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `state_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function getKakaoRedirectUri() {
  return `${window.location.origin}${KAKAO_CALLBACK_PATH}`;
}

(async function init() {
  const user = (await syncCurrentUser()) || getUser();
  if (user) {
    location.href = "/pages/home.html";
  }
})();

kakaoQuickLoginBtn?.addEventListener("click", async () => {
  kakaoQuickLoginBtn.disabled = true;
  setNotice("");
  try {
    const state = generateKakaoState();
    sessionStorage.setItem(KAKAO_STATE_STORAGE_KEY, state);
    const { authorizeUrl } = await requestKakaoAuthorizeUrl({
      redirectUri: getKakaoRedirectUri(),
      state,
    });
    if (!authorizeUrl) {
      throw new Error("카카오 로그인 URL을 생성하지 못했습니다.");
    }
    window.location.href = authorizeUrl;
  } catch (error) {
    console.error(error);
    setNotice(error.message || "카카오 로그인 연결에 실패했습니다.", { isError: true });
    kakaoQuickLoginBtn.disabled = false;
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setNotice("");
  const data = Object.fromEntries(new FormData(form).entries());

  try {
    await login({ email: data.email, password: data.password });
    location.href = "/pages/home.html";
  } catch (error) {
    console.error(error);
    setNotice(error.message || "로그인에 실패했습니다.", { isError: true });
  }
});

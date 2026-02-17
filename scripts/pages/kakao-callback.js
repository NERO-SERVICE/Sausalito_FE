import {
  getUser,
  loginWithKakaoCode,
  syncCurrentUser,
} from "../services/auth-service.js";
import { mountSiteFooter } from "../components/footer.js";
import { mountSiteHeader } from "../components/header.js";

const KAKAO_STATE_STORAGE_KEY = "sausalito_kakao_signup_state";
const messageEl = document.getElementById("kakaoCallbackMessage");

const headerRefs = mountSiteHeader({ showCart: false, currentNav: "signup" });
mountSiteFooter();
void headerRefs;

function setMessage(message, { isError = false } = {}) {
  if (!messageEl) return;
  messageEl.textContent = message;
  messageEl.classList.toggle("is-error", isError);
}

function getRedirectUri() {
  return `${window.location.origin}/pages/kakao-callback.html`;
}

(async function init() {
  const user = (await syncCurrentUser()) || getUser();
  if (user) {
    window.location.href = "/pages/home.html";
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code") || "";
  const state = params.get("state") || "";
  const oauthError = params.get("error");
  const oauthErrorDescription = params.get("error_description") || "";

  if (oauthError) {
    setMessage(`카카오 인증이 취소되었거나 실패했습니다. (${oauthErrorDescription || oauthError})`, {
      isError: true,
    });
    return;
  }

  if (!code) {
    setMessage("카카오 인증 코드가 없어 회원가입을 진행할 수 없습니다.", { isError: true });
    return;
  }

  const storedState = sessionStorage.getItem(KAKAO_STATE_STORAGE_KEY) || "";
  if (storedState && storedState !== state) {
    setMessage("보안 검증(state) 값이 일치하지 않습니다. 다시 시도해주세요.", { isError: true });
    return;
  }

  try {
    await loginWithKakaoCode({
      code,
      redirectUri: getRedirectUri(),
      state,
    });
    sessionStorage.removeItem(KAKAO_STATE_STORAGE_KEY);
    setMessage("카카오 회원가입이 완료되었습니다. 잠시 후 홈으로 이동합니다.");
    window.location.href = "/pages/home.html";
  } catch (error) {
    console.error(error);
    setMessage(error.message || "카카오 회원가입 처리에 실패했습니다. 다시 시도해주세요.", { isError: true });
  }
})();

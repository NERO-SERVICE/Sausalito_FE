import {
  getUser,
  register,
  requestKakaoAuthorizeUrl,
  syncCurrentUser,
} from "../services/auth-service.js";
import { mountSiteFooter } from "../components/footer.js";
import { mountSiteHeader } from "../components/header.js";

const KAKAO_STATE_STORAGE_KEY = "sausalito_kakao_signup_state";
const KAKAO_CALLBACK_PATH = "/pages/kakao-callback.html";

const headerRefs = mountSiteHeader({ showCart: false, currentNav: "signup" });
mountSiteFooter();
void headerRefs;

const form = document.getElementById("signupForm");
const kakaoSignupBtn = document.getElementById("kakaoSignupBtn");
const openNormalSignupBtn = document.getElementById("openNormalSignupBtn");
const signupNotice = document.getElementById("signupNotice");

function setNotice(message, { isError = false } = {}) {
  if (!signupNotice) return;
  signupNotice.textContent = message || "";
  signupNotice.classList.toggle("is-error", isError);
  signupNotice.classList.toggle("is-success", Boolean(message) && !isError);
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

function toggleNormalSignupForm() {
  if (!form) return;
  const shouldOpen = form.hidden;
  form.hidden = !shouldOpen;
  openNormalSignupBtn.textContent = shouldOpen ? "일반 회원가입 닫기" : "일반 회원가입";
  if (shouldOpen) {
    const firstInput = form.querySelector("input[name='email']");
    firstInput?.focus();
  }
}

openNormalSignupBtn?.addEventListener("click", () => {
  toggleNormalSignupForm();
});

kakaoSignupBtn?.addEventListener("click", async () => {
  kakaoSignupBtn.disabled = true;
  setNotice("");
  try {
    const state = generateKakaoState();
    sessionStorage.setItem(KAKAO_STATE_STORAGE_KEY, state);
    const { authorizeUrl } = await requestKakaoAuthorizeUrl({
      redirectUri: getKakaoRedirectUri(),
      state,
    });
    if (!authorizeUrl) {
      throw new Error("카카오 인증 URL을 생성하지 못했습니다.");
    }
    window.location.href = authorizeUrl;
  } catch (error) {
    console.error(error);
    setNotice(error.message || "카카오 회원가입 연결에 실패했습니다.", { isError: true });
    kakaoSignupBtn.disabled = false;
  }
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setNotice("");

  const formData = Object.fromEntries(new FormData(form).entries());
  if (String(formData.password || "") !== String(formData.passwordConfirm || "")) {
    setNotice("비밀번호와 비밀번호 확인이 일치하지 않습니다.", { isError: true });
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  if (submitButton) submitButton.disabled = true;

  try {
    await register({
      email: String(formData.email || "").trim(),
      password: String(formData.password || ""),
      passwordConfirm: String(formData.passwordConfirm || ""),
      name: String(formData.name || "").trim(),
      phone: String(formData.phone || "").trim(),
      recipient: String(formData.recipient || "").trim(),
      recipientPhone: String(formData.recipientPhone || "").trim(),
      postalCode: String(formData.postalCode || "").trim(),
      roadAddress: String(formData.roadAddress || "").trim(),
      detailAddress: String(formData.detailAddress || "").trim(),
    });
    setNotice("회원가입이 완료되었습니다. 홈으로 이동합니다.");
    window.location.href = "/pages/home.html";
  } catch (error) {
    console.error(error);
    setNotice(error.message || "회원가입에 실패했습니다.", { isError: true });
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});

(async function init() {
  const user = (await syncCurrentUser()) || getUser();
  if (user) {
    window.location.href = "/pages/home.html";
  }
})();

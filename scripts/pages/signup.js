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
const KAKAO_POSTCODE_SCRIPT_URL = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
const KAKAO_POSTCODE_SCRIPT_ID = "kakaoPostcodeScript";

const headerRefs = mountSiteHeader({ showCart: false, currentNav: "signup" });
mountSiteFooter();
void headerRefs;

const form = document.getElementById("signupForm");
const kakaoSignupBtn = document.getElementById("kakaoSignupBtn");
const openNormalSignupBtn = document.getElementById("openNormalSignupBtn");
const signupNotice = document.getElementById("signupNotice");
const searchPostcodeBtn = document.getElementById("searchPostcodeBtn");
const postalCodeInput = document.getElementById("signupPostalCode");
const roadAddressInput = document.getElementById("signupRoadAddress");
const detailAddressInput = document.getElementById("signupDetailAddress");
const agreeAllTermsCheckbox = document.getElementById("agreeAllTerms");
const agreementCheckboxes = Array.from(document.querySelectorAll("input[data-term-checkbox='true']"));
const requiredAgreementCheckboxes = agreementCheckboxes.filter((checkbox) => checkbox.dataset.requiredTerm === "true");

let postcodeScriptPromise = null;

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

function syncAllAgreementCheckboxState() {
  if (!agreeAllTermsCheckbox) return;
  const total = agreementCheckboxes.length;
  const checked = agreementCheckboxes.filter((checkbox) => checkbox.checked).length;
  agreeAllTermsCheckbox.checked = total > 0 && checked === total;
  agreeAllTermsCheckbox.indeterminate = checked > 0 && checked < total;
}

function setAllAgreementCheckboxes(checked) {
  agreementCheckboxes.forEach((checkbox) => {
    checkbox.checked = checked;
  });
  syncAllAgreementCheckboxState();
}

function loadKakaoPostcodeScript() {
  if (window.daum?.Postcode) return Promise.resolve();
  if (postcodeScriptPromise) return postcodeScriptPromise;

  postcodeScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(KAKAO_POSTCODE_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("카카오 주소검색 스크립트를 불러오지 못했습니다.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = KAKAO_POSTCODE_SCRIPT_ID;
    script.src = KAKAO_POSTCODE_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("카카오 주소검색 스크립트를 불러오지 못했습니다."));
    document.head.appendChild(script);
  });

  return postcodeScriptPromise;
}

function composeRoadAddress(data) {
  const base = String(data?.roadAddress || data?.address || "").trim();
  if (!base) return "";

  const extras = [];
  const legalDong = String(data?.bname || "").trim();
  if (legalDong && /[동로가]$/.test(legalDong)) extras.push(legalDong);

  const buildingName = String(data?.buildingName || "").trim();
  if (buildingName && String(data?.apartment || "").toUpperCase() === "Y") {
    extras.push(buildingName);
  }

  if (!extras.length) return base;
  return `${base} (${extras.join(", ")})`;
}

async function openPostcodeSearch() {
  await loadKakaoPostcodeScript();
  if (!window.daum?.Postcode) {
    throw new Error("카카오 주소검색 객체를 찾을 수 없습니다.");
  }

  return new Promise((resolve, reject) => {
    try {
      new window.daum.Postcode({
        oncomplete(data) {
          resolve(data || null);
        },
        onclose() {
          resolve(null);
        },
      }).open();
    } catch (error) {
      reject(error);
    }
  });
}

function isChecked(name) {
  const field = form?.querySelector(`input[name='${name}']`);
  return Boolean(field?.checked);
}

function validateRequiredAgreements() {
  const hasUnchecked = requiredAgreementCheckboxes.some((checkbox) => !checkbox.checked);
  if (hasUnchecked) {
    setNotice("필수 약관(이용약관/개인정보/만 14세 이상/건강기능식품 안내)에 동의해주세요.", { isError: true });
    return false;
  }
  return true;
}

function toggleNormalSignupForm() {
  if (!form) return;
  const shouldOpen = form.hidden;
  form.hidden = !shouldOpen;
  openNormalSignupBtn.textContent = shouldOpen ? "입력 폼 닫기" : "일반 회원가입 입력하기";
  if (shouldOpen) {
    const firstInput = form.querySelector("input[name='email']");
    firstInput?.focus();
  }
}

openNormalSignupBtn?.addEventListener("click", () => {
  toggleNormalSignupForm();
});

agreeAllTermsCheckbox?.addEventListener("change", () => {
  setAllAgreementCheckboxes(agreeAllTermsCheckbox.checked);
});

agreementCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    syncAllAgreementCheckboxState();
  });
});

searchPostcodeBtn?.addEventListener("click", async () => {
  setNotice("");
  searchPostcodeBtn.disabled = true;
  try {
    const data = await openPostcodeSearch();
    if (!data) return;

    const zonecode = String(data.zonecode || "").trim();
    const roadAddress = composeRoadAddress(data);

    if (postalCodeInput) postalCodeInput.value = zonecode;
    if (roadAddressInput) roadAddressInput.value = roadAddress;
    detailAddressInput?.focus();
  } catch (error) {
    console.error(error);
    if (postalCodeInput) postalCodeInput.removeAttribute("readonly");
    if (roadAddressInput) roadAddressInput.removeAttribute("readonly");
    setNotice("주소검색 연결에 실패했습니다. 우편번호/주소를 직접 입력해주세요.", { isError: true });
  } finally {
    searchPostcodeBtn.disabled = false;
  }
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

  if (!validateRequiredAgreements()) {
    return;
  }

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
      agreeTerms: isChecked("agreeTerms"),
      agreePrivacy: isChecked("agreePrivacy"),
      agreeAgeOver14: isChecked("agreeAgeOver14"),
      agreeHealthFunctionalFood: isChecked("agreeHealthFunctionalFood"),
      agreeSmsMarketing: isChecked("agreeSmsMarketing"),
      agreeEmailMarketing: isChecked("agreeEmailMarketing"),
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
    return;
  }
  syncAllAgreementCheckboxState();
})();

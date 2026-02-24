import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { mountSiteFooter } from "../components/footer.js";
import { getUser, logout, syncCurrentUser } from "../services/auth-service.js";
import { cartCount } from "../services/cart-service.js";
import {
  fetchMyDefaultAddress,
  updateMyDefaultAddress,
  updateMyProfile,
  withdrawMyAccount,
} from "../services/api.js";

const headerRefs = mountSiteHeader({ showCart: true, currentNav: "" });
mountSiteFooter();

const KAKAO_POSTCODE_SCRIPT_URL = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
const KAKAO_POSTCODE_SCRIPT_ID = "memberEditKakaoPostcodeScript";

const state = {
  user: null,
  defaultAddress: null,
};

const el = {
  profileForm: document.getElementById("memberProfileForm"),
  withdrawForm: document.getElementById("memberWithdrawForm"),
  email: document.getElementById("memberEditEmail"),
  name: document.getElementById("memberEditName"),
  phone: document.getElementById("memberEditPhone"),
  recipient: document.getElementById("memberEditRecipient"),
  recipientPhone: document.getElementById("memberEditRecipientPhone"),
  postalCode: document.getElementById("memberEditPostalCode"),
  roadAddress: document.getElementById("memberEditRoadAddress"),
  detailAddress: document.getElementById("memberEditDetailAddress"),
  searchPostcodeBtn: document.getElementById("memberSearchPostcodeBtn"),
  smsMarketing: document.getElementById("memberEditSmsMarketing"),
  emailMarketing: document.getElementById("memberEditEmailMarketing"),
  logoutBtn: document.getElementById("myshopLogoutBtn"),
  revealWithdrawBtn: document.getElementById("memberWithdrawRevealBtn"),
  withdrawPanel: document.getElementById("memberWithdrawPanel"),
  withdrawModal: document.getElementById("memberWithdrawConfirmModal"),
  withdrawModalClose: document.getElementById("memberWithdrawModalClose"),
  withdrawCancelBtn: document.getElementById("memberWithdrawCancelBtn"),
  withdrawApproveBtn: document.getElementById("memberWithdrawApproveBtn"),
  withdrawPassword: document.getElementById("memberWithdrawPassword"),
  withdrawReason: document.getElementById("memberWithdrawReason"),
  withdrawConfirm: document.getElementById("memberWithdrawConfirm"),
};

let postcodeScriptPromise = null;

async function syncHeader() {
  let count = 0;
  try {
    count = await cartCount();
  } catch {
    count = 0;
  }
  syncSiteHeader(headerRefs, {
    userName: state.user?.name || state.user?.email || null,
    isAdmin: Boolean(state.user?.is_staff ?? state.user?.isStaff),
    cartCountValue: count,
  });
}

function renderProfile() {
  el.email.value = state.user?.email || "";
  el.name.value = state.user?.name || "";
  el.phone.value = state.user?.phone || "";
  el.smsMarketing.checked = Boolean(state.user?.sms_marketing_opt_in);
  el.emailMarketing.checked = Boolean(state.user?.email_marketing_opt_in);

  el.recipient.value = state.defaultAddress?.recipient || state.user?.name || "";
  el.recipientPhone.value = state.defaultAddress?.phone || state.user?.phone || "";
  el.postalCode.value = state.defaultAddress?.postalCode || "";
  el.roadAddress.value = state.defaultAddress?.roadAddress || "";
  el.detailAddress.value = state.defaultAddress?.detailAddress || "";
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

function loadKakaoPostcodeScript() {
  if (window.daum?.Postcode) return Promise.resolve();
  if (postcodeScriptPromise) return postcodeScriptPromise;

  postcodeScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(KAKAO_POSTCODE_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("주소검색 스크립트를 불러오지 못했습니다.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = KAKAO_POSTCODE_SCRIPT_ID;
    script.src = KAKAO_POSTCODE_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("주소검색 스크립트를 불러오지 못했습니다."));
    document.head.appendChild(script);
  });

  return postcodeScriptPromise;
}

async function openPostcodeSearch() {
  await loadKakaoPostcodeScript();
  if (!window.daum?.Postcode) {
    throw new Error("주소검색 객체를 찾을 수 없습니다.");
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

function openWithdrawModal() {
  if (!el.withdrawModal) return;
  el.withdrawModal.hidden = false;
}

function closeWithdrawModal() {
  if (!el.withdrawModal) return;
  el.withdrawModal.hidden = true;
}

function revealWithdrawPanel() {
  if (!el.withdrawPanel) return;
  el.withdrawPanel.hidden = false;
  el.withdrawPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  el.withdrawPassword?.focus();
}

el.profileForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const payload = {
      email: el.email.value.trim(),
      name: el.name.value.trim(),
      phone: el.phone.value.trim(),
      recipient: el.recipient.value.trim(),
      recipientPhone: el.recipientPhone.value.trim(),
      postalCode: el.postalCode.value.trim(),
      roadAddress: el.roadAddress.value.trim(),
      detailAddress: el.detailAddress.value.trim(),
      smsMarketingOptIn: el.smsMarketing.checked,
      emailMarketingOptIn: el.emailMarketing.checked,
    };

    if (
      !payload.name ||
      !payload.phone ||
      !payload.recipient ||
      !payload.recipientPhone ||
      !payload.postalCode ||
      !payload.roadAddress ||
      !payload.detailAddress
    ) {
      alert("필수입력사항(이메일/주문자명/주문자 연락처/수령인명/주소)을 모두 입력해주세요.");
      return;
    }

    const [updatedUser, updatedAddress] = await Promise.all([
      updateMyProfile({
        email: payload.email,
        name: payload.name,
        phone: payload.phone,
        smsMarketingOptIn: payload.smsMarketingOptIn,
        emailMarketingOptIn: payload.emailMarketingOptIn,
      }),
      updateMyDefaultAddress({
        recipient: payload.recipient,
        phone: payload.recipientPhone,
        postalCode: payload.postalCode,
        roadAddress: payload.roadAddress,
        detailAddress: payload.detailAddress,
      }),
    ]);

    state.user = {
      ...state.user,
      ...updatedUser,
    };
    state.defaultAddress = updatedAddress;
    renderProfile();
    await syncHeader();
    alert("회원정보가 저장되었습니다.");
  } catch (error) {
    console.error(error);
    alert(error.message || "회원정보 저장에 실패했습니다.");
  }
});

el.revealWithdrawBtn?.addEventListener("click", () => {
  openWithdrawModal();
});

el.searchPostcodeBtn?.addEventListener("click", async () => {
  el.searchPostcodeBtn.disabled = true;
  try {
    const data = await openPostcodeSearch();
    if (!data) return;

    const zonecode = String(data.zonecode || "").trim();
    const roadAddress = composeRoadAddress(data);

    el.postalCode.value = zonecode;
    el.roadAddress.value = roadAddress;
    el.detailAddress?.focus();
  } catch (error) {
    console.error(error);
    el.postalCode.removeAttribute("readonly");
    el.roadAddress.removeAttribute("readonly");
    alert("주소검색 연결에 실패했습니다. 우편번호와 도로명 주소를 직접 입력해주세요.");
  } finally {
    el.searchPostcodeBtn.disabled = false;
  }
});

el.withdrawModalClose?.addEventListener("click", () => {
  closeWithdrawModal();
});

el.withdrawCancelBtn?.addEventListener("click", () => {
  closeWithdrawModal();
});

el.withdrawApproveBtn?.addEventListener("click", () => {
  closeWithdrawModal();
  revealWithdrawPanel();
});

el.withdrawForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    if (!el.withdrawConfirm.checked) {
      alert("탈퇴 동의 체크를 완료해주세요.");
      return;
    }

    await withdrawMyAccount({
      password: el.withdrawPassword.value,
      reason: el.withdrawReason.value.trim(),
    });
    await logout();
    alert("회원 탈퇴가 완료되었습니다.");
    location.href = "/pages/home.html";
  } catch (error) {
    console.error(error);
    alert(error.message || "회원 탈퇴 처리에 실패했습니다.");
  }
});

el.logoutBtn?.addEventListener("click", async () => {
  try {
    await logout();
  } catch (error) {
    console.error(error);
  } finally {
    location.href = "/pages/home.html";
  }
});

(async function init() {
  const user = (await syncCurrentUser()) || getUser();
  if (!user) {
    alert("로그인 후 이용할 수 있습니다.");
    location.href = "/pages/login.html";
    return;
  }
  state.user = user;
  try {
    state.defaultAddress = await fetchMyDefaultAddress();
  } catch {
    state.defaultAddress = null;
  }
  renderProfile();
  await syncHeader();
})();

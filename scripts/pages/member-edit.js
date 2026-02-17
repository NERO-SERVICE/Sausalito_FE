import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { mountSiteFooter } from "../components/footer.js";
import { getUser, logout, syncCurrentUser } from "../services/auth-service.js";
import { cartCount } from "../services/cart-service.js";
import { changeMyPassword, updateMyProfile, withdrawMyAccount } from "../services/api.js";

const headerRefs = mountSiteHeader({ showCart: true, currentNav: "" });
mountSiteFooter();

const state = {
  user: null,
};

const el = {
  profileForm: document.getElementById("memberProfileForm"),
  passwordForm: document.getElementById("memberPasswordForm"),
  withdrawForm: document.getElementById("memberWithdrawForm"),
  email: document.getElementById("memberEditEmail"),
  name: document.getElementById("memberEditName"),
  phone: document.getElementById("memberEditPhone"),
  oldPassword: document.getElementById("memberOldPassword"),
  newPassword: document.getElementById("memberNewPassword"),
  newPasswordConfirm: document.getElementById("memberNewPasswordConfirm"),
  withdrawPassword: document.getElementById("memberWithdrawPassword"),
  withdrawReason: document.getElementById("memberWithdrawReason"),
  withdrawConfirm: document.getElementById("memberWithdrawConfirm"),
};

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
}

el.profileForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const updated = await updateMyProfile({
      name: el.name.value.trim(),
      phone: el.phone.value.trim(),
    });
    state.user = {
      ...state.user,
      ...updated,
    };
    renderProfile();
    await syncHeader();
    alert("회원정보가 저장되었습니다.");
  } catch (error) {
    console.error(error);
    alert(error.message || "회원정보 저장에 실패했습니다.");
  }
});

el.passwordForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await changeMyPassword({
      oldPassword: el.oldPassword.value,
      newPassword: el.newPassword.value,
      newPasswordConfirm: el.newPasswordConfirm.value,
    });
    el.oldPassword.value = "";
    el.newPassword.value = "";
    el.newPasswordConfirm.value = "";
    alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
    await logout();
    location.href = "/pages/login.html";
  } catch (error) {
    console.error(error);
    alert(error.message || "비밀번호 변경에 실패했습니다.");
  }
});

el.withdrawForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    if (!el.withdrawConfirm.checked) {
      alert("탈퇴 동의 체크를 완료해주세요.");
      return;
    }
    if (!confirm("정말 회원 탈퇴를 진행하시겠습니까?")) {
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

(async function init() {
  const user = (await syncCurrentUser()) || getUser();
  if (!user) {
    alert("로그인 후 이용할 수 있습니다.");
    location.href = "/pages/login.html";
    return;
  }
  state.user = user;
  renderProfile();
  await syncHeader();
})();

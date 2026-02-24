import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { mountSiteFooter } from "../components/footer.js";
import { getUser, logout, syncCurrentUser } from "../services/auth-service.js";
import { cartCount } from "../services/cart-service.js";
import { changeMyPassword } from "../services/api.js";

const headerRefs = mountSiteHeader({ showCart: true, currentNav: "" });
mountSiteFooter();

const state = {
  user: null,
};

const el = {
  form: document.getElementById("changePasswordForm"),
  account: document.getElementById("changePasswordAccount"),
  oldPassword: document.getElementById("changePasswordOld"),
  newPassword: document.getElementById("changePasswordNew"),
  newPasswordConfirm: document.getElementById("changePasswordNewConfirm"),
  logoutBtn: document.getElementById("myshopLogoutBtn"),
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

function renderAccountInfo() {
  if (!el.account) return;
  el.account.textContent = state.user?.email || "-";
}

el.form?.addEventListener("submit", async (event) => {
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
  renderAccountInfo();
  await syncHeader();
})();

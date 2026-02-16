import { login, getUser, syncCurrentUser } from "../services/auth-service.js";
import { mountSiteHeader } from "../components/header.js";
import { mountSiteFooter } from "../components/footer.js";

const form = document.getElementById("loginForm");
mountSiteHeader({ showCart: false });
mountSiteFooter();

(async function init() {
  const user = (await syncCurrentUser()) || getUser();
  if (user) {
    location.href = "/pages/home.html";
  }
})();

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  try {
    await login({ email: data.email, password: data.password });
    location.href = "/pages/home.html";
  } catch (error) {
    console.error(error);
    alert(error.message || "로그인에 실패했습니다.");
  }
});

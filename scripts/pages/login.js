import { login, getUser } from "../services/auth-service.js";
import { mountSiteHeader } from "../components/header.js";
import { mountSiteFooter } from "../components/footer.js";

const form = document.getElementById("loginForm");
mountSiteHeader({ showCart: false });
mountSiteFooter();

if (getUser()) {
  location.href = "/pages/home.html";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  login({ email: data.email, name: data.name });
  location.href = "/pages/home.html";
});

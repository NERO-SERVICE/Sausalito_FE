import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { getUser } from "../services/auth-service.js";
import { cartCount } from "../services/cart-service.js";
import { mountSiteFooter } from "../components/footer.js";

const headerRefs = mountSiteHeader({ showCart: true, currentNav: "brand" });
mountSiteFooter();
const user = getUser();

syncSiteHeader(headerRefs, {
  userName: user?.name || null,
  cartCountValue: cartCount(),
});

const targets = [...document.querySelectorAll(".brand-story-card, .brand-values article")];
targets.forEach((node) => node.classList.add("brand-animate"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.2 },
);

targets.forEach((target) => observer.observe(target));

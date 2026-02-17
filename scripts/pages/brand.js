import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { getUser, syncCurrentUser } from "../services/auth-service.js";
import { cartCount } from "../services/cart-service.js";
import { mountSiteFooter } from "../components/footer.js";

const headerRefs = mountSiteHeader({ showCart: true, currentNav: "brand" });
mountSiteFooter();

async function syncHeader() {
  const user = (await syncCurrentUser()) || getUser();
  let count = 0;
  try {
    count = await cartCount();
  } catch {
    count = 0;
  }

  syncSiteHeader(headerRefs, {
    userName: user?.name || user?.email || null,
    cartCountValue: count,
  });
}

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

syncHeader();

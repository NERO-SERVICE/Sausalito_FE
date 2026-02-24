import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { getUser, syncCurrentUser } from "../services/auth-service.js";
import { cartCount } from "../services/cart-service.js";
import { mountSiteFooter } from "../components/footer.js";
import { fetchBrandPage } from "../services/api.js";
import { resolveBannerImage } from "../store-data.js";

const headerRefs = mountSiteHeader({ showCart: true, currentNav: "brand" });
mountSiteFooter();

const FALLBACK_BRAND_PAGE = {
  sections: [
    {
      id: 1,
      eyebrow: "01 BRAND PHILOSOPHY",
      title: "좋은 성분을 쉽게 고르는 기준",
      description: "불필요한 성분은 덜고 핵심만 담아 누구나 이해하기 쉬운 선택 기준을 제공합니다.",
      image: "",
      imageAlt: "브랜드 철학 이미지",
    },
    {
      id: 2,
      eyebrow: "02 PRODUCT STANDARD",
      title: "원료부터 포장까지 투명한 관리",
      description: "원료 수급, 제조 공정, 품질 검증 결과를 고객이 확인할 수 있도록 꾸준히 공개합니다.",
      image: "",
      imageAlt: "브랜드 기준 이미지",
    },
    {
      id: 3,
      eyebrow: "03 DAILY ROUTINE",
      title: "바쁜 일상에 맞춘 실천 가능한 루틴",
      description: "아침/저녁 루틴에 맞는 조합으로 복잡함을 줄이고 꾸준함을 높이는 제품 경험을 설계합니다.",
      image: "",
      imageAlt: "브랜드 루틴 이미지",
    },
  ],
};

const el = {
  detailFlow: document.getElementById("brandDetailFlow"),
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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
    isAdmin: Boolean(user?.is_staff ?? user?.isStaff),
    cartCountValue: count,
  });
}

function renderSections(sections = []) {
  if (!el.detailFlow) return;
  const rows = Array.isArray(sections) && sections.length ? sections : FALLBACK_BRAND_PAGE.sections;

  el.detailFlow.innerHTML = rows
    .map((section, index) => {
      const imageUrl = section?.image ? resolveBannerImage(section.image) : "";
      const title = escapeHtml(section?.title || `브랜드 스토리 ${index + 1}`);
      const eyebrow = escapeHtml(section?.eyebrow || "");
      const description = escapeHtml(section?.description || "").replace(/\n/g, "<br />");
      const imageAlt = escapeHtml(section?.imageAlt || section?.title || `브랜드 이미지 ${index + 1}`);

      return `
        <article class="brand-detail-block brand-detail-image-block brand-animate">
          <div class="brand-detail-image ${imageUrl ? "" : "is-empty"}">
            ${
              imageUrl
                ? `<img src="${imageUrl}" alt="${imageAlt}" loading="lazy" decoding="async" />`
                : `<span class="brand-detail-image-empty">${title}</span>`
            }
          </div>
        </article>
        <article class="brand-detail-block brand-detail-copy-block brand-animate">
          ${eyebrow ? `<p class="brand-detail-eyebrow">${eyebrow}</p>` : ""}
          <h3>${title}</h3>
          <p class="brand-detail-description">${description}</p>
        </article>
      `;
    })
    .join("");
}

function setupRevealAnimation() {
  const targets = [...document.querySelectorAll(".brand-animate")];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 },
  );
  targets.forEach((target) => observer.observe(target));
}

async function initBrandPage() {
  try {
    const data = await fetchBrandPage();
    renderSections(data.sections);
  } catch {
    renderSections(FALLBACK_BRAND_PAGE.sections);
  }
}

async function init() {
  await Promise.all([syncHeader(), initBrandPage()]);
  setupRevealAnimation();
}

init();

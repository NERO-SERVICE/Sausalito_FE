import { APP_COLORS } from "./config/colors.js";

export function formatCurrency(value) {
  const safeValue = Number(value || 0);
  return `${safeValue.toLocaleString("ko-KR")}원`;
}

const PRODUCT_PLACEHOLDER_SVG = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" role="img" aria-label="No image">',
  `<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${APP_COLORS.neutral.surfaceSoft}"/><stop offset="100%" stop-color="${APP_COLORS.neutral.border}"/></linearGradient></defs>`,
  '<rect width="800" height="800" fill="url(#bg)"/>',
  `<rect x="150" y="180" width="500" height="420" rx="24" fill="${APP_COLORS.neutral.white}" stroke="${APP_COLORS.neutral.borderSoft}" stroke-width="18"/>`,
  `<circle cx="300" cy="320" r="56" fill="${APP_COLORS.neutral.borderSoft}"/>`,
  `<path d="M210 500l120-110 90 80 70-60 100 90H210z" fill="${APP_COLORS.neutral.borderSoft}"/>`,
  `<text x="400" y="690" text-anchor="middle" font-size="48" font-family="Arial, sans-serif" fill="${APP_COLORS.neutral.muted}">SAUSALITO</text>`,
  "</svg>",
].join("");

export const PRODUCT_IMAGE_PLACEHOLDER = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(PRODUCT_PLACEHOLDER_SVG)}`;

const BANNER_PLACEHOLDER_SVG = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="No banner image">',
  `<defs><linearGradient id="hero" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${APP_COLORS.neutral.text}"/><stop offset="100%" stop-color="${APP_COLORS.banner.gradientEnd}"/></linearGradient></defs>`,
  '<rect width="1600" height="900" fill="url(#hero)"/>',
  `<circle cx="1240" cy="220" r="160" fill="${APP_COLORS.alpha.white18}"/>`,
  `<circle cx="320" cy="760" r="220" fill="${APP_COLORS.alpha.white12}"/>`,
  `<text x="140" y="470" font-size="112" font-family="Arial, sans-serif" fill="${APP_COLORS.neutral.white}" font-weight="700">SAUSALITO</text>`,
  `<text x="140" y="560" font-size="54" font-family="Arial, sans-serif" fill="${APP_COLORS.alpha.white88}">WELLNESS ROUTINE</text>`,
  "</svg>",
].join("");

export const BANNER_IMAGE_PLACEHOLDER = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(BANNER_PLACEHOLDER_SVG)}`;

const MOBILE_IMAGE_BREAKPOINT = 480;
const RESPONSIVE_FALLBACK_FLAG = "responsiveFallbackApplied";
const SIGNED_URL_PATTERN = /(X-Amz-Signature|X-Amz-Credential|X-Goog-Signature|X-Goog-Algorithm|AWSAccessKeyId=|Signature=)/i;
const MOBILE_SUFFIX_PATTERN = /_+w480\./;
const DESKTOP_SUFFIX_PATTERN = /_+w1920\./;

function isMobileViewport() {
  if (typeof window === "undefined") return false;
  if (typeof window.matchMedia === "function") {
    return window.matchMedia(`(max-width: ${MOBILE_IMAGE_BREAKPOINT}px)`).matches;
  }
  return Number(window.innerWidth || 0) <= MOBILE_IMAGE_BREAKPOINT;
}

function deriveMobileVariantPath(url) {
  const source = String(url || "").trim();
  if (!source) return "";
  const [basePath, query = ""] = source.split("?");
  if (MOBILE_SUFFIX_PATTERN.test(basePath)) return source;
  const swapped = basePath.replace(DESKTOP_SUFFIX_PATTERN, "__w480.");
  if (!swapped || swapped === basePath) return source;
  return query ? `${swapped}?${query}` : swapped;
}

function deriveDesktopVariantPath(url) {
  const source = String(url || "").trim();
  if (!source) return "";
  const [basePath, query = ""] = source.split("?");
  if (DESKTOP_SUFFIX_PATTERN.test(basePath)) return source;
  const swapped = basePath.replace(MOBILE_SUFFIX_PATTERN, "__w1920.");
  if (!swapped || swapped === basePath) return source;
  return query ? `${swapped}?${query}` : swapped;
}

function isSignedUrl(url) {
  return SIGNED_URL_PATTERN.test(String(url || ""));
}

function installResponsiveImageErrorFallback() {
  if (typeof document === "undefined") return;
  if (window[RESPONSIVE_FALLBACK_FLAG]) return;

  document.addEventListener(
    "error",
    (event) => {
      const target = event.target;
      if (!(target instanceof HTMLImageElement)) return;
      if (target.dataset.responsiveFallbackTried === "1") return;

      const currentSrc = String(target.currentSrc || target.src || "").trim();
      if (!currentSrc || !MOBILE_SUFFIX_PATTERN.test(currentSrc)) return;

      const desktopSrc = deriveDesktopVariantPath(currentSrc);
      if (!desktopSrc || desktopSrc === currentSrc) return;

      target.dataset.responsiveFallbackTried = "1";
      target.src = desktopSrc;
    },
    true,
  );

  window[RESPONSIVE_FALLBACK_FLAG] = true;
}

if (typeof window !== "undefined") {
  installResponsiveImageErrorFallback();
}

export function resolveResponsiveImageUrl(url) {
  const source = String(url || "").trim();
  if (!source) return "";
  if (isSignedUrl(source)) return source;
  if (!isMobileViewport()) return source;
  return deriveMobileVariantPath(source);
}

function getImagePathList(image) {
  if (!image) return [];
  if (typeof image === "string") {
    const responsive = resolveResponsiveImageUrl(image);
    return responsive && responsive !== image ? [responsive, image] : [image];
  }
  if (typeof image !== "object") return [];

  const preferredMobile = isMobileViewport();
  const mobile = image.mobile || image.mobile_url || image.image_mobile || "";
  const desktop = image.desktop || image.desktop_url || image.image_desktop || "";

  const rows = preferredMobile
    ? [mobile, desktop, image.gif, image.webp, image.png, image.jpg, image.jpeg]
    : [desktop, mobile, image.gif, image.webp, image.png, image.jpg, image.jpeg];
  return rows.filter((item) => typeof item === "string" && item.trim());
}

export function resolveProductImage(image, { useFallback = true } = {}) {
  const primary = getImagePathList(image)[0];
  return primary || (useFallback ? PRODUCT_IMAGE_PLACEHOLDER : "");
}

export function resolveProductImageFallback(image, { useFallback = true } = {}) {
  const [primary, secondary] = getImagePathList(image);
  return secondary || primary || (useFallback ? PRODUCT_IMAGE_PLACEHOLDER : "");
}

export function resolveBannerImage(image) {
  const primary = getImagePathList(image)[0];
  if (typeof primary === "string" && primary.trim()) return primary;
  return BANNER_IMAGE_PLACEHOLDER;
}

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

function getImagePathList(image) {
  if (!image) return [];
  if (typeof image === "string") return [image];
  if (typeof image !== "object") return [];
  return [image.gif, image.webp, image.png, image.jpg, image.jpeg].filter(Boolean);
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

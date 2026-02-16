export function formatCurrency(value) {
  const safeValue = Number(value || 0);
  return `${safeValue.toLocaleString("ko-KR")}원`;
}

const PRODUCT_PLACEHOLDER_SVG = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" role="img" aria-label="No image">',
  '<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f1f5f9"/><stop offset="100%" stop-color="#e2e8f0"/></linearGradient></defs>',
  '<rect width="800" height="800" fill="url(#bg)"/>',
  '<rect x="150" y="180" width="500" height="420" rx="24" fill="#ffffff" stroke="#cbd5e1" stroke-width="18"/>',
  '<circle cx="300" cy="320" r="56" fill="#cbd5e1"/>',
  '<path d="M210 500l120-110 90 80 70-60 100 90H210z" fill="#cbd5e1"/>',
  '<text x="400" y="690" text-anchor="middle" font-size="48" font-family="Arial, sans-serif" fill="#64748b">SAUSALITO</text>',
  "</svg>",
].join("");

export const PRODUCT_IMAGE_PLACEHOLDER = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(PRODUCT_PLACEHOLDER_SVG)}`;

const BANNER_PLACEHOLDER_SVG = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="No banner image">',
  '<defs><linearGradient id="hero" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#0891b2"/></linearGradient></defs>',
  '<rect width="1600" height="900" fill="url(#hero)"/>',
  '<circle cx="1240" cy="220" r="160" fill="rgba(255,255,255,0.18)"/>',
  '<circle cx="320" cy="760" r="220" fill="rgba(255,255,255,0.12)"/>',
  '<text x="140" y="470" font-size="112" font-family="Arial, sans-serif" fill="#ffffff" font-weight="700">SAUSALITO</text>',
  '<text x="140" y="560" font-size="54" font-family="Arial, sans-serif" fill="rgba(255,255,255,0.88)">WELLNESS ROUTINE</text>',
  "</svg>",
].join("");

export const BANNER_IMAGE_PLACEHOLDER = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(BANNER_PLACEHOLDER_SVG)}`;

function getImagePathList(image) {
  if (!image) return [];
  if (typeof image === "string") return [image];
  if (typeof image !== "object") return [];
  return [image.png, image.jpg, image.jpeg, image.webp].filter(Boolean);
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
  if (typeof image === "string" && image.trim()) return image;
  return BANNER_IMAGE_PLACEHOLDER;
}

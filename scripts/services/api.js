import { products, reviews, productDetailMeta, homeBanners } from "../store-data.js";

// TODO: 백엔드 연동 시 fetch('/api/...')로 교체
export async function fetchProducts() {
  return [...products];
}

export async function fetchProductById(id) {
  return products.find((p) => p.id === id) || null;
}

export async function fetchProductDetailMeta(id) {
  return productDetailMeta[id] || productDetailMeta.default;
}

export async function fetchReviewsByProduct(id) {
  return reviews.filter((r) => r.productId === id);
}

export async function fetchHomeBanners() {
  return [...homeBanners];
}

export async function fetchFeaturedReviews(limit = 6) {
  return [...reviews].sort((a, b) => b.helpful - a.helpful).slice(0, limit);
}

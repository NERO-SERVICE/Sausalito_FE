export const products = [
  {
    id: 1,
    name: "데일리 멀티비타민 밸런스",
    oneLine: "하루 한 정으로 균형 잡힌 비타민 케어",
    badges: ["베스트셀러", "할인"],
    image: {
      png: "/dist/img/products/dummy1.png",
    },
    price: 28900,
    originalPrice: 36000,
    rating: 4.9,
    reviews: 1224,
    stock: 87,
    popularScore: 98,
    releaseDate: "2026-01-26",
    description: "13종 비타민과 미네랄을 한 번에 담은 베스트 데일리 포뮬러",
    intake: "1일 1회, 1정을 식후에 섭취",
    target: "활력 저하/면역 관리가 필요한 성인",
    ingredients: ["비타민B군", "비타민C", "아연", "셀렌"],
    cautions: ["특정 성분 알레르기 체질은 원료 확인", "과다 섭취 금지"],
    faq: [
      { q: "공복에 먹어도 되나요?", a: "속이 민감한 경우 식후 섭취를 권장합니다." },
      { q: "다른 영양제와 함께 먹어도 되나요?", a: "중복 성분 함량을 확인한 뒤 섭취하세요." },
    ],
  },
  {
    id: 2,
    name: "오메가3 퓨어 알티지",
    oneLine: "고순도 오메가3로 혈행과 눈 건강 관리",
    badges: ["HOT", "할인"],
    image: "/dist/img/products/dummy2.png",
    price: 35900,
    originalPrice: 45000,
    rating: 4.8,
    reviews: 842,
    stock: 26,
    popularScore: 95,
    releaseDate: "2026-02-03",
    description: "고순도 rTG 오메가3로 혈행과 눈 건강까지 동시 케어",
    intake: "1일 1회, 2캡슐을 충분한 물과 함께 섭취",
    target: "장시간 모니터 사용/혈행 관리가 필요한 분",
    ingredients: ["EPA", "DHA", "비타민E"],
    cautions: ["혈액응고 억제제 복용 시 전문가 상담", "직사광선을 피해 보관"],
    faq: [
      { q: "비린내가 강한가요?", a: "탈취 공정으로 비린맛을 최소화했습니다." },
      { q: "언제 먹는 게 좋나요?", a: "식사 중 또는 식후 섭취를 권장합니다." },
    ],
  },
  {
    id: 3,
    name: "프로바이오틱스 100억",
    oneLine: "코팅 유산균으로 편안한 장 컨디션",
    badges: ["베스트셀러"],
    image: "/dist/img/products/dummy3.png",
    price: 24900,
    originalPrice: 32000,
    rating: 4.7,
    reviews: 1035,
    stock: 138,
    popularScore: 96,
    releaseDate: "2025-12-20",
    description: "장까지 살아가는 코팅 기술을 적용한 유산균 19종 배합",
    intake: "1일 1회, 1포를 물 없이 섭취",
    target: "장 컨디션/배변 리듬 관리가 필요한 분",
    ingredients: ["프로바이오틱스 19종", "프리바이오틱스", "아연"],
    cautions: ["개봉 후 즉시 섭취", "고온다습한 환경 보관 금지"],
    faq: [
      { q: "아이도 먹을 수 있나요?", a: "연령별 권장량이 달라 제품 라벨을 확인하세요." },
      { q: "항생제와 같이 먹어도 되나요?", a: "간격을 두고 섭취하는 것을 권장합니다." },
    ],
  },
  {
    id: 4,
    name: "콜라겐 글로우 샷",
    oneLine: "저분자 콜라겐 이너뷰티 루틴",
    badges: ["HOT"],
    image: "/dist/img/products/p4.svg",
    price: 39900,
    originalPrice: 49000,
    rating: 4.8,
    reviews: 691,
    stock: 54,
    popularScore: 92,
    releaseDate: "2026-01-11",
    description: "저분자 피쉬콜라겐과 비오틴으로 완성한 이너뷰티 루틴",
    intake: "1일 1회, 1병을 냉장 보관 후 섭취",
    target: "피부 탄력/보습 관리가 필요한 분",
    ingredients: ["피쉬콜라겐", "히알루론산", "비오틴"],
    cautions: ["어류 알레르기 체질 주의", "개봉 후 냉장 보관"],
    faq: [
      { q: "언제 섭취하면 좋나요?", a: "저녁 루틴 전후 섭취를 많이 선택합니다." },
      { q: "맛이 어떤가요?", a: "상큼한 베리 블렌드 맛입니다." },
    ],
  },
  {
    id: 5,
    name: "마그네슘 나이트 릴렉스",
    oneLine: "밤 루틴에 맞춘 릴렉스 포뮬러",
    badges: ["할인"],
    image: "/dist/img/products/p5.svg",
    price: 21900,
    originalPrice: 28000,
    rating: 4.6,
    reviews: 407,
    stock: 61,
    popularScore: 84,
    releaseDate: "2025-10-10",
    description: "긴장 완화 루틴에 맞춘 마그네슘+테아닌 배합",
    intake: "1일 1회, 취침 1시간 전 1정을 섭취",
    target: "저녁 긴장 완화/수면 루틴이 필요한 분",
    ingredients: ["마그네슘", "L-테아닌", "비타민B6"],
    cautions: ["권장량 초과 섭취 금지", "임산부는 전문가 상담"],
    faq: [
      { q: "아침에 먹어도 되나요?", a: "수면 루틴 제품이라 저녁 섭취가 더 적합합니다." },
      { q: "얼마나 먹어야 체감되나요?", a: "개인차가 있어 2~4주 꾸준한 섭취를 권장합니다." },
    ],
  },
  {
    id: 6,
    name: "루테인 맥스 아이케어",
    oneLine: "디지털 피로를 위한 데일리 아이케어",
    badges: ["할인", "HOT"],
    image: "/dist/img/products/p6.svg",
    price: 32900,
    originalPrice: 41000,
    rating: 4.7,
    reviews: 556,
    stock: 43,
    popularScore: 89,
    releaseDate: "2025-11-18",
    description: "루테인+지아잔틴으로 눈 피로 관리를 돕는 아이케어 포뮬러",
    intake: "1일 1회, 1캡슐을 식후 섭취",
    target: "디지털 기기 사용량이 많은 직장인",
    ingredients: ["루테인", "지아잔틴", "비타민A"],
    cautions: ["흡연자는 전문가 상담 권장", "어린이 손이 닿지 않는 곳 보관"],
    faq: [
      { q: "렌즈 착용자도 먹어도 되나요?", a: "렌즈 착용 여부와 무관하게 섭취 가능합니다." },
      { q: "눈 건조에도 도움 되나요?", a: "개인차가 있으며 수분 섭취를 함께 권장합니다." },
    ],
  },
];

const seedReviews = [
  { id: 101, productId: 1, user: "김**", score: 5, text: "한 달째 먹고 있는데 오전 집중력이 좋아졌어요.", date: "2026.02.10", helpful: 31, option: "30정" },
  { id: 102, productId: 2, user: "이**", score: 5, text: "비린맛이 거의 없어서 꾸준히 먹기 편해요.", date: "2026.02.08", helpful: 19, option: "60캡슐" },
  { id: 103, productId: 3, user: "박**", score: 4, text: "아침 공복에 먹고 장 컨디션이 안정적입니다.", date: "2026.02.07", helpful: 22, option: "2개월분" },
  { id: 104, productId: 4, user: "정**", score: 5, text: "맛이 괜찮고 휴대하기도 좋아서 출근길에 챙겨요.", date: "2026.02.04", helpful: 15, option: "14병" },
  { id: 105, productId: 5, user: "최**", score: 4, text: "잠들기 전에 먹으면 루틴이 안정적으로 잡히는 느낌이에요.", date: "2026.02.03", helpful: 9, option: "30정" },
  { id: 106, productId: 6, user: "윤**", score: 5, text: "장시간 모니터 볼 때 눈 피로가 덜한 것 같아요.", date: "2026.01.29", helpful: 17, option: "60캡슐" },
  { id: 107, productId: 1, user: "한**", score: 3, text: "효과는 더 지켜보려구요. 포장은 깔끔해서 좋았습니다.", date: "2026.01.26", helpful: 6, option: "30정" },
];

const reviewUsers = ["김**", "이**", "박**", "정**", "최**", "윤**", "장**", "한**", "서**", "문**"];
const reviewTexts = [
  "재구매 의사 있어요. 루틴으로 먹기 편합니다.",
  "패키지가 깔끔해서 선물용으로도 괜찮아요.",
  "맛과 향이 부담 없어서 꾸준히 먹고 있어요.",
  "한 달 정도 복용했는데 만족도가 높습니다.",
  "배송이 빨랐고 포장 상태도 좋았습니다.",
  "가격대비 구성 좋아서 가족과 같이 먹어요.",
];

function formatReviewDate(offset) {
  const date = new Date(Date.UTC(2026, 1, 16));
  date.setUTCDate(date.getUTCDate() - offset);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

function createProductReviews(product, index) {
  const option = `${product.name} 기본 구성`;
  return Array.from({ length: 50 }, (_, reviewIndex) => {
    const score = [5, 5, 4, 5, 4][reviewIndex % 5];
    return {
      id: 1000 + product.id * 100 + reviewIndex,
      productId: product.id,
      user: reviewUsers[(reviewIndex + index) % reviewUsers.length],
      score,
      text: `${reviewTexts[(reviewIndex + product.id) % reviewTexts.length]} (${product.name})`,
      date: formatReviewDate(reviewIndex + index * 4),
      helpful: 3 + ((reviewIndex * 7 + product.id) % 42),
      option,
    };
  });
}

export const reviews = [
  ...seedReviews,
  ...products.flatMap((product, index) => createProductReviews(product, index)),
];

export const productDetailMeta = {
  1: {
    couponText: "10% 추가 할인쿠폰",
    shippingFee: 3000,
    freeShippingThreshold: 50000,
    interestFreeText: "무이자 할부 혜택 제공",
    purchaseTypes: ["1회구매", "정기배송 할인"],
    subscriptionBenefit: "정기배송 선택 시 5% 추가 할인",
    optionsLabel: "상품구성",
    options: [
      { id: "1-30", name: "30일팩 (3병) 샷잔 미포함", price: 25900 },
      { id: "1-60", name: "60일팩 (6병) 샷잔 포함", price: 48900 },
      { id: "1-90", name: "90일팩 (9병) 샷잔 포함", price: 69900 },
      { id: "1-starter", name: "스타터키트 (1병+샷잔)", price: 12900 },
    ],
    addOns: [
      { id: "gift-card", name: "복 메시지 카드", price: 1000 },
      { id: "shopping-bag", name: "쇼핑백", price: 2000 },
      { id: "shot-glass", name: "굿모닝 샷잔", price: 3000 },
      { id: "message-charm", name: "메시지 참", price: 1000 },
    ],
    todayShipText: "오늘출발 상품 · 오후 2시 이전 결제 시 당일 발송",
    inquiryCount: 561,
    detailImages: [
      "/dist/img/products/dummy1.png",
      "/dist/img/products/dummy2.png",
      "/dist/img/products/dummy3.png",
      "/dist/img/products/p4.svg",
    ],
  },
  2: {
    couponText: "5% 추가 할인쿠폰",
    shippingFee: 3000,
    freeShippingThreshold: 50000,
    interestFreeText: "카드사별 무이자 할부 안내",
    purchaseTypes: ["1회구매", "정기배송 할인"],
    subscriptionBenefit: "정기배송 선택 시 3% 할인",
    optionsLabel: "상품구성",
    options: [
      { id: "2-1", name: "1개월분 (60캡슐)", price: 35900 },
      { id: "2-2", name: "2개월분 (120캡슐)", price: 67900 },
      { id: "2-3", name: "3개월분 (180캡슐)", price: 95900 },
    ],
    addOns: [
      { id: "gift-card", name: "복 메시지 카드", price: 1000 },
      { id: "shopping-bag", name: "쇼핑백", price: 2000 },
    ],
    todayShipText: "오늘출발 상품 · 오후 3시 이전 결제 시 당일 발송",
    inquiryCount: 128,
    detailImages: [
      "/dist/img/products/dummy2.png",
      "/dist/img/products/p6.svg",
      "/dist/img/products/p5.svg",
      "/dist/img/products/dummy1.png",
    ],
  },
  default: {
    couponText: "신규회원 쿠폰 적용 가능",
    shippingFee: 3000,
    freeShippingThreshold: 50000,
    interestFreeText: "카드 무이자 할부 안내",
    purchaseTypes: ["1회구매", "정기배송 할인"],
    subscriptionBenefit: "정기배송 선택 시 3% 할인",
    optionsLabel: "상품구성",
    options: [],
    addOns: [{ id: "gift-card", name: "메시지 카드", price: 1000 }],
    todayShipText: "오늘출발 상품 · 마감 시간 전 주문 시 당일 발송",
    inquiryCount: 24,
    detailImages: [],
  },
};

export const homeBanners = [
  {
    id: "hb-1",
    subtitle: "SAUSALITO WELLNESS",
    title: "하루 루틴의 시작",
    description: "매일 가볍게 시작하는 소살리토 데일리 밸런스 셀렉션",
    cta: "자세히 보기",
    link: "/pages/detail.html?id=1",
    image: "/dist/img/products/dummy1.png",
  },
  {
    id: "hb-2",
    subtitle: "TRENDING ITEM",
    title: "오메가3 집중 케어",
    description: "바쁜 일상 속 혈행과 눈 건강을 동시에 챙겨보세요",
    cta: "상품 보러가기",
    link: "/pages/detail.html?id=2",
    image: "/dist/img/products/dummy2.png",
  },
  {
    id: "hb-3",
    subtitle: "BEST REVIEWED",
    title: "베스트 리뷰 제품",
    description: "재구매가 많은 시그니처 제품들을 지금 만나보세요",
    cta: "베스트 보기",
    link: "#bestReview",
    image: "/dist/img/products/dummy3.png",
  },
  {
    id: "hb-4",
    subtitle: "NEW ARRIVAL",
    title: "새롭게 선보이는 루틴",
    description: "신제품으로 나에게 맞는 웰니스 루틴을 업데이트하세요",
    cta: "신제품 보러가기",
    link: "/pages/detail.html?id=4",
    image: "/dist/img/products/p4.svg",
  },
];

export const STORAGE_KEYS = {
  cart: "sausalito_cart",
  wishlist: "sausalito_wishlist",
  orders: "sausalito_orders",
  user: "sausalito_user",
  promoHidden: "sausalito_promo_hidden",
};

export function formatCurrency(value) {
  return `${value.toLocaleString("ko-KR")}원`;
}

export function paymentLabel(method) {
  if (method === "card") return "신용/체크카드";
  if (method === "transfer") return "계좌이체";
  if (method === "kakao") return "카카오페이";
  return method;
}

function getImagePathList(image) {
  if (!image) return [];
  if (typeof image === "string") return [image];
  if (typeof image !== "object") return [];
  return [image.png, image.jpg, image.jpeg, image.webp, image.svg].filter(Boolean);
}

export function resolveProductImage(image) {
  const primary = getImagePathList(image)[0];
  return primary || "";
}

export function resolveProductImageFallback(image) {
  const [primary, secondary] = getImagePathList(image);
  return secondary || primary || "";
}

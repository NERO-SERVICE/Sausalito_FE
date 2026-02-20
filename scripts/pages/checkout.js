import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { mountSiteFooter } from "../components/footer.js";
import { getUser, syncCurrentUser } from "../services/auth-service.js";
import { cartCount, fetchCart } from "../services/cart-service.js";
import {
  createBankTransferRequest,
  createOrder,
  fetchBankTransferAccountInfo,
  fetchMyDefaultAddress,
  fetchProductById,
} from "../services/api.js";
import { formatCurrency, resolveProductImage } from "../store-data.js";

const headerRefs = mountSiteHeader({ showCart: true, currentNav: "shop" });
mountSiteFooter();

const params = new URLSearchParams(location.search);

const KAKAO_POSTCODE_SCRIPT_URL = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
const KAKAO_POSTCODE_SCRIPT_ID = "kakaoCheckoutPostcodeScript";

const DEFAULT_ACCOUNT = {
  bank_name: "신한은행",
  bank_account_no: "110-555-012345",
  account_holder: "소살리토",
  guide_message: "입금 후 관리자 확인이 완료되면 결제완료 처리됩니다.",
  verification_notice: "입금자명은 주문자명과 동일하게 입력해 주세요.",
  cash_receipt_guide: "결제완료 후 현금영수증 발급을 요청할 수 있습니다.",
  business_info: {
    name: "주식회사 네로",
    ceo_name: "한동균, 박호연",
    business_no: "123-45-67890",
    ecommerce_no: "2026-서울마포-0001",
    address: "서울특별시 중구 퇴계로36길 2",
  },
  support_info: {
    phone: "1588-1234",
    email: "cs@nero.ai.kr",
    hours: "평일 10:00 - 18:00 / 점심 12:30 - 13:30",
  },
  delivery_refund_policy: {
    default_shipping_fee: 3000,
    free_shipping_threshold: 30000,
    return_shipping_fee: 3000,
    exchange_shipping_fee: 6000,
    return_address: "서울특별시 중구 퇴계로36길 2 물류센터",
  },
  policy_links: {
    terms: "/pages/terms.html",
    privacy: "/pages/privacy.html",
    guide: "/pages/guide.html",
    commerce_notice: "/pages/commerce-notice.html",
  },
};

const state = {
  user: null,
  defaultAddress: null,
  mode: "cart",
  loading: false,
  buyNow: {
    productId: Number(params.get("productId") || 0),
    optionId: Number(params.get("optionId") || 0) || null,
    quantity: Math.max(1, Number(params.get("quantity") || 1)),
  },
  summary: {
    items: [],
    subtotal: 0,
    shipping: 0,
    total: 0,
  },
  bankAccount: DEFAULT_ACCOUNT,
};

const el = {
  form: document.getElementById("checkoutForm"),
  summary: document.getElementById("checkoutSummary"),
  submitBtn: document.getElementById("checkoutSubmitBtn"),
  bankAccount: document.getElementById("checkoutBankAccount"),
  policyNotice: document.getElementById("checkoutPolicyNotice"),
  policyAgree: document.getElementById("checkoutPolicyAgree"),
  ordererName: document.getElementById("checkoutOrdererName"),
  ordererEmail: document.getElementById("checkoutOrdererEmail"),
  ordererPhone: document.getElementById("checkoutOrdererPhone"),
  loadDefaultAddressBtn: document.getElementById("checkoutLoadDefaultAddressBtn"),
  searchPostcodeBtn: document.getElementById("checkoutSearchPostcodeBtn"),
  saveDefaultAddress: document.getElementById("checkoutSaveDefaultAddress"),
  recipient: document.getElementById("checkoutRecipient"),
  phone: document.getElementById("checkoutPhone"),
  postalCode: document.getElementById("checkoutPostalCode"),
  roadAddress: document.getElementById("checkoutRoadAddress"),
  jibunAddress: document.getElementById("checkoutJibunAddress"),
  detailAddress: document.getElementById("checkoutDetailAddress"),
  depositorName: document.getElementById("checkoutDepositorName"),
  depositorPhone: document.getElementById("checkoutDepositorPhone"),
  transferNote: document.getElementById("checkoutTransferNote"),
};

let postcodeScriptPromise = null;

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function computeShippingFee(subtotal) {
  return subtotal >= 50000 ? 0 : 3000;
}

function buildBuyNowSummary(product, option, quantity) {
  const unitPrice = Number(option?.price ?? product?.price ?? 0);
  const lineTotal = unitPrice * quantity;
  const subtotal = lineTotal;
  const shipping = computeShippingFee(subtotal);
  return {
    items: [
      {
        productId: product.id,
        optionId: option?.id || null,
        name: product.name || "상품",
        optionName: option?.name || "",
        quantity,
        unitPrice,
        lineTotal,
        image: product.image || "",
      },
    ],
    subtotal,
    shipping,
    total: subtotal + shipping,
  };
}

function buildCartSummary(cart) {
  const items = Array.isArray(cart.items)
    ? cart.items.map((item) => ({
        productId: item.product?.id || 0,
        optionId: item.option?.id || null,
        name: item.product?.name || "상품",
        optionName: item.option?.name || "",
        quantity: Number(item.quantity || 0),
        unitPrice: Number(
          item.option?.price !== undefined && item.option?.price !== null
            ? item.option.price
            : item.product?.price || 0,
        ),
        lineTotal: Number(item.lineTotal || 0),
        image: item.product?.image || "",
      }))
    : [];
  return {
    items,
    subtotal: Number(cart.subtotal || 0),
    shipping: Number(cart.shipping || 0),
    total: Number(cart.total || 0),
  };
}

function renderSummary() {
  const summaryItems = state.summary.items
    .map(
      (item) => `
      <article class="checkout-item">
        <img src="${escapeHtml(resolveProductImage(item.image))}" alt="${escapeHtml(item.name)}" />
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          <p>${item.optionName ? `${escapeHtml(item.optionName)} / ` : ""}${item.quantity}개</p>
        </div>
        <b>${formatCurrency(item.lineTotal)}</b>
      </article>
    `,
    )
    .join("");

  el.summary.innerHTML = `
    <section class="checkout-summary-card">
      <h4>주문 상품</h4>
      <div class="checkout-item-list">
        ${summaryItems || '<p class="empty">주문 상품이 없습니다.</p>'}
      </div>
      <div class="checkout-total-box">
        <p><span>상품금액</span><strong>${formatCurrency(state.summary.subtotal)}</strong></p>
        <p><span>배송비</span><strong>${formatCurrency(state.summary.shipping)}</strong></p>
        <p class="final"><span>총 결제예정금액</span><strong>${formatCurrency(state.summary.total)}</strong></p>
      </div>
    </section>
  `;
}

function renderBankAccount() {
  const account = state.bankAccount || DEFAULT_ACCOUNT;
  const business = account.business_info || DEFAULT_ACCOUNT.business_info;
  const support = account.support_info || DEFAULT_ACCOUNT.support_info;
  el.bankAccount.innerHTML = `
    <strong>입금 계좌</strong>
    <p>${escapeHtml(account.bank_name)} ${escapeHtml(account.bank_account_no)}</p>
    <small>예금주 ${escapeHtml(account.account_holder)}</small>
    <small>${escapeHtml(account.guide_message || DEFAULT_ACCOUNT.guide_message)}</small>
    <small>${escapeHtml(account.verification_notice || DEFAULT_ACCOUNT.verification_notice)}</small>
    <small>${escapeHtml(account.cash_receipt_guide || DEFAULT_ACCOUNT.cash_receipt_guide)}</small>
    <small>사업자정보: ${escapeHtml(business.name)} / ${escapeHtml(business.business_no)} / 통신판매업 ${escapeHtml(business.ecommerce_no)}</small>
    <small>고객센터: ${escapeHtml(support.phone)} (${escapeHtml(support.hours)})</small>
    <small>이메일: ${escapeHtml(support.email)}</small>
  `;
}

function renderSubmitState() {
  if (state.loading) {
    el.submitBtn.textContent = "처리 중...";
    el.submitBtn.disabled = true;
    return;
  }
  el.submitBtn.textContent = "계좌이체 입금요청 접수하기";
  el.submitBtn.disabled = false;
}

function renderPolicyNotice() {
  if (!el.policyNotice) return;
  const account = state.bankAccount || DEFAULT_ACCOUNT;
  const policy = account.delivery_refund_policy || DEFAULT_ACCOUNT.delivery_refund_policy;
  const links = account.policy_links || DEFAULT_ACCOUNT.policy_links;
  el.policyNotice.innerHTML = `
    <h5>결제 전 확인 안내</h5>
    <ul>
      <li>기본 배송비 ${formatCurrency(policy.default_shipping_fee)} / ${formatCurrency(policy.free_shipping_threshold)} 이상 무료배송</li>
      <li>반품 배송비 ${formatCurrency(policy.return_shipping_fee)}, 교환 배송비 ${formatCurrency(policy.exchange_shipping_fee)}</li>
      <li>반품지: ${escapeHtml(policy.return_address || "-")}</li>
      <li>정확한 입금 확인을 위해 입금자명·결제금액을 주문정보와 동일하게 입력해 주세요.</li>
    </ul>
    <p>
      <a href="${escapeHtml(links.terms || "/pages/terms.html")}" target="_blank" rel="noopener">이용약관</a>
      <a href="${escapeHtml(links.privacy || "/pages/privacy.html")}" target="_blank" rel="noopener">개인정보처리방침</a>
      <a href="${escapeHtml(links.guide || "/pages/guide.html")}" target="_blank" rel="noopener">배송/교환/환불 안내</a>
      <a href="${escapeHtml(links.commerce_notice || "/pages/commerce-notice.html")}" target="_blank" rel="noopener">전자상거래 고지</a>
    </p>
  `;
}

function renderOrdererProfile() {
  if (el.ordererName) el.ordererName.textContent = state.user?.name || "-";
  if (el.ordererEmail) el.ordererEmail.textContent = state.user?.email || "-";
  if (el.ordererPhone) el.ordererPhone.textContent = state.user?.phone || "-";
}

function fillShippingFields(address = {}) {
  el.recipient.value = String(address.recipient || "").trim();
  el.phone.value = String(address.phone || "").trim();
  el.postalCode.value = String(address.postalCode || "").trim();
  el.roadAddress.value = String(address.roadAddress || "").trim();
  el.jibunAddress.value = String(address.jibunAddress || "").trim();
  el.detailAddress.value = String(address.detailAddress || "").trim();
}

function hydrateDefaultProfile() {
  renderOrdererProfile();

  if (state.defaultAddress) {
    fillShippingFields(state.defaultAddress);
  } else {
    fillShippingFields({
      recipient: state.user?.name || "",
      phone: state.user?.phone || "",
      postalCode: "",
      roadAddress: "",
      jibunAddress: "",
      detailAddress: "",
    });
  }

  if (!el.depositorName.value) {
    el.depositorName.value = state.user?.name || el.recipient.value;
  }
  if (!el.depositorPhone.value) {
    el.depositorPhone.value = state.user?.phone || el.phone.value;
  }
}

function getShippingPayload() {
  return {
    recipient: el.recipient.value.trim(),
    phone: el.phone.value.trim(),
    postalCode: el.postalCode.value.trim(),
    roadAddress: el.roadAddress.value.trim(),
    jibunAddress: el.jibunAddress.value.trim(),
    detailAddress: el.detailAddress.value.trim(),
    saveAsDefaultAddress: Boolean(el.saveDefaultAddress?.checked),
  };
}

function validateShippingPayload(payload) {
  if (!payload.recipient || !payload.phone || !payload.postalCode || !payload.roadAddress) {
    throw new Error("받는 분/연락처/우편번호/도로명 주소는 필수입니다.");
  }
  if (!el.policyAgree?.checked) {
    throw new Error("결제/배송/환불 안내 동의가 필요합니다.");
  }
}

async function syncHeader() {
  let count = 0;
  try {
    count = await cartCount();
  } catch {
    count = 0;
  }
  syncSiteHeader(headerRefs, {
    userName: state.user?.name || state.user?.email || null,
    isAdmin: Boolean(state.user?.is_staff ?? state.user?.isStaff),
    cartCountValue: count,
  });
}

async function initOrderSummary() {
  const isBuyNow = params.get("buyNow") === "1";
  if (isBuyNow && state.buyNow.productId > 0) {
    state.mode = "buyNow";
    const product = await fetchProductById(state.buyNow.productId);
    if (!product) {
      throw new Error("상품 정보를 찾을 수 없습니다.");
    }
    const option = state.buyNow.optionId
      ? (product.options || []).find((item) => Number(item.id) === Number(state.buyNow.optionId)) || null
      : null;
    state.summary = buildBuyNowSummary(product, option, state.buyNow.quantity);
    return;
  }

  state.mode = "cart";
  const cart = await fetchCart();
  if (!cart.items.length) {
    throw new Error("장바구니가 비어 있습니다.");
  }
  state.summary = buildCartSummary(cart);
}

function loadKakaoPostcodeScript() {
  if (window.daum?.Postcode) return Promise.resolve();
  if (postcodeScriptPromise) return postcodeScriptPromise;

  postcodeScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(KAKAO_POSTCODE_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("주소검색 스크립트를 불러오지 못했습니다.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = KAKAO_POSTCODE_SCRIPT_ID;
    script.src = KAKAO_POSTCODE_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("주소검색 스크립트를 불러오지 못했습니다."));
    document.head.appendChild(script);
  });

  return postcodeScriptPromise;
}

function composeRoadAddress(data) {
  const base = String(data?.roadAddress || data?.address || "").trim();
  if (!base) return "";

  const extras = [];
  const legalDong = String(data?.bname || "").trim();
  if (legalDong && /[동로가]$/.test(legalDong)) extras.push(legalDong);

  const buildingName = String(data?.buildingName || "").trim();
  if (buildingName && String(data?.apartment || "").toUpperCase() === "Y") {
    extras.push(buildingName);
  }

  if (!extras.length) return base;
  return `${base} (${extras.join(", ")})`;
}

async function openPostcodeSearch() {
  await loadKakaoPostcodeScript();
  if (!window.daum?.Postcode) {
    throw new Error("주소검색 객체를 찾을 수 없습니다.");
  }

  return new Promise((resolve, reject) => {
    try {
      new window.daum.Postcode({
        oncomplete(data) {
          resolve(data || null);
        },
        onclose() {
          resolve(null);
        },
      }).open();
    } catch (error) {
      reject(error);
    }
  });
}

async function loadMyDefaultAddress({ showAlertIfEmpty = false } = {}) {
  const address = await fetchMyDefaultAddress();
  state.defaultAddress = address || null;
  if (!state.defaultAddress) {
    if (showAlertIfEmpty) {
      alert("등록된 기본 배송지가 없습니다. 배송지 정보를 입력해 주세요.");
    }
    return;
  }

  fillShippingFields({
    recipient: state.defaultAddress.recipient,
    phone: state.defaultAddress.phone,
    postalCode: state.defaultAddress.postalCode,
    roadAddress: state.defaultAddress.roadAddress,
    detailAddress: state.defaultAddress.detailAddress,
    jibunAddress: "",
  });
}

async function submitBankTransfer() {
  const shippingPayload = getShippingPayload();
  validateShippingPayload(shippingPayload);

  const depositorName = el.depositorName.value.trim();
  const depositorPhone = el.depositorPhone.value.trim() || shippingPayload.phone;
  const transferNote = el.transferNote.value.trim();

  if (!depositorName) {
    throw new Error("계좌이체 입금자명을 입력해주세요.");
  }

  const orderPayload = {
    ...shippingPayload,
  };

  if (state.mode === "buyNow") {
    orderPayload.buyNowProductId = state.buyNow.productId;
    orderPayload.buyNowQuantity = state.buyNow.quantity;
    if (state.buyNow.optionId) {
      orderPayload.buyNowOptionId = state.buyNow.optionId;
    }
  }

  const order = await createOrder(orderPayload);
  const transfer = await createBankTransferRequest({
    orderNo: order.orderNo,
    depositorName,
    depositorPhone,
    transferNote,
  });

  alert(
    [
      "계좌이체 입금요청이 접수되었습니다.",
      `주문번호: ${transfer.orderNo}`,
      `입금계좌: ${transfer.bankName} ${transfer.bankAccountNo} (${transfer.accountHolder})`,
      "입금 확인 후 결제완료 처리됩니다.",
    ].join("\n"),
  );
  location.href = "/pages/mypage.html?tab=orders";
}

el.form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (state.loading) return;

  try {
    state.loading = true;
    renderSubmitState();
    await submitBankTransfer();
  } catch (error) {
    console.error(error);
    alert(error.message || "결제 처리에 실패했습니다.");
  } finally {
    state.loading = false;
    renderSubmitState();
  }
});

el.loadDefaultAddressBtn?.addEventListener("click", async () => {
  try {
    el.loadDefaultAddressBtn.disabled = true;
    await loadMyDefaultAddress({ showAlertIfEmpty: true });
  } catch (error) {
    console.error(error);
    alert("기본 배송지 정보를 불러오지 못했습니다.");
  } finally {
    el.loadDefaultAddressBtn.disabled = false;
  }
});

el.searchPostcodeBtn?.addEventListener("click", async () => {
  try {
    el.searchPostcodeBtn.disabled = true;
    const data = await openPostcodeSearch();
    if (!data) return;

    const zonecode = String(data.zonecode || "").trim();
    const roadAddress = composeRoadAddress(data);
    const jibunAddress = String(data.jibunAddress || data.autoJibunAddress || "").trim();

    el.postalCode.value = zonecode;
    el.roadAddress.value = roadAddress;
    el.jibunAddress.value = jibunAddress;
    el.detailAddress.focus();
  } catch (error) {
    console.error(error);
    el.postalCode.removeAttribute("readonly");
    el.roadAddress.removeAttribute("readonly");
    alert("주소검색 연결에 실패했습니다. 우편번호와 주소를 직접 입력해 주세요.");
  } finally {
    el.searchPostcodeBtn.disabled = false;
  }
});

(async function init() {
  const user = (await syncCurrentUser()) || getUser();
  if (!user) {
    alert("주문/결제는 로그인 후 이용 가능합니다.");
    location.href = "/pages/login.html";
    return;
  }

  state.user = user;
  renderOrdererProfile();

  try {
    await initOrderSummary();
    const [bankAccountResult, defaultAddressResult] = await Promise.allSettled([
      fetchBankTransferAccountInfo(),
      fetchMyDefaultAddress(),
    ]);
    state.bankAccount = bankAccountResult.status === "fulfilled" ? bankAccountResult.value : DEFAULT_ACCOUNT;
    state.defaultAddress = defaultAddressResult.status === "fulfilled" ? defaultAddressResult.value : null;

    hydrateDefaultProfile();
    renderSummary();
    renderBankAccount();
    renderPolicyNotice();
    renderSubmitState();
    await syncHeader();
  } catch (error) {
    console.error(error);
    alert(error.message || "주문서 데이터를 불러오지 못했습니다.");
    location.href = "/pages/cart.html";
  }
})();

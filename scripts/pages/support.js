import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { mountSiteFooter } from "../components/footer.js";
import { getUser, syncCurrentUser } from "../services/auth-service.js";
import { cartCount } from "../services/cart-service.js";
import { fetchPublicInquiries, fetchSupportFaqs, fetchSupportNotices } from "../services/api.js";

const headerRefs = mountSiteHeader({ showCart: true, currentNav: "support" });
mountSiteFooter();

const SECTION_META = {
  notice: {
    title: "공지사항",
    description: "서비스 운영 공지와 쇼핑몰 소식을 확인하세요.",
  },
  faq: {
    title: "FAQ",
    description: "자주 묻는 질문을 카테고리별로 빠르게 확인하세요.",
  },
  qna: {
    title: "Q&A",
    description: "모든 회원 문의를 게시판 형태로 조회할 수 있습니다.",
  },
};

const INQUIRY_CATEGORY_LABELS = {
  DELIVERY: "배송",
  RETURN_REFUND: "반품/환불",
  PAYMENT: "결제",
  ORDER: "주문",
  PRODUCT: "상품",
  ETC: "기타",
};

const state = {
  user: null,
  activeTab: "notice",
  noticeKeyword: "",
  noticePage: 1,
  noticeTotalPages: 1,
  notices: [],
  openNoticeId: null,
  faqKeyword: "",
  faqCategory: "ALL",
  faqs: [],
  openFaqId: null,
  qnaKeyword: "",
  qnaPage: 1,
  qnaTotalPages: 1,
  inquiries: [],
  openQnaId: null,
};

const el = {
  navLinks: Array.from(document.querySelectorAll("[data-support-tab]")),
  panels: Array.from(document.querySelectorAll("[data-support-panel]")),
  sectionTitle: document.getElementById("supportSectionTitle"),
  sectionDescription: document.getElementById("supportSectionDescription"),
  noticeSearch: document.getElementById("supportNoticeSearch"),
  noticeList: document.getElementById("supportNoticeList"),
  faqCategory: document.getElementById("supportFaqCategory"),
  faqSearch: document.getElementById("supportFaqSearch"),
  faqList: document.getElementById("supportFaqList"),
  qnaSearch: document.getElementById("supportQnaSearch"),
  qnaList: document.getElementById("supportQnaList"),
  qnaPagination: document.getElementById("supportQnaPagination"),
  inquiryWriteBtn: document.getElementById("supportInquiryWriteBtn"),
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

function getInquiryCategoryLabel(category) {
  const key = String(category || "ETC").toUpperCase();
  return INQUIRY_CATEGORY_LABELS[key] || "기타";
}

function syncInquiryWriteButtonState() {
  if (!el.inquiryWriteBtn) return;
  if (state.user) {
    el.inquiryWriteBtn.disabled = false;
    el.inquiryWriteBtn.textContent = "문의하기";
    el.inquiryWriteBtn.title = "";
    return;
  }
  el.inquiryWriteBtn.disabled = true;
  el.inquiryWriteBtn.textContent = "문의하기 (로그인 필요)";
  el.inquiryWriteBtn.title = "로그인 후 이용할 수 있습니다.";
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

function renderTabState() {
  el.navLinks.forEach((link) => {
    const tab = link.dataset.supportTab;
    link.classList.toggle("is-active", tab === state.activeTab);
  });

  el.panels.forEach((panel) => {
    panel.hidden = panel.dataset.supportPanel !== state.activeTab;
  });

  const meta = SECTION_META[state.activeTab] || SECTION_META.notice;
  if (el.sectionTitle) el.sectionTitle.textContent = meta.title;
  if (el.sectionDescription) el.sectionDescription.textContent = meta.description;
}

function setActiveTab(tab, syncUrl = true) {
  if (!SECTION_META[tab]) return;
  state.activeTab = tab;
  renderTabState();

  if (syncUrl) {
    const url = new URL(location.href);
    url.searchParams.set("tab", tab);
    history.replaceState({}, "", url.toString());
  }

  if (tab === "notice") void loadNotices();
  if (tab === "faq") void loadFaqs();
  if (tab === "qna") void loadInquiries();
}

function renderNoticeList() {
  if (!state.notices.length) {
    el.noticeList.innerHTML = '<p class="empty">등록된 공지사항이 없습니다.</p>';
    return;
  }

  el.noticeList.innerHTML = state.notices
    .map(
      (item) => `
      <article class="support-row">
        <button class="support-row-toggle" type="button" data-notice-toggle="${item.id}">
          <span class="support-row-tag ${item.isPinned ? "pinned" : ""}">${item.isPinned ? "중요" : "공지"}</span>
          <strong>${escapeHtml(item.title)}</strong>
          <span class="support-row-date">${formatDate(item.publishedAt || item.createdAt)}</span>
        </button>
        <div class="support-row-body" ${state.openNoticeId === item.id ? "" : "hidden"}>
          ${escapeHtml(item.content).replace(/\n/g, "<br />")}
        </div>
      </article>
    `,
    )
    .join("");

  const pagination = document.createElement("div");
  pagination.className = "support-pagination";
  pagination.innerHTML = `
    <button type="button" data-action="notice-page" data-page="${Math.max(1, state.noticePage - 1)}" ${state.noticePage <= 1 ? "disabled" : ""}>이전</button>
    <span>${state.noticePage} / ${state.noticeTotalPages}</span>
    <button type="button" data-action="notice-page" data-page="${Math.min(state.noticeTotalPages, state.noticePage + 1)}" ${state.noticePage >= state.noticeTotalPages ? "disabled" : ""}>다음</button>
  `;
  el.noticeList.appendChild(pagination);
}

function getFilteredFaqs() {
  const keyword = state.faqKeyword.trim().toLowerCase();
  return state.faqs.filter((faq) => {
    const categoryMatched = state.faqCategory === "ALL" || faq.category === state.faqCategory;
    if (!categoryMatched) return false;
    if (!keyword) return true;
    const text = `${faq.question} ${faq.answer} ${faq.category}`.toLowerCase();
    return text.includes(keyword);
  });
}

function renderFaqList() {
  const rows = getFilteredFaqs();

  if (!rows.length) {
    el.faqList.innerHTML = '<p class="empty">검색 조건에 맞는 FAQ가 없습니다.</p>';
    return;
  }

  el.faqList.innerHTML = rows
    .map(
      (item) => `
      <article class="support-row">
        <button class="support-row-toggle" type="button" data-faq-toggle="${item.id}">
          <span class="support-row-tag faq">${escapeHtml(item.category)}</span>
          <strong>${escapeHtml(item.question)}</strong>
        </button>
        <div class="support-row-body" ${state.openFaqId === item.id ? "" : "hidden"}>
          ${escapeHtml(item.answer).replace(/\n/g, "<br />")}
        </div>
      </article>
    `,
    )
    .join("");
}

function renderInquiryPagination() {
  if (!el.qnaPagination) return;

  const currentGroup = Math.floor((state.qnaPage - 1) / 10);
  const start = currentGroup * 10 + 1;
  const end = Math.min(start + 9, state.qnaTotalPages);

  let numberButtons = "";
  for (let page = start; page <= end; page += 1) {
    numberButtons += `<button type="button" data-action="qna-page" data-page="${page}" ${page === state.qnaPage ? 'class="is-active"' : ""}>${page}</button>`;
  }

  el.qnaPagination.innerHTML = `
    <button type="button" data-action="qna-page" data-page="${Math.max(1, start - 1)}" ${start <= 1 ? "disabled" : ""}>이전</button>
    ${numberButtons}
    <button type="button" data-action="qna-page" data-page="${Math.min(state.qnaTotalPages, end + 1)}" ${end >= state.qnaTotalPages ? "disabled" : ""}>다음</button>
  `;
}

function renderInquiries() {
  if (!state.inquiries.length) {
    el.qnaList.innerHTML = '<p class="empty">등록된 문의가 없습니다.</p>';
    renderInquiryPagination();
    return;
  }

  el.qnaList.innerHTML = state.inquiries
    .map(
      (item) => `
      <article class="support-row support-inquiry-row">
        <button class="support-row-toggle" type="button" data-qna-toggle="${item.id}">
          <strong>[${escapeHtml(getInquiryCategoryLabel(item.category))}] ${escapeHtml(item.title)}</strong>
          <span class="support-row-meta">
            ${item.answer ? '<span class="support-row-signal answered">답변</span>' : ""}
            <span class="support-row-date">${escapeHtml(item.userName)} · ${formatDate(item.createdAt)}</span>
          </span>
        </button>
        <div class="support-row-body" ${state.openQnaId === item.id ? "" : "hidden"}>
          <p class="support-inquiry-content">${escapeHtml(item.content).replace(/\n/g, "<br />")}</p>
          ${item.answeredAt ? `<div class="support-inquiry-meta"><span>답변일 ${formatDate(item.answeredAt)}</span></div>` : ""}
          ${
            item.answer
              ? `<div class="support-answer-box"><p>관리자 답변</p><div>${escapeHtml(item.answer).replace(/\n/g, "<br />")}</div></div>`
              : ""
          }
        </div>
      </article>
    `,
    )
    .join("");

  renderInquiryPagination();
}

async function loadNotices() {
  const response = await fetchSupportNotices({
    q: state.noticeKeyword,
    page: state.noticePage,
    pageSize: 10,
  });

  state.notices = response.items;
  state.noticeTotalPages = response.totalPages;
  if (state.noticePage > state.noticeTotalPages) {
    state.noticePage = state.noticeTotalPages;
  }
  renderNoticeList();
}

async function loadFaqs() {
  state.faqs = await fetchSupportFaqs({ q: state.faqKeyword });

  const categories = [...new Set(state.faqs.map((item) => item.category).filter(Boolean))];
  if (el.faqCategory) {
    const selected = state.faqCategory;
    el.faqCategory.innerHTML = [
      '<option value="ALL">전체</option>',
      ...categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`),
    ].join("");
    if (categories.includes(selected)) {
      el.faqCategory.value = selected;
    } else {
      state.faqCategory = "ALL";
      el.faqCategory.value = "ALL";
    }
  }

  renderFaqList();
}

async function loadInquiries() {
  const response = await fetchPublicInquiries({
    q: state.qnaKeyword,
    page: state.qnaPage,
    pageSize: 10,
  });

  state.inquiries = response.items;
  state.qnaTotalPages = response.totalPages;
  if (state.qnaPage > state.qnaTotalPages) {
    state.qnaPage = state.qnaTotalPages;
  }

  renderInquiries();
}

el.navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    setActiveTab(link.dataset.supportTab || "notice");
  });
});

el.noticeSearch?.addEventListener("input", () => {
  state.noticeKeyword = el.noticeSearch.value;
  state.noticePage = 1;
  void loadNotices();
});

el.faqSearch?.addEventListener("input", () => {
  state.faqKeyword = el.faqSearch.value;
  void loadFaqs();
});

el.faqCategory?.addEventListener("change", () => {
  state.faqCategory = el.faqCategory.value;
  renderFaqList();
});

el.qnaSearch?.addEventListener("input", () => {
  state.qnaKeyword = el.qnaSearch.value;
  state.qnaPage = 1;
  void loadInquiries();
});

el.inquiryWriteBtn?.addEventListener("click", () => {
  if (!state.user) {
    return;
  }
  location.href = "/pages/support-inquiry-write.html";
});

document.addEventListener("click", (event) => {
  const noticeButton = event.target.closest("[data-notice-toggle]");
  if (noticeButton) {
    const id = Number(noticeButton.dataset.noticeToggle || 0);
    state.openNoticeId = state.openNoticeId === id ? null : id;
    renderNoticeList();
    return;
  }

  const noticePageButton = event.target.closest("[data-action='notice-page']");
  if (noticePageButton) {
    const nextPage = Number(noticePageButton.dataset.page || state.noticePage);
    if (nextPage !== state.noticePage) {
      state.noticePage = nextPage;
      void loadNotices();
    }
    return;
  }

  const faqButton = event.target.closest("[data-faq-toggle]");
  if (faqButton) {
    const id = Number(faqButton.dataset.faqToggle || 0);
    state.openFaqId = state.openFaqId === id ? null : id;
    renderFaqList();
    return;
  }

  const qnaToggleButton = event.target.closest("[data-qna-toggle]");
  if (qnaToggleButton) {
    const id = Number(qnaToggleButton.dataset.qnaToggle || 0);
    state.openQnaId = state.openQnaId === id ? null : id;
    renderInquiries();
    return;
  }

  const qnaPageButton = event.target.closest("[data-action='qna-page']");
  if (qnaPageButton) {
    const nextPage = Number(qnaPageButton.dataset.page || state.qnaPage);
    if (nextPage !== state.qnaPage) {
      state.qnaPage = nextPage;
      void loadInquiries();
    }
  }
});

(async function init() {
  const tabParam = new URL(location.href).searchParams.get("tab");
  if (tabParam && SECTION_META[tabParam]) {
    state.activeTab = tabParam;
  }

  state.user = (await syncCurrentUser()) || getUser();
  renderTabState();
  await syncHeader();
  syncInquiryWriteButtonState();

  if (state.activeTab === "notice") await loadNotices();
  if (state.activeTab === "faq") await loadFaqs();
  if (state.activeTab === "qna") await loadInquiries();
})();

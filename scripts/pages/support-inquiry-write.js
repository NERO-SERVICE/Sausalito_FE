import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { mountSiteFooter } from "../components/footer.js";
import { createMyInquiry } from "../services/api.js";
import { getUser, syncCurrentUser } from "../services/auth-service.js";
import { cartCount } from "../services/cart-service.js";

const headerRefs = mountSiteHeader({ showCart: true, currentNav: "support" });
mountSiteFooter();

const state = {
  user: null,
};

const el = {
  form: document.getElementById("supportWriteForm"),
  category: document.getElementById("supportWriteCategory"),
  title: document.getElementById("supportWriteTitle"),
  content: document.getElementById("supportWriteContent"),
  submit: document.getElementById("supportWriteSubmit"),
};

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

el.form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = el.title.value.trim();
  const content = el.content.value.trim();
  const category = el.category.value;

  if (title.length < 2 || content.length < 5) {
    alert("문의 제목 2자 이상, 내용 5자 이상 입력해 주세요.");
    return;
  }

  el.submit.disabled = true;
  try {
    await createMyInquiry({ title, content, category });
    alert("문의가 등록되었습니다.");
    location.href = "/pages/support.html?tab=qna";
  } catch (error) {
    console.error(error);
    alert(error.message || "문의 등록에 실패했습니다.");
  } finally {
    el.submit.disabled = false;
  }
});

(async function init() {
  state.user = (await syncCurrentUser()) || getUser();
  if (!state.user) {
    alert("문의 등록은 로그인 후 이용할 수 있습니다.");
    location.href = "/pages/login.html?redirect=/pages/support-inquiry-write.html";
    return;
  }

  await syncHeader();
})();

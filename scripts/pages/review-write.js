import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { mountSiteFooter } from "../components/footer.js";
import { getUser, syncCurrentUser } from "../services/auth-service.js";
import { cartCount } from "../services/cart-service.js";
import { createReview, fetchProducts } from "../services/api.js";

const headerRefs = mountSiteHeader({ showCart: true, currentNav: "review" });
mountSiteFooter();

const form = document.getElementById("reviewWriteForm");
const productSelect = document.getElementById("reviewProductSelect");
const imageInput = document.getElementById("reviewImagesInput");
const preview = document.getElementById("reviewImagePreview");
const presetProductId = Number(new URLSearchParams(location.search).get("productId"));

async function syncHeader() {
  const user = (await syncCurrentUser()) || getUser();
  let count = 0;
  try {
    count = await cartCount();
  } catch {
    count = 0;
  }

  syncSiteHeader(headerRefs, {
    userName: user?.name || null,
    cartCountValue: count,
  });
}

function renderPreview(files) {
  preview.innerHTML = files
    .map((file) => {
      const src = URL.createObjectURL(file);
      return `<img src="${src}" alt="리뷰 이미지 미리보기" />`;
    })
    .join("");
}

imageInput.addEventListener("change", () => {
  const files = [...imageInput.files].slice(0, 3);
  if (imageInput.files.length > 3) {
    alert("이미지는 최대 3장까지 첨부할 수 있습니다.");
  }

  const dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));
  imageInput.files = dataTransfer.files;
  renderPreview(files);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const user = getUser();
  if (!user) {
    alert("리뷰 작성은 로그인 후 가능합니다.");
    location.href = "/pages/login.html";
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());
  const files = [...imageInput.files].slice(0, 3);

  try {
    await createReview({
      productId: Number(data.productId),
      score: Number(data.score),
      title: data.title,
      content: data.content,
      images: files,
    });

    alert("리뷰가 등록되었습니다.");
    location.href = "/pages/reviews.html";
  } catch (error) {
    console.error(error);
    if (error.status === 401) {
      alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
      location.href = "/pages/login.html";
      return;
    }
    alert(error.message || "리뷰 등록에 실패했습니다.");
  }
});

(async function init() {
  try {
    const user = (await syncCurrentUser()) || getUser();
    if (!user) {
      alert("리뷰 작성은 로그인 후 가능합니다.");
      location.href = "/pages/login.html";
      return;
    }

    const products = await fetchProducts();
    productSelect.innerHTML = products
      .map(
        (product) =>
          `<option value="${product.id}" ${product.id === presetProductId ? "selected" : ""}>${product.name}</option>`,
      )
      .join("");

    await syncHeader();
  } catch (error) {
    console.error(error);
    alert("리뷰 작성 페이지 초기화에 실패했습니다.");
  }
})();

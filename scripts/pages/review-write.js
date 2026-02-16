import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { mountSiteFooter } from "../components/footer.js";
import { getUser } from "../services/auth-service.js";
import { cartCount } from "../services/cart-service.js";
import { fetchProducts } from "../services/api.js";

const headerRefs = mountSiteHeader({ showCart: true, currentNav: "review" });
mountSiteFooter();

const user = getUser();
syncSiteHeader(headerRefs, {
  userName: user?.name || null,
  cartCountValue: cartCount(),
});

const form = document.getElementById("reviewWriteForm");
const productSelect = document.getElementById("reviewProductSelect");
const imageInput = document.getElementById("reviewImagesInput");
const preview = document.getElementById("reviewImagePreview");
const presetProductId = Number(new URLSearchParams(location.search).get("productId"));

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

form.addEventListener("submit", (event) => {
  event.preventDefault();
  alert("리뷰가 등록되었습니다. (API 연동 예정)");
  location.href = "/pages/reviews.html";
});

(async function init() {
  const products = await fetchProducts();
  productSelect.innerHTML = products
    .map(
      (product) =>
        `<option value="${product.id}" ${product.id === presetProductId ? "selected" : ""}>${product.name}</option>`,
    )
    .join("");
})();

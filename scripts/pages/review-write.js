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
const imageCount = document.getElementById("reviewImageCount");
const presetProductId = Number(new URLSearchParams(location.search).get("productId"));
const MAX_IMAGE_COUNT = 3;

let selectedImages = [];
let previewUrls = [];

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

function releasePreviewUrls() {
  previewUrls.forEach((url) => URL.revokeObjectURL(url));
  previewUrls = [];
}

function updateImageCount() {
  if (!imageCount) return;
  imageCount.textContent = `${selectedImages.length}/${MAX_IMAGE_COUNT}`;
}

function syncInputFiles() {
  if (typeof DataTransfer === "undefined") return;

  const dataTransfer = new DataTransfer();
  selectedImages.forEach((file) => dataTransfer.items.add(file));
  try {
    imageInput.files = dataTransfer.files;
  } catch {
    // 일부 브라우저에서 files 할당이 제한될 수 있어 무시합니다.
  }
}

function renderPreview() {
  releasePreviewUrls();
  updateImageCount();

  if (!selectedImages.length) {
    preview.innerHTML = '<p class="review-image-empty">선택된 이미지가 없습니다.</p>';
    return;
  }

  preview.innerHTML = selectedImages
    .map((file, index) => {
      const src = URL.createObjectURL(file);
      previewUrls.push(src);
      return `
        <figure class="review-image-item">
          <img src="${src}" alt="리뷰 이미지 ${index + 1}" />
          <button type="button" class="review-image-remove" data-action="removeImage" data-index="${index}" aria-label="이미지 삭제">×</button>
        </figure>
      `;
    })
    .join("");
}

function getFileKey(file) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function addSelectedImages(files) {
  if (!files.length) return;

  const existingKeys = new Set(selectedImages.map(getFileKey));
  let duplicateCount = 0;
  let overflowCount = 0;

  files.forEach((file) => {
    const key = getFileKey(file);
    if (existingKeys.has(key)) {
      duplicateCount += 1;
      return;
    }
    if (selectedImages.length >= MAX_IMAGE_COUNT) {
      overflowCount += 1;
      return;
    }
    selectedImages.push(file);
    existingKeys.add(key);
  });

  const messages = [];
  if (overflowCount > 0) {
    messages.push(`이미지는 최대 ${MAX_IMAGE_COUNT}장까지 첨부할 수 있습니다.`);
  }
  if (duplicateCount > 0) {
    messages.push("동일한 이미지는 한 번만 첨부됩니다.");
  }
  if (messages.length) {
    alert(messages.join("\n"));
  }

  syncInputFiles();
  renderPreview();
}

imageInput.addEventListener("change", () => {
  addSelectedImages([...imageInput.files]);
  imageInput.value = "";
});

preview.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action='removeImage']");
  if (!button) return;

  const index = Number(button.dataset.index);
  if (Number.isNaN(index)) return;
  if (index < 0 || index >= selectedImages.length) return;

  selectedImages.splice(index, 1);
  syncInputFiles();
  renderPreview();
});

window.addEventListener("beforeunload", releasePreviewUrls);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const user = getUser();
  if (!user) {
    alert("리뷰 작성은 로그인 후 가능합니다.");
    location.href = "/pages/login.html";
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());
  const files = [...selectedImages];

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

    renderPreview();
    await syncHeader();
  } catch (error) {
    console.error(error);
    alert("리뷰 작성 페이지 초기화에 실패했습니다.");
  }
})();

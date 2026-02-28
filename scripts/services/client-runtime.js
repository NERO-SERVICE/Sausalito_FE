const IMAGE_SHELL_SELECTOR = [
  ".home-product-thumb",
  ".rv-best-thumb-link",
  ".pd-media-stage",
  ".pd-gallery-thumb",
  ".review-image-slot",
  ".brand-story-media",
].join(", ");

let runtimeInitialized = false;
let imageObserver = null;

function isNearViewport(imageElement) {
  const rect = imageElement.getBoundingClientRect();
  const viewportHeight = window.innerHeight || 800;
  return rect.top <= viewportHeight * 1.25;
}

function resolveImageShell(imageElement) {
  const preferred = imageElement.closest(IMAGE_SHELL_SELECTOR);
  if (preferred) return preferred;
  const parent = imageElement.parentElement;
  if (!parent) return null;
  return parent.children.length === 1 ? parent : null;
}

function markImageAsReady(imageElement, shellElement) {
  imageElement.classList.remove("is-loading");
  imageElement.classList.add("is-ready");
  if (shellElement) {
    shellElement.classList.remove("is-loading");
  }
}

function enhanceImage(imageElement) {
  if (!(imageElement instanceof HTMLImageElement)) return;
  if (imageElement.dataset.runtimeImgEnhanced === "1") return;
  imageElement.dataset.runtimeImgEnhanced = "1";
  imageElement.classList.add("smart-img", "is-loading");

  if (!imageElement.hasAttribute("decoding")) {
    imageElement.decoding = "async";
  }
  if (!imageElement.hasAttribute("loading") && !isNearViewport(imageElement)) {
    imageElement.loading = "lazy";
  }

  const shellElement = resolveImageShell(imageElement);
  if (shellElement) {
    shellElement.classList.add("img-shell", "is-loading");
  }

  const onDone = () => markImageAsReady(imageElement, shellElement);

  if (imageElement.complete) {
    onDone();
    return;
  }

  imageElement.addEventListener("load", onDone, { once: true });
  imageElement.addEventListener("error", onDone, { once: true });
}

function enhanceImagesInSubtree(rootNode) {
  if (!rootNode) return;
  if (rootNode instanceof HTMLImageElement) {
    enhanceImage(rootNode);
    return;
  }
  if (!(rootNode instanceof Element || rootNode instanceof Document)) return;
  rootNode.querySelectorAll("img").forEach((imageElement) => {
    enhanceImage(imageElement);
  });
}

function observeNewImages() {
  if (imageObserver) return;
  imageObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        enhanceImagesInSubtree(node);
      });
    });
  });
  imageObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function registerServiceWorker() {
  if (!import.meta.env.PROD) return;
  if (!("serviceWorker" in navigator)) return;

  const register = () =>
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.warn("service worker registration failed", error);
    });

  if (document.readyState === "complete") {
    register();
    return;
  }
  window.addEventListener("load", register, { once: true });
}

export function initClientRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;

  const initializeImageRuntime = () => {
    enhanceImagesInSubtree(document);
    observeNewImages();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeImageRuntime, { once: true });
  } else {
    initializeImageRuntime();
  }

  window.addEventListener("pageshow", () => {
    enhanceImagesInSubtree(document);
  });

  registerServiceWorker();
}

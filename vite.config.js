import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "build",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        home: resolve(__dirname, "pages/home.html"),
        brand: resolve(__dirname, "pages/brand.html"),
        shop: resolve(__dirname, "pages/shop.html"),
        reviews: resolve(__dirname, "pages/reviews.html"),
        privacy: resolve(__dirname, "pages/privacy.html"),
        terms: resolve(__dirname, "pages/terms.html"),
        guide: resolve(__dirname, "pages/guide.html"),
        detail: resolve(__dirname, "pages/detail.html"),
        login: resolve(__dirname, "pages/login.html"),
        cart: resolve(__dirname, "pages/cart.html"),
      },
    },
  },
});

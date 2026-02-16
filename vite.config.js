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
        detail: resolve(__dirname, "pages/detail.html"),
        login: resolve(__dirname, "pages/login.html"),
        cart: resolve(__dirname, "pages/cart.html"),
      },
    },
  },
});

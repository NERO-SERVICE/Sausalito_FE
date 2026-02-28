import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");
  const backendOrigin = (env.VITE_BACKEND_ORIGIN || "http://127.0.0.1:8000").replace(
    /\/$/,
    "",
  );

  return {
    // Keep static source assets under ./dist/assets and copy them as-is at build time.
    publicDir: "dist",
    server: {
      proxy: {
        "/api": {
          target: backendOrigin,
          changeOrigin: true,
          secure: false,
        },
        "/media": {
          target: backendOrigin,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: "build",
      emptyOutDir: true,
      sourcemap: false,
      rollupOptions: {
        input: {
          index: resolve(__dirname, "index.html"),
          home: resolve(__dirname, "pages/home.html"),
          brand: resolve(__dirname, "pages/brand.html"),
          shop: resolve(__dirname, "pages/shop.html"),
          reviews: resolve(__dirname, "pages/reviews.html"),
          reviewWrite: resolve(__dirname, "pages/review-write.html"),
          privacy: resolve(__dirname, "pages/privacy.html"),
          terms: resolve(__dirname, "pages/terms.html"),
          commerceNotice: resolve(__dirname, "pages/commerce-notice.html"),
          guide: resolve(__dirname, "pages/guide.html"),
          detail: resolve(__dirname, "pages/detail.html"),
          checkout: resolve(__dirname, "pages/checkout.html"),
          login: resolve(__dirname, "pages/login.html"),
          signup: resolve(__dirname, "pages/signup.html"),
          kakaoCallback: resolve(__dirname, "pages/kakao-callback.html"),
          cart: resolve(__dirname, "pages/cart.html"),
          mypage: resolve(__dirname, "pages/mypage.html"),
          memberEdit: resolve(__dirname, "pages/member-edit.html"),
          changePassword: resolve(__dirname, "pages/change-password.html"),
        },
      },
    },
  };
});

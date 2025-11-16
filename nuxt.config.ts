import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  build: {
    transpile: ["@headlessui/vue"],
  },
  css: ["~/assets/css/app.css"],
  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
      autoprefixer: {},
    },
  },
});

import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import autoprefixer from "autoprefixer";

export default defineConfig({
  base: "https://abderrahmanebouzemlal.github.io/fylo-landing-page/",
  plugins: [tailwindcss()],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
});

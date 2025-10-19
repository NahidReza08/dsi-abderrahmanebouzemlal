import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import autoprefixer from "autoprefixer";

export default defineConfig({
  base: "https://abderrahmanebouzemlal.github.io/testimonials-grid-section-main/",
  plugins: [tailwindcss()],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
});

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // adjust if you're using React/Vue/Svelte etc.
  ],
  theme: {
    extend: {
      colors: {
        blue: { 950: "hsl(233, 26%, 24%)" },
        green: { 500: "hsl(136, 64%, 51%)" },
        cyan: { 400: "hsl(192, 69%, 51%)" },
        gray: {
          600: "hsl(233, 8%, 62%)",
          100: "hsl(220, 16%, 96%)",
          50: "hsl(0, 0%, 98%)",
        },
        white: "hsl(0, 100%, 100%)",
      },
      fontFamily: {
        sans: ["Public Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        base: "18px",
      },
      fontWeight: {
        light: "300",
        normal: "400",
        bold: "700",
      },
      backgroundImage: {},
    },
  },
  plugins: [],
};

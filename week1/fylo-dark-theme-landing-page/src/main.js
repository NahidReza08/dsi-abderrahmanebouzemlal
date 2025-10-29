import "./style.css";

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("theme-toggle");
  const html = document.documentElement;

  if (!toggle) {
    console.error("Theme toggle element not found!");
    return;
  }

  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  let initialTheme;
  if (savedTheme) {
    initialTheme = savedTheme;
  } else {
    // First visit - you can choose to default to light or respect system
    initialTheme = "light"; // Force light, or use systemPrefersDark ? 'dark' : 'light'
  }

  // Apply initial theme
  if (initialTheme === "dark") {
    html.classList.add("dark");
    toggle.checked = true;
  } else {
    html.classList.remove("dark");
    toggle.checked = false;
  }

  // Save the initial choice
  localStorage.setItem("theme", initialTheme);

  // Listen for toggle changes
  toggle.addEventListener("change", function () {
    if (this.checked) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  });
});

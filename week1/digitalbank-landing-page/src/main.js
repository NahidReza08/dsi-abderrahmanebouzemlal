import "./index.css";

const menuToggle = document.getElementById("menu-toggle");
const body = document.body;

menuToggle.addEventListener("change", function () {
  if (this.checked) {
    body.style.overflow = "hidden"; // Prevent scrolling
  } else {
    body.style.overflow = "auto"; // Allow scrolling
  }
});

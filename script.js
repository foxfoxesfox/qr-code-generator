const qrForm = document.getElementById("qrForm");
const urlInput = document.getElementById("urlInput");
const sizeInput = document.getElementById("sizeInput");
const marginInput = document.getElementById("marginInput");
const darkColorInput = document.getElementById("darkColor");
const lightColorInput = document.getElementById("lightColor");
const labelInput = document.getElementById("labelInput");
const filenameInput = document.getElementById("filenameInput");
const presetInput = document.getElementById("presetInput");
const downloadBtn = document.getElementById("downloadBtn");
const printBtn = document.getElementById("printBtn");
const resetBtn = document.getElementById("resetBtn");
const qrContainer = document.getElementById("qrcode");
const qrStage = document.getElementById("qrStage");
const previewUrl = document.getElementById("previewUrl");
const captionPreview = document.getElementById("captionPreview");
const themeToggle = document.querySelector("[data-theme-toggle]");

const presets = {
  custom: null,
  classic: { dark: "#000000", light: "#ffffff" },
  teal: { dark: "#0f766e", light: "#ecfeff" },
  poster: { dark: "#111827", light: "#fde68a" },
  night: { dark: "#f9fafb", light: "#111827" }
};

let currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";

document.documentElement.setAttribute("data-theme", currentTheme);
updateThemeButton();

function updateThemeButton() {
  themeToggle.setAttribute(
    "aria-label",
    currentTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
  themeToggle.querySelector(".theme-icon").textContent =
    currentTheme === "dark" ? "☀" : "◐";
}

function applyPreset(name) {
  const preset = presets[name];
  if (!preset) return;
  darkColorInput.value = preset.dark;
  lightColorInput.value = preset.light;
}

function safeFilename(value) {
  const cleaned = value
    .trim()
    .replace(/[^a-z0-9-_]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return cleaned || "qrforge-code";
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function clearQR() {
  qrContainer.innerHTML = "";
}

function generateQR(event) {
  if (event) event.preventDefault();

  const link = urlInput.value.trim();
  const size = Number(sizeInput.value);
  const margin = Number(marginInput.value);
  const dark = darkColorInput.value;
  const light = lightColorInput.value;
  const caption = labelInput.value.trim();

  if (!isValidUrl(link)) {
    alert("Please enter a valid link starting with http:// or https://");
    urlInput.focus();
    return;
  }

  clearQR();
  qrStage.style.padding = `${margin}px`;
  qrStage.style.backgroundColor = light;

  new QRCode(qrContainer, {
    text: link,
    width: size,
    height: size,
    colorDark: dark,
    colorLight: light,
    correctLevel: QRCode.CorrectLevel.H
  });

  previewUrl.textContent = link;
  captionPreview.textContent = caption || "No caption added";
}

function downloadQR() {
  const canvas = qrContainer.querySelector("canvas");
  const image = qrContainer.querySelector("img");

  if (!canvas && !image) {
    alert("Generate a QR code first.");
    return;
  }

  const link = document.createElement("a");
  link.download = `${safeFilename(filenameInput.value)}.png`;
  link.href = canvas ? canvas.toDataURL("image/png") : image.src;
  link.click();
}

function resetForm() {
  qrForm.reset();
  darkColorInput.value = "#111827";
  lightColorInput.value = "#ffffff";
  sizeInput.value = "256";
  marginInput.value = "16";
  presetInput.value = "custom";
  filenameInput.value = "qrforge-code";
  clearQR();
  previewUrl.textContent = "Your link will appear here";
  captionPreview.textContent = "No caption added";
  qrStage.style.padding = "16px";
  qrStage.style.backgroundColor = "#f9fafb";
}

presetInput.addEventListener("change", (event) => {
  if (event.target.value !== "custom") {
    applyPreset(event.target.value);
  }
});

qrForm.addEventListener("submit", generateQR);
downloadBtn.addEventListener("click", downloadQR);
printBtn.addEventListener("click", () => window.print());
resetBtn.addEventListener("click", resetForm);

themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeButton();
});

urlInput.value = "https://example.com";
generateQR();

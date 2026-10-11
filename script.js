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
const captionPreview = document.getElementById("captionPreview");
const themeToggle = document.querySelector("[data-theme-toggle]");
const printMount = document.getElementById("printMount");

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
  syncPreviewStyles();
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

function syncPreviewStyles() {
  const padding = Number(marginInput.value);
  const dark = darkColorInput.value;
  const light = lightColorInput.value;

  qrStage.style.padding = `${padding}px`;
  qrStage.style.backgroundColor = light;
  captionPreview.style.color = dark;
}

function waitForRenderedQR() {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 40;

    const check = () => {
      const canvas = qrContainer.querySelector("canvas");
      const image = qrContainer.querySelector("img");

      if (canvas) {
        resolve({ type: "canvas", element: canvas });
        return;
      }

      if (image && image.complete && image.naturalWidth > 0) {
        resolve({ type: "img", element: image });
        return;
      }

      attempts += 1;
      if (attempts >= maxAttempts) {
        reject(new Error("QR render timeout"));
        return;
      }

      setTimeout(check, 80);
    };

    check();
  });
}

async function buildExportCanvas() {
  const rendered = await waitForRenderedQR();

  const qrSize = Number(sizeInput.value);
  const padding = Number(marginInput.value);
  const caption = labelInput.value.trim();
  const backgroundColor = lightColorInput.value;
  const textColor = darkColorInput.value;

  const outerPadding = 32;
  const captionGap = caption ? 20 : 0;
  const captionFontSize = caption ? Math.max(22, Math.round(qrSize * 0.11)) : 0;
  const captionHeight = caption ? Math.round(captionFontSize * 1.5) : 0;

  const exportWidth = qrSize + padding * 2 + outerPadding * 2;
  const exportHeight =
    qrSize + padding * 2 + outerPadding * 2 + captionGap + captionHeight;

  const canvas = document.createElement("canvas");
  canvas.width = exportWidth;
  canvas.height = exportHeight;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, exportWidth, exportHeight);

  const qrX = outerPadding + padding;
  const qrY = outerPadding + padding;

  ctx.drawImage(rendered.element, qrX, qrY, qrSize, qrSize);

  if (caption) {
    ctx.fillStyle = textColor;
    ctx.font = `600 ${captionFontSize}px Inter, Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(caption, exportWidth / 2, qrY + qrSize + padding + captionGap);
  }

  return canvas;
}

async function refreshPrintMount() {
  try {
    const exportCanvas = await buildExportCanvas();
    printMount.innerHTML = "";

    const img = document.createElement("img");
    img.src = exportCanvas.toDataURL("image/png");
    img.alt = "Printable QR export";
    printMount.appendChild(img);
  } catch (error) {
    console.error(error);
  }
}

async function generateQR(event) {
  if (event) event.preventDefault();

  const link = urlInput.value.trim();
  const size = Number(sizeInput.value);
  const dark = darkColorInput.value;
  const light = lightColorInput.value;
  const caption = labelInput.value.trim();

  if (!isValidUrl(link)) {
    alert("Please enter a valid link starting with http:// or https://");
    urlInput.focus();
    return;
  }

  clearQR();
  syncPreviewStyles();

  new QRCode(qrContainer, {
    text: link,
    width: size,
    height: size,
    colorDark: dark,
    colorLight: light,
    correctLevel: QRCode.CorrectLevel.H
  });

  captionPreview.textContent = caption || "No caption added";
  captionPreview.style.color = dark;

  try {
    await refreshPrintMount();
  } catch (error) {
    console.error(error);
  }
}

async function downloadQR() {
  try {
    const exportCanvas = await buildExportCanvas();
    const link = document.createElement("a");
    link.download = `${safeFilename(filenameInput.value)}.png`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  } catch (error) {
    console.error(error);
    alert("Generate a QR code first.");
  }
}

async function printQR() {
  try {
    await refreshPrintMount();
    window.print();
  } catch (error) {
    console.error(error);
    alert("Generate a QR code first.");
  }
}

function resetForm() {
  qrForm.reset();
  darkColorInput.value = "#111827";
  lightColorInput.value = "#ffffff";
  sizeInput.value = "256";
  marginInput.value = "28";
  presetInput.value = "custom";
  filenameInput.value = "qrforge-code";
  clearQR();
  captionPreview.textContent = "No caption added";
  syncPreviewStyles();
  printMount.innerHTML = "";
}

presetInput.addEventListener("change", (event) => {
  if (event.target.value !== "custom") {
    applyPreset(event.target.value);
  }
});

marginInput.addEventListener("change", syncPreviewStyles);
darkColorInput.addEventListener("input", syncPreviewStyles);
lightColorInput.addEventListener("input", syncPreviewStyles);

labelInput.addEventListener("input", () => {
  captionPreview.textContent = labelInput.value.trim() || "No caption added";
  captionPreview.style.color = darkColorInput.value;
});

qrForm.addEventListener("submit", generateQR);
downloadBtn.addEventListener("click", downloadQR);
printBtn.addEventListener("click", printQR);
resetBtn.addEventListener("click", resetForm);

themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeButton();
});

urlInput.value = "https://example.com";
syncPreviewStyles();
generateQR();

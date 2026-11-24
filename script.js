const RNG_MIN = 0;
const RNG_MAX = 100;
const DEFAULT_INTERVAL_SECONDS = 5;

const rngValue = document.querySelector("#rng-value");
const rngInterval = document.querySelector("#rng-interval");
const rngRefresh = document.querySelector("#rng-refresh");
const themeToggle = document.querySelector("#theme-toggle");
const rangesGrid = document.querySelector("#ranges-grid");
const rangeTemplate = document.querySelector("#range-template");
const status = document.querySelector("#status");

let rngTimer;

function generateRandomNumber() {
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  rngValue.value = String(
    RNG_MIN + Math.floor((value[0] / 2 ** 32) * (RNG_MAX - RNG_MIN + 1)),
  );
}

function getIntervalMilliseconds() {
  const seconds = Number(rngInterval.value);
  if (!Number.isFinite(seconds) || seconds < Number(rngInterval.min)) {
    return DEFAULT_INTERVAL_SECONDS * 1000;
  }

  return Math.min(seconds, Number(rngInterval.max)) * 1000;
}

function scheduleRng() {
  window.clearInterval(rngTimer);
  rngTimer = window.setInterval(generateRandomNumber, getIntervalMilliseconds());
}

function updateThemeButton() {
  const isDark = document.documentElement.dataset.theme === "dark";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Cambiar a modo día" : "Cambiar a modo noche",
  );
}

function toggleTheme() {
  const isDark = document.documentElement.dataset.theme === "dark";
  const nextTheme = isDark ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem("theme", nextTheme);
  updateThemeButton();
}

function setSavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    document.documentElement.dataset.theme = savedTheme;
  }
  updateThemeButton();
}

function createRangeCard(range) {
  const card = rangeTemplate.content.cloneNode(true);
  const article = card.querySelector("article");
  const image = card.querySelector("img");

  card.querySelector("h3").textContent = range.title;
  if (typeof range.blockStyle === "string" && range.blockStyle.trim() !== "") {
    article.classList.add(`range-card--${range.blockStyle.trim()}`);
  }
  image.src = range.src;
  image.alt = range.alt || `Visualización del rango ${range.title}`;
  return card;
}

async function loadRanges() {
  try {
    const response = await fetch("assets/ranges.json");
    if (!response.ok) {
      throw new Error(`No se pudo cargar el manifiesto (${response.status}).`);
    }

    const manifest = await response.json();
    if (!Array.isArray(manifest.ranges)) {
      throw new Error('El manifiesto debe incluir una lista "ranges".');
    }

    for (const range of manifest.ranges) {
      if (
        typeof range.title !== "string" ||
        typeof range.src !== "string" ||
        range.title.trim() === "" ||
        range.src.trim() === ""
      ) {
        throw new Error('Cada rango debe incluir "title" y "src".');
      }
      rangesGrid.append(createRangeCard(range));
    }

    status.hidden = true;
    if (manifest.ranges.length === 0) {
      status.hidden = false;
      status.textContent = "Aún no hay rangos configurados en assets/ranges.json.";
    }
  } catch (error) {
    status.hidden = false;
    status.classList.add("error");
    status.textContent = error instanceof Error
      ? error.message
      : "No se pudieron cargar los rangos.";
  }
}

rngRefresh.addEventListener("click", generateRandomNumber);
rngInterval.addEventListener("change", scheduleRng);
rngInterval.addEventListener("input", () => {
  if (rngInterval.validity.valid) {
    scheduleRng();
  }
});
themeToggle.addEventListener("click", toggleTheme);

setSavedTheme();
generateRandomNumber();
scheduleRng();
loadRanges();

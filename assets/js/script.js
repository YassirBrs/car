'use strict';

/**
 * navbar toggle
 */

const DEFAULT_LANGUAGE = "en";
const SUPPORTED_LANGUAGES = ["en", "fr"];

const overlay = document.querySelector("[data-overlay]");
const navbar = document.querySelector("[data-navbar]");
const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const featuredCarList = document.querySelector("[data-featured-car-list]");
const heroForm = document.querySelector(".hero-form");
const rentalRequestForm = document.querySelector("[data-rental-request-form]");
const languageButtons = document.querySelectorAll("[data-lang-switch]");
const whatsappWidget = document.querySelector("[data-whatsapp-widget]");
const whatsappWidgetPanel = document.querySelector("[data-whatsapp-widget-panel]");
const whatsappWidgetToggle = document.querySelector("[data-whatsapp-widget-toggle]");
const whatsappWidgetClose = document.querySelector("[data-whatsapp-widget-close]");
const metaDescription = document.querySelector('meta[name="description"]');
const metaKeywords = document.querySelector('meta[name="keywords"]');
const metaThemeColor = document.querySelector('meta[name="theme-color"]');
const ogTitle = document.querySelector('meta[property="og:title"]');
const ogDescription = document.querySelector('meta[property="og:description"]');
const twitterTitle = document.querySelector('meta[property="twitter:title"]');
const twitterDescription = document.querySelector('meta[property="twitter:description"]');
const initialDomTexts = {};

document.querySelectorAll("[data-i18n]").forEach(function (node) {
  const key = node.getAttribute("data-i18n");

  if (key) {
    initialDomTexts[key] = node.textContent;
  }
});

const initialTitle = document.title;
const initialMetaDescription = metaDescription ? metaDescription.getAttribute("content") || "" : "";
const initialMetaKeywords = metaKeywords ? metaKeywords.getAttribute("content") || "" : "";
const initialOgDescription = ogDescription ? ogDescription.getAttribute("content") || "" : "";
const initialTwitterDescription = twitterDescription ? twitterDescription.getAttribute("content") || "" : "";

const searchInputs = {
  brand: document.querySelector("#input-1"),
  model: document.querySelector("#input-2"),
  rentalFrom: document.querySelector("#input-3"),
  rentalTo: document.querySelector("#input-4"),
};

const requestInputs = {
  fullName: document.querySelector("#request-1"),
  phone: document.querySelector("#request-2"),
  email: document.querySelector("#request-3"),
  startDate: document.querySelector("#request-4"),
  endDate: document.querySelector("#request-5"),
  pickupLocation: document.querySelector("#request-6"),
  brand: document.querySelector("#request-7"),
  model: document.querySelector("#request-8"),
  message: document.querySelector("#request-9"),
};

const whatsappNumber = "212655867044";

let allCars = [];
let filterTimer = null;
let translations = {};
let currentLanguage = getInitialLanguage();

const fallbackEnglishTranslations = {
  ...initialDomTexts,
  page_title: initialTitle,
  meta_description: initialMetaDescription,
  meta_keywords: initialMetaKeywords,
  og_description: initialOgDescription,
  twitter_description: initialTwitterDescription,
  all_brands: "All brands",
  all_models: "All models",
  select_brand_first: "Select a brand first",
  price_on_request: "Price on request",
  fuel_unavailable: "Fuel unavailable",
  transmission_unavailable: "Transmission unavailable",
  featured_vehicle: "Featured vehicle",
  car_seats_suffix: "seats",
  seats_unavailable: "seats unavailable",
  rent_now: "Rent now",
  no_cars_match: "No cars match your search.",
  unable_load_cars: "Unable to load cars right now.",
  whatsapp_hello: "Hello, I’m interested in {title}.",
  whatsapp_year: "Year: {year}.",
  whatsapp_price: "Price: {price}.",
  whatsapp_seats: "Seats: {seats}.",
  whatsapp_rental_period: "Rental period: {range}.",
  whatsapp_period_not_selected: "Rental period: not selected.",
  whatsapp_please_share: "Please share availability and booking details.",
  whatsapp_popup_title: "Need help choosing a car?",
  whatsapp_popup_text: "Chat with us on WhatsApp for fast availability, pricing, and delivery details.",
  whatsapp_popup_button: "Chat on WhatsApp",
  open_whatsapp_chat: "Open WhatsApp chat",
  close_whatsapp_chat: "Close WhatsApp chat",
  rent_now_aria: "Rent {title} on WhatsApp",
  rental_range_from_to: "{from} to {to}",
  rental_range_from_onward: "{date} onward",
  rental_range_until: "until {date}",
  request_kicker: "Rental Request",
  request_title: "Reach out and let us know if there is anything we can do for you.",
  request_text: "Tell us your travel dates, preferred car, and pickup point. We’ll reply on WhatsApp with availability and pricing.",
  request_point1: "Fast WhatsApp reply",
  request_point2: "Airport or city pickup",
  request_point3: "Delivery across Agadir and the coast",
  request_form_title: "Send your request",
  request_full_name: "Full name",
  request_phone: "Phone number",
  request_email: "Email address",
  request_start_date: "Potential Start Date *",
  request_end_date: "Potential End Date",
  request_pickup_location: "Pickup location",
  request_brand: "Car brand",
  request_model: "Car model",
  request_message: "Additional message",
  request_submit: "Send request on WhatsApp",
  request_privacy_notice: "You may receive marketing and promotional materials. Contact the merchant for their privacy practices.",
  request_recaptcha_notice: "This form is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.",
  request_whatsapp_title: "Rental Request",
  request_whatsapp_intro: "Reach out and let us know if there is anything we can do for you.",
  not_provided: "Not provided",
};

const navToggleFunc = function () {
  if (!navToggleBtn || !navbar || !overlay) {
    return;
  }

  navToggleBtn.classList.toggle("active");
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
};

if (navToggleBtn) {
  navToggleBtn.addEventListener("click", navToggleFunc);
}

if (overlay) {
  overlay.addEventListener("click", navToggleFunc);
}

for (let i = 0; i < navbarLinks.length; i++) {
  navbarLinks[i].addEventListener("click", navToggleFunc);
}

/**
 * header active on scroll
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  if (!header) {
    return;
  }

  window.scrollY >= 10 ? header.classList.add("active") : header.classList.remove("active");
});

/**
 * language and translation helpers
 */

function getInitialLanguage() {
  let storedLanguage = null;

  try {
    storedLanguage = window.localStorage.getItem("ridex-language");
  } catch (error) {
    storedLanguage = null;
  }

  if (SUPPORTED_LANGUAGES.includes(storedLanguage)) {
    return storedLanguage;
  }

  const browserLanguage = (window.navigator.language || "").toLowerCase();

  return browserLanguage.startsWith("fr") ? "fr" : DEFAULT_LANGUAGE;
}

function formatTemplate(template, values) {
  return String(template || "").replace(/\{(\w+)\}/g, function (_, key) {
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      return values[key];
    }

    return `{${key}}`;
  });
}

function getTranslation(key, values = {}) {
  const currentTable = translations[currentLanguage] || {};
  const fallbackTable = translations[DEFAULT_LANGUAGE] || {};
  const rawValue = currentTable[key] ?? fallbackTable[key] ?? key;

  return formatTemplate(rawValue, values);
}

function updateLanguageButtons() {
  languageButtons.forEach(function (button) {
    const isActive = button.dataset.langSwitch === currentLanguage;

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function populateBrandOptions(cars, targetSelect = searchInputs.brand) {
  if (!targetSelect) {
    return;
  }

  const selectedBrand = targetSelect.value;
  const brands = getUniqueSortedValues(
    cars.map(function (car) {
      return car.brand;
    })
  );

  targetSelect.innerHTML = [
    createOptionMarkup("", getTranslation("all_brands")),
    brands
      .map(function (brand) {
        return createOptionMarkup(brand, brand);
      })
      .join(""),
  ].join("");

  targetSelect.value = selectedBrand;
}

function populateModelOptions(cars, selectedBrand, targetSelect = searchInputs.model) {
  if (!targetSelect) {
    return;
  }

  const normalizedBrand = normalizeText(selectedBrand);
  const currentValue = targetSelect.value;
  const filteredCars = normalizedBrand
    ? cars.filter(function (car) {
        return normalizeText(car.brand) === normalizedBrand;
      })
    : [];
  const models = getUniqueSortedValues(
    filteredCars.map(function (car) {
      return car.model;
    })
  );

  targetSelect.innerHTML = [
    createOptionMarkup("", normalizedBrand ? getTranslation("all_models") : getTranslation("select_brand_first")),
    models
      .map(function (model) {
        return createOptionMarkup(model, model);
      })
      .join(""),
  ].join("");

  targetSelect.disabled = !normalizedBrand;

  if (
    normalizedBrand &&
    models.some(function (model) {
      return normalizeText(model) === normalizeText(currentValue);
    })
  ) {
    targetSelect.value = currentValue;
  } else {
    targetSelect.value = "";
  }
}

function applyStaticTranslations() {
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = "ltr";

  if (document.title) {
    document.title = getTranslation("page_title");
  }

  if (metaDescription) {
    metaDescription.setAttribute("content", getTranslation("meta_description"));
  }

  if (metaKeywords) {
    metaKeywords.setAttribute("content", getTranslation("meta_keywords"));
  }

  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", "#2c7be5");
  }

  if (ogTitle) {
    ogTitle.setAttribute("content", getTranslation("page_title"));
  }

  if (ogDescription) {
    ogDescription.setAttribute("content", getTranslation("og_description"));
  }

  if (twitterTitle) {
    twitterTitle.setAttribute("content", getTranslation("page_title"));
  }

  if (twitterDescription) {
    twitterDescription.setAttribute("content", getTranslation("twitter_description"));
  }

  if (whatsappWidgetToggle) {
    whatsappWidgetToggle.setAttribute("aria-label", getTranslation("open_whatsapp_chat"));
  }

  if (whatsappWidgetClose) {
    whatsappWidgetClose.setAttribute("aria-label", getTranslation("close_whatsapp_chat"));
  }

  document.querySelectorAll("[data-i18n]").forEach(function (node) {
    const key = node.getAttribute("data-i18n");

    if (key) {
      node.textContent = getTranslation(key);
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(function (node) {
    const key = node.getAttribute("data-i18n-placeholder");

    if (key) {
      node.setAttribute("placeholder", getTranslation(key));
    }
  });

  updateLanguageButtons();
}

function setLanguage(language) {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    return;
  }

  currentLanguage = language;

  try {
    window.localStorage.setItem("ridex-language", language);
  } catch (error) {
    // Ignore storage failures and keep the current session language active.
  }

  applyStaticTranslations();

  if (allCars.length) {
    populateBrandOptions(allCars);
    populateModelOptions(allCars, searchInputs.brand ? searchInputs.brand.value : "");
    populateBrandOptions(allCars, requestInputs.brand);
    populateModelOptions(allCars, requestInputs.brand ? requestInputs.brand.value : "", requestInputs.model);
    applyFilters(false);
  }
}

/**
 * featured cars from JSON
 */

const escapeHtml = function (value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const normalizeText = function (value) {
  return String(value || "").trim().toLowerCase();
};

const renderSpecItem = function (iconName, text) {
  return `
    <li class="card-list-item">
      <ion-icon name="${iconName}"></ion-icon>
      <span class="card-item-text">${escapeHtml(text)}</span>
    </li>
  `;
};

const getUniqueSortedValues = function (items) {
  return Array.from(new Set(items.filter(Boolean))).sort(function (a, b) {
    return a.localeCompare(b);
  });
};

const createOptionMarkup = function (value, label) {
  return `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;
};

const formatPrice = function (car) {
  if (car.price_mad !== undefined && car.price_mad !== null) {
    return {
      primary: `${car.price_mad} MAD`,
      secondary: car.price_eur !== undefined && car.price_eur !== null ? `${car.price_eur} EUR` : "",
    };
  }

  if (car.price_eur !== undefined && car.price_eur !== null) {
    return {
      primary: `${car.price_eur} EUR`,
      secondary: "",
    };
  }

  return {
    primary: getTranslation("price_on_request"),
    secondary: "",
  };
};

const formatRentalDate = function (value) {
  if (!value) {
    return "";
  }

  const parsedDate = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  const locale = currentLanguage === "fr" ? "fr-FR" : "en-US";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsedDate);
};

const formatRentalRange = function () {
  const rentalFrom = formatRentalDate(searchInputs.rentalFrom ? searchInputs.rentalFrom.value : "");
  const rentalTo = formatRentalDate(searchInputs.rentalTo ? searchInputs.rentalTo.value : "");

  if (rentalFrom && rentalTo) {
    return getTranslation("rental_range_from_to", { from: rentalFrom, to: rentalTo });
  }

  if (rentalFrom) {
    return getTranslation("rental_range_from_onward", { date: rentalFrom });
  }

  if (rentalTo) {
    return getTranslation("rental_range_until", { date: rentalTo });
  }

  return "";
};

const buildWhatsappLink = function (car) {
  const title = car.name || [car.brand, car.model].filter(Boolean).join(" ") || "this car";
  const year = car.year || "N/A";
  const price = formatPrice(car).primary;
  const seats =
    car.seats !== undefined && car.seats !== null
      ? `${car.seats} ${getTranslation("car_seats_suffix")}`
      : getTranslation("seats_unavailable");
  const rentalRange = formatRentalRange();
  const message = [
    getTranslation("whatsapp_hello", { title }),
    "",
    `• ${getTranslation("whatsapp_year", { year })}`,
    `• ${getTranslation("whatsapp_price", { price })}`,
    `• ${getTranslation("whatsapp_seats", { seats })}`,
    `• ${rentalRange ? getTranslation("whatsapp_rental_period", { range: rentalRange }) : getTranslation("whatsapp_period_not_selected")}`,
    "",
    getTranslation("whatsapp_please_share"),
  ].join("\n");

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};

const formatRequestValue = function (value) {
  const cleanedValue = String(value || "").trim();

  return cleanedValue || getTranslation("not_provided");
};

const buildRequestWhatsappLink = function () {
  const startDate = requestInputs.startDate ? formatRentalDate(requestInputs.startDate.value) : "";
  const endDate = requestInputs.endDate ? formatRentalDate(requestInputs.endDate.value) : "";
  const rentalPeriod = startDate && endDate
    ? getTranslation("rental_range_from_to", { from: startDate, to: endDate })
    : startDate
      ? getTranslation("rental_range_from_onward", { date: startDate })
        : endDate
        ? getTranslation("rental_range_until", { date: endDate })
        : getTranslation("not_provided");

  const message = [
    getTranslation("request_whatsapp_title"),
    getTranslation("request_whatsapp_intro"),
    "",
    "----",
    `${getTranslation("request_full_name")}: ${formatRequestValue(requestInputs.fullName ? requestInputs.fullName.value : "")}`,
    `${getTranslation("request_phone")}: ${formatRequestValue(requestInputs.phone ? requestInputs.phone.value : "")}`,
    `${getTranslation("request_email")}: ${formatRequestValue(requestInputs.email ? requestInputs.email.value : "")}`,
    `${getTranslation("request_pickup_location")}: ${formatRequestValue(requestInputs.pickupLocation ? requestInputs.pickupLocation.value : "")}`,
    `${getTranslation("request_brand")}: ${formatRequestValue(requestInputs.brand ? requestInputs.brand.value : "")}`,
    `${getTranslation("request_model")}: ${formatRequestValue(requestInputs.model ? requestInputs.model.value : "")}`,
    `${getTranslation("request_rental_dates")}: ${formatRequestValue(rentalPeriod)}`,
    `${getTranslation("request_message")}: ${formatRequestValue(requestInputs.message ? requestInputs.message.value : "")}`,
    "----",
    getTranslation("whatsapp_please_share"),
  ].join("\n");

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};

const renderCarCard = function (car) {
  const title = car.name || [car.brand, car.model].filter(Boolean).join(" ");
  const specs = [
    car.seats !== undefined && car.seats !== null
      ? `${car.seats} ${getTranslation("car_seats_suffix")}`
      : getTranslation("seats_unavailable"),
    car.fuel || getTranslation("fuel_unavailable"),
    car.transmission || getTranslation("transmission_unavailable"),
    Array.isArray(car.features) && car.features.length ? car.features[0] : getTranslation("featured_vehicle"),
  ];
  const features = Array.isArray(car.features) ? car.features.slice(0, 3) : [];
  const price = formatPrice(car);
  const imageUrl = car.image_url || "";
  const rentNowLabel = getTranslation("rent_now");

  return `
    <li>
      <div class="featured-car-card">
        <figure class="card-banner car-banner ${imageUrl ? "has-image" : "has-placeholder"}">
          ${
            imageUrl
              ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(title)}" loading="lazy" width="440" height="300" class="w-100">`
              : `<span class="car-placeholder" aria-hidden="true">${escapeHtml(car.image || "🚗")}</span>`
          }
        </figure>

        <div class="card-content">
          <div class="card-title-wrapper">
            <h3 class="h3 card-title">
              <a href="#">${escapeHtml(title)}</a>
            </h3>

            <data class="year" value="${escapeHtml(car.year || car.id)}">${escapeHtml(car.brand || "Car")}</data>
          </div>

          <ul class="card-list">
            ${renderSpecItem("people-outline", specs[0])}
            ${renderSpecItem("flash-outline", specs[1])}
            ${renderSpecItem("hardware-chip-outline", specs[2])}
            ${renderSpecItem("pricetag-outline", specs[3])}
          </ul>

          ${car.description ? `<p class="card-description">${escapeHtml(car.description)}</p>` : ""}

          ${
            features.length
              ? `
                <ul class="card-feature-list">
                  ${features.map(function (feature) {
                    return `<li class="card-feature">${escapeHtml(feature)}</li>`;
                  }).join("")}
                </ul>
              `
              : ""
          }

          <div class="card-price-wrapper">
            <p class="card-price">
              <strong>${escapeHtml(price.primary)}</strong>${price.secondary ? `<span class="card-price-secondary">${escapeHtml(price.secondary)}</span>` : ""}
            </p>

            <button class="btn fav-btn" aria-label="${escapeHtml(getTranslation("featured_vehicle"))}">
              <ion-icon name="heart-outline"></ion-icon>
            </button>

            <a
              class="btn"
              href="${buildWhatsappLink(car)}"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="${escapeHtml(getTranslation("rent_now_aria", { title }))}"
            >
              ${escapeHtml(rentNowLabel)}
            </a>
          </div>
        </div>
      </div>
    </li>
  `;
};

const renderCars = function (cars) {
  if (!featuredCarList) {
    return;
  }

  featuredCarList.innerHTML = cars.length
    ? cars.map(renderCarCard).join("")
    : `<li class="featured-car-empty">${escapeHtml(getTranslation("no_cars_match"))}</li>`;
};

const filterCars = function () {
  const brand = normalizeText(searchInputs.brand ? searchInputs.brand.value : "");
  const model = normalizeText(searchInputs.model ? searchInputs.model.value : "");

  return allCars.filter(function (car) {
    const matchesBrand = !brand || normalizeText(car.brand) === brand;
    const matchesModel = !model || normalizeText(car.model) === model;

    return matchesBrand && matchesModel;
  });
};

const scrollToCarsSection = function () {
  const featuredSection = document.querySelector("#featured-car");

  if (!featuredSection) {
    return;
  }

  featuredSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const applyFilters = function (shouldScroll) {
  renderCars(filterCars());

  if (shouldScroll) {
    scrollToCarsSection();
  }
};

const scheduleFilterUpdate = function () {
  if (filterTimer) {
    window.clearTimeout(filterTimer);
  }

  filterTimer = window.setTimeout(function () {
    applyFilters(false);
  }, 250);
};

const loadFeaturedCars = async function () {
  if (!featuredCarList) {
    return;
  }

  try {
    const response = await fetch("./cars.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Failed to load cars.json: ${response.status}`);
    }

    const data = await response.json();
    allCars = Array.isArray(data.cars) ? data.cars : [];
    populateBrandOptions(allCars);
    populateModelOptions(allCars, searchInputs.brand ? searchInputs.brand.value : "");
    populateBrandOptions(allCars, requestInputs.brand);
    populateModelOptions(allCars, requestInputs.brand ? requestInputs.brand.value : "", requestInputs.model);
    applyFilters(false);
  } catch (error) {
    console.error(error);
    featuredCarList.innerHTML = `<li class="featured-car-empty">${escapeHtml(getTranslation("unable_load_cars"))}</li>`;
  }
};

const bindLanguageSwitch = function () {
  languageButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setLanguage(button.dataset.langSwitch || DEFAULT_LANGUAGE);
    });
  });
};

const bindWhatsappWidget = function () {
  if (!whatsappWidget || !whatsappWidgetToggle || !whatsappWidgetClose) {
    return;
  }

  whatsappWidgetToggle.addEventListener("click", function () {
    whatsappWidget.classList.toggle("is-open");
  });

  whatsappWidgetClose.addEventListener("click", function () {
    whatsappWidget.classList.remove("is-open");
  });
};

const bindRentalRequestForm = function () {
  if (!rentalRequestForm) {
    return;
  }

  rentalRequestForm.addEventListener("submit", function (event) {
    event.preventDefault();

    window.open(buildRequestWhatsappLink(), "_blank", "noopener,noreferrer");
  });

  if (requestInputs.brand) {
    requestInputs.brand.addEventListener("change", function () {
      populateModelOptions(allCars, requestInputs.brand ? requestInputs.brand.value : "", requestInputs.model);
    });
  }
};

const bindHeroForm = function () {
  if (!heroForm) {
    return;
  }

  heroForm.addEventListener("submit", function (event) {
    event.preventDefault();
    applyFilters(true);
  });

  if (searchInputs.brand) {
    searchInputs.brand.addEventListener("change", function () {
      populateModelOptions(allCars, searchInputs.brand ? searchInputs.brand.value : "");
      scheduleFilterUpdate();
    });
  }

  if (searchInputs.model) {
    searchInputs.model.addEventListener("change", scheduleFilterUpdate);
  }

  if (searchInputs.rentalFrom) {
    searchInputs.rentalFrom.addEventListener("input", function () {
      applyFilters(false);
    });
    searchInputs.rentalFrom.addEventListener("change", function () {
      applyFilters(false);
    });
  }

  if (searchInputs.rentalTo) {
    searchInputs.rentalTo.addEventListener("input", function () {
      applyFilters(false);
    });
    searchInputs.rentalTo.addEventListener("change", function () {
      applyFilters(false);
    });
  }
};

const fetchTranslations = async function () {
  const response = await fetch("./translations.json", { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to load translations.json: ${response.status}`);
  }

  translations = await response.json();
};

const initialize = async function () {
  try {
    await fetchTranslations();
  } catch (error) {
    console.error(error);
    translations = {
      en: fallbackEnglishTranslations,
      fr: {},
    };
  }

  applyStaticTranslations();
  bindLanguageSwitch();
  bindWhatsappWidget();
  bindRentalRequestForm();
  bindHeroForm();
  await loadFeaturedCars();
};

initialize();

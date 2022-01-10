import Enigma from "./enigma.js";
import {
  alphabetsToPositionArray,
  positionToAlphabet,
  copyTextToClipboard,
  randomSettingsGenerator,
} from "./utils.js";
import themes from "./themes.js";
window.location.hash = "";
Object.keys(themes).forEach((themeName, index) => {
  const theme = themes[themeName];
  const themeElement = document.createElement("a");
  const numberElement = document.createElement("span");
  const nameElement = document.createElement("span");

  nameElement.innerText = themeName;
  themeElement.classList.add(themeName);
  numberElement.classList.add("number");
  numberElement.innerText = +index + 1;

  themeElement.appendChild(numberElement);
  themeElement.appendChild(nameElement);
  nameElement.style.setProperty("color", theme.foreground);
  nameElement.style.setProperty("background-color", theme.background);

  document.querySelector(".themes-options").append(themeElement);
});
function loadLocalstorageTheme() {
  const theme = localStorage.getItem("theme") || "slytherin";

  let faviconElement = document.querySelector("link[rel~='icon']");

  if (!faviconElement) {
    faviconElement = document.createElement("link");
    faviconElement.rel = "icon";
    document.getElementsByTagName("head")[0].appendChild(faviconElement);
  }
  document
    .querySelector(":root")
    .style.setProperty("--background", themes[theme].background);
  document
    .querySelector(":root")
    .style.setProperty("--foreground", themes[theme].foreground);

  faviconElement.href = `./icons/${theme}.png`;
}
loadLocalstorageTheme();
let settings = localStorage.getItem("settings");
if (!settings) {
  let req = new XMLHttpRequest();
  req.open("GET", "./settings.json", false);
  req.send(null);
  settings = req.responseText;
}
settings = JSON.parse(settings)
fetchSettingsToInputs(settings);
const input = document.querySelector(".text-input");
const output = document.querySelector(".text-output");

function encryptInputAndShowOutput(input) {
  const enigma = new Enigma(settings);
  const encryptedArray = alphabetsToPositionArray(input).map((pos) => {
    if (pos === -1) return;
    return positionToAlphabet(enigma.encrypt(pos));
  });
  output.innerHTML = encryptedArray.toString().replace(/,/g, "");
}
let lastTimeoutId;
function showAndHideAlert(alertCssSelector) {
  return function (err) {
    clearTimeout(lastTimeoutId);
    document.querySelector(alertCssSelector).style.opacity = 1;
    lastTimeoutId = setTimeout(() => {
      document.querySelector(alertCssSelector).style.opacity = 0;
    }, 1500);
    if (err) console.log(err);
  };
}
function toggleModal(cssClass, isNone) {
  isNone =
    isNone === undefined
      ? document.querySelector(`.modal.${cssClass}`).style.display
      : isNone;

  document.querySelector(`.modal.${cssClass}`).style.display =
    isNone === "none" ? "flex" : "none";
}
function setNumbersIsEnable(isEnable, cssClass = "menu") {
  document
    .querySelectorAll(`.modal.${cssClass} .number`)
    .forEach((e) => (e.style.display = isEnable ? "block" : "none"));
}
function clickNumber(e, cssClass = "menu") {
  let clickedNumber = +e.code.replace("Digit", "");
  if (clickedNumber) {
    try {
      document
        .querySelectorAll(`.modal.${cssClass} a`)
        [clickedNumber - 1].click();
      e.preventDefault();
    } catch (error) {}
  }
}
//event listeners
window.addEventListener("load", () => {
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
  encryptInputAndShowOutput(input.value);
});
window.addEventListener("blur", () => {
  setNumbersIsEnable(false);
  setNumbersIsEnable(false, "themes");
});
window.addEventListener("keydown", (e) => {
  if (
    document.querySelector(".modal.themes").style.display !== "none" ||
    document.querySelector(".modal.menu").style.display !== "none" ||
    document.querySelector(".modal.settings").style.display !== "none"
  ) {
    input.blur();
  } else {
    input.focus();
  }
  if (e.key === "Enter") {
    copyTextToClipboard(
      output.innerText,
      showAndHideAlert(".alert.copy"),
      showAndHideAlert(".alert-error.copy")
    );
  }
  if (e.key === "Escape") {
    let { hash } = document.location;
    if (hash === "#" || !hash) {
      toggleModal("menu");
      input.focus();
    } else {
      window.location.hash = "";
    }
  }
  if (e.shiftKey) {
    if (document.querySelector(".modal.themes").style.display !== "none") {
      setNumbersIsEnable(true, "themes");
      clickNumber(e, "themes");
    } else if (document.querySelector(".modal.menu").style.display !== "none") {
      setNumbersIsEnable(true);
      clickNumber(e);
    }
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "Shift") {
    e.preventDefault();
    setNumbersIsEnable(false);
    setNumbersIsEnable(false, "themes");
  }
});
window.addEventListener("hashchange", () => {
  let { hash } = document.location;
  switch (hash) {
    case "#settings":
      toggleModal("settings");

      break;
    case "#themes":
      toggleModal("themes");
      break;
    default:
      toggleModal("themes", false);
      toggleModal("settings", false);
      break;
  }
});
document.querySelectorAll(".modal.themes a").forEach((e) => {
  e.addEventListener("click", ({ currentTarget }) => {
    localStorage.setItem("theme", currentTarget.classList[0]);
    loadLocalstorageTheme();
  });
});
input.addEventListener("input", ({ currentTarget: { value } }) => {
  encryptInputAndShowOutput(value);
});
function fetchSettingsToInputs(settings) {
  const ringsElements = document.querySelectorAll(".settings-form .ring");
  const rotorIndexsElements = document.querySelectorAll(
    ".settings-form .rotor"
  );
  const reflectorElement = document.querySelector(".settings-form .reflector");
  const notchsElement = document.querySelectorAll(".settings-form .notch");
  const plugsElement = document.querySelector(".settings-form .plugs");
  Object.keys(settings.rotors).forEach((e, i) => {
    rotorIndexsElements[i].value = e;
    ringsElements[i].value = settings.rotors[e];
  });
  reflectorElement.value = settings.reflector;
  if (settings.notchs)
    notchsElement.forEach((e, i) => {
      e.value = settings.notchs[i] || "";
    });
  plugsElement.value = settings.plugboard.toString();
}
function getSettingsFromInputs() {
  const rings = document.querySelectorAll(".settings-form .ring");
  const rotorIndexs = document.querySelectorAll(".settings-form .rotor");
  const reflector = +document.querySelector(".settings-form .reflector").value;
  const notchs = [...document.querySelectorAll(".settings-form .notch")].map(
    (e) => e.value
  );
  const plugboard = document
    .querySelector(".settings-form .plugs")
    .value.split(/\s*,\s*/g)
    .filter((e) => !!e);

  let rotors = {};
  rotorIndexs.forEach((e, i) => {
    rotors[e.value] = rings[i].value;
  });
  return { rotors, reflector, plugboard, notchs };
}
document.querySelector(".settings-form").addEventListener("submit", (e) => {
  e.preventDefault();
  try {
    new Enigma(getSettingsFromInputs());
    settings = getSettingsFromInputs();
    localStorage.setItem("settings", JSON.stringify(settings))
    showAndHideAlert(".alert.save")();
    window.location.hash = "";
  } catch (error) {
    showAndHideAlert(".alert-error.save")(error);
  }
});
document.querySelector(".settings-btn-random").addEventListener("click", () => {
  fetchSettingsToInputs(randomSettingsGenerator());
});
document.querySelector(".settings-btn-json").addEventListener("click", () => {
  const type = "text/json";
  const a = document.createElement("a"),
    url = URL.createObjectURL(
      new Blob([JSON.stringify(getSettingsFromInputs())], { type })
    );
  a.href = url;
  a.download = "settings.json";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
});

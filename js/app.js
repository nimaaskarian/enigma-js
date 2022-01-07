import Enigma from "./enigma.js";
import {
  alphabetsToPositionArray,
  positionToAlphabet,
  copyTextToClipboard,
} from "./utils.js";

let req = new XMLHttpRequest();
req.open("GET", "../settings.json", false);
req.send(null);
const settings = JSON.parse(req.responseText);

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
//event listeners
window.addEventListener("load", () => {
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
  encryptInputAndShowOutput(input.value);
});

input.addEventListener("keydown", ({ key }) => {
  if (key === "Enter") {
    copyTextToClipboard(
      output.innerText,
      showAndHideAlert(".alert-copy"),
      showAndHideAlert(".alert-error")
    );
  }
});
input.addEventListener("input", ({ currentTarget: { value } }) => {
  encryptInputAndShowOutput(value);
});

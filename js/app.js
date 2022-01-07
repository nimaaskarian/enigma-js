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
      () => {
        document.querySelector(".alert-copy").style.opacity = 1;
        setTimeout(() => {
          document.querySelector(".alert-copy").style.opacity = 0;
        }, 1500);
      },
      () => {
        document.querySelector(".alert-error").style.opacity = 1;
        setTimeout(() => {
          document.querySelector(".alert-error").style.opacity = 0;
        }, 1500);
      }
    );
  }
});
input.addEventListener("input", ({ currentTarget: { value } }) => {
  encryptInputAndShowOutput(value);
});

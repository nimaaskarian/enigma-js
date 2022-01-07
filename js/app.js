import Enigma from "./enigma.js";
import { alphabetsToPositionArray, positionToAlphabet } from "./utils.js";

let req = new XMLHttpRequest()
req.open("GET", "../settings.json",false)
req.send(null)
const settings = JSON.parse(req.responseText);

const input = document.querySelector(".text-input");
const output = document.querySelector(".text-output");

input.addEventListener("input", ({ currentTarget: { value } }) => {
  const enigma = new Enigma(settings);
  const encryptedArray = alphabetsToPositionArray(value).map((pos) => {
    if (pos === -1) return;
    return positionToAlphabet(enigma.encrypt(pos));
  });
  output.innerHTML = encryptedArray.toString().replace(/,/g, "");
});

import Enigma from "./enigma.js";
import { alphabetsToPositionArray, positionToAlphabet } from "./utils.js";
const settings = {
  rotors: {
    1: 0,
    2: 0,

    3: 0,
  },
  reflector: 1,
  plugboard:["ga","ez"]
};
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

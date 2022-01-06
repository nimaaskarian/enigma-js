import Enigma from "./enigma.js";
import { alphabetsToPositionArray, positionToAlphabet } from "./utils.js";
const settings = {
  rotors: {
    1: 5,
    2: 2,

    4: 1,
  },
  reflector: 1,
};
const enigma = new Enigma(settings);
const enigma2 = new Enigma(settings);

for (let index = 0; index < 26; index++) {
  const output = enigma.encrypt(index);
  console.log(output, enigma2.encrypt(output));
}

import { alphabetsToPositionArray } from "./utils.js";
//!private constants, proceed with care
const _ROTOR_SETTINGS = [
  [
    4, 10, 12, 5, 11, 6, 3, 16, 21, 25, 13, 19, 14, 22, 24, 7, 23, 20, 18, 15,
    0, 8, 1, 17, 2, 9,
  ],

  [
    0, 9, 3, 10, 18, 8, 17, 20, 23, 1, 11, 7, 22, 19, 12, 2, 16, 6, 25, 13, 15,
    24, 5, 21, 14, 4,
  ],

  [
    1, 3, 5, 7, 9, 11, 2, 15, 17, 19, 23, 21, 25, 13, 24, 4, 8, 22, 6, 0, 10,
    12, 20, 18, 16, 14,
  ],

  [
    4, 18, 14, 21, 15, 25, 9, 0, 24, 16, 20, 8, 17, 7, 23, 11, 13, 5, 19, 6, 10,
    3, 2, 12, 22, 1,
  ],

  [
    21, 25, 1, 17, 6, 8, 19, 24, 20, 15, 18, 3, 13, 7, 11, 23, 0, 22, 12, 9, 16,
    14, 5, 4, 2, 10,
  ],
  [
    9, 15, 6, 21, 14, 20, 12, 5, 24, 16, 1, 4, 13, 7, 25, 17, 3, 10, 0, 18, 23,
    11, 8, 2, 19, 22,
  ],
  [
    13, 25, 9, 7, 6, 17, 2, 23, 12, 24, 18, 22, 1, 14, 20, 5, 0, 8, 21, 11, 15,
    4, 10, 16, 3, 19,
  ],
  [
    5, 10, 16, 7, 19, 11, 23, 14, 2, 1, 9, 18, 15, 3, 25, 17, 0, 12, 4, 22, 13,
    8, 20, 24, 6, 21,
  ],
  [
    16, 18, 24, 13, 10, 11, 15, 0, 4, 14, 9, 6, 23, 8, 20, 5, 22, 25, 3, 17, 21,
    2, 19, 1, 12, 7,
  ],
];
const _REFLECTOR_SETTINGS = [
  [
    4, 9, 12, 25, 0, 11, 24, 23, 21, 1, 22, 5, 2, 17, 16, 20, 14, 13, 19, 18,
    15, 8, 10, 7, 6, 3,
  ],

  [
    24, 17, 20, 7, 16, 18, 11, 3, 15, 23, 13, 6, 14, 10, 12, 8, 4, 1, 5, 25, 2,
    22, 21, 9, 0, 19,
  ],

  [
    5, 21, 15, 9, 8, 0, 14, 24, 4, 3, 17, 25, 23, 22, 6, 2, 19, 10, 20, 16, 18,
    1, 13, 12, 7, 11,
  ],
];
class Rotor {
  constructor(rotorSettingsIndex, startIndex, nextRotor) {
    this.rotorSettings = [..._ROTOR_SETTINGS[rotorSettingsIndex]];
    if (!this.rotorSettings) throw new Error("This rotor doesn't exist!");
    for (let index = 0; index < startIndex; index++) this.rotate();
    this.startIndex = startIndex;
    this.nextRotor = nextRotor;
  }
  rotate() {
    this.startIndex =
      this.startIndex > 24 ? this.startIndex - 24 : this.startIndex + 1;

    const elementToPush = this.rotorSettings.shift();
    this.rotorSettings.push(elementToPush);
  }
  input(pos) {
    return this.rotorSettings[pos];
  }
}
class Reflector extends Rotor {
  constructor(reflectorSettingsIndex) {
    super(reflectorSettingsIndex, 0);
    this.rotorSettings = [..._REFLECTOR_SETTINGS[reflectorSettingsIndex]];
  }
}
class Enigma {
  constructor(machineSettings) {
    if (Object.keys(machineSettings.rotors).length !== 3) {
      throw new Error("Enigma needs exact 3 distinct rotors");
    }

    ["a", "b", "c"].forEach((key, index) => {
      this[key] = new Rotor(
        Object.keys(machineSettings.rotors)[+index],
        Object.values(machineSettings.rotors)[+index]
      );
    });
    this.reflector = new Reflector(machineSettings.reflector);
    if (!machineSettings.reflector || !this.reflector)
      throw new Error("Enigma needs a reflector");
    this.plugboard = {};
    machineSettings.plugboard.forEach((e) => {
      this.plugboard[alphabetsToPositionArray(e)[0]] =
        alphabetsToPositionArray(e)[1];
      this.plugboard[alphabetsToPositionArray(e)[1]] =
        alphabetsToPositionArray(e)[0];
    });
    if (
      !Object.keys(this.plugboard).equals(
        Object.values(this.plugboard)
          .map((e) => +e)
          .sort()
      )
    )
      throw new Error("You can't plug two cables to one plugs at same time");
  }
  encrypt(input) {
    if (this.plugboard[input] !== undefined) input = this.plugboard[input];
    if (this.a.startIndex === 25) this.b.rotate();

    if (this.b.startIndex === 25) this.c.rotate();

    const throughRotorsOnce = this.c.input(this.b.input(this.a.input(input)));
    let output = this.a.rotorSettings.findIndex(
      (ae) =>
        ae ===
        this.b.rotorSettings.findIndex(
          (be) =>
            be ===
            this.c.rotorSettings.findIndex(
              (ce) => ce === this.reflector.input(throughRotorsOnce)
            )
        )
    );

    this.a.rotate();
    if (this.plugboard[output] !== undefined) output = this.plugboard[output];

    return output;
  }
}

export default Enigma;

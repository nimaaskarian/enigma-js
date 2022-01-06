const _rotorSettings = [
  {
    wires: [
      4, 10, 12, 5, 11, 6, 3, 16, 21, 25, 13, 19, 14, 22, 24, 7, 23, 20, 18, 15,
      0, 8, 1, 17, 2, 9,
    ],
    notch: 1,
  },
  {
    wires: [
      0, 9, 3, 10, 18, 8, 17, 20, 23, 1, 11, 7, 22, 19, 12, 2, 16, 6, 25, 13,
      15, 24, 5, 21, 14, 4,
    ],
    notch: 6,
  },
  {
    wires: [
      1, 3, 5, 7, 9, 11, 2, 15, 17, 19, 23, 21, 25, 13, 24, 4, 8, 22, 6, 0, 10,
      12, 20, 18, 16, 14,
    ],
    notch: 11,
  },
  {
    wires: [
      4, 18, 14, 21, 15, 25, 9, 0, 24, 16, 20, 8, 17, 7, 23, 11, 13, 5, 19, 6,
      10, 3, 2, 12, 22, 1,
    ],
    notch: 2,
  },
  {
    wires: [
      21, 25, 1, 17, 6, 8, 19, 24, 20, 15, 18, 3, 13, 7, 11, 23, 0, 22, 12, 9,
      16, 14, 5, 4, 2, 10,
    ],
    notch: 15,
  },
];

const _reflectorSettings = [
  {
    wires: [
      4, 9, 12, 25, 0, 11, 24, 23, 21, 1, 22, 5, 2, 17, 16, 20, 14, 13, 19, 18,
      15, 8, 10, 7, 6, 3,
    ],
  },
  {
    wires: [
      24, 17, 20, 7, 16, 18, 11, 3, 15, 23, 13, 6, 14, 10, 12, 8, 4, 1, 5, 25,
      2, 22, 21, 9, 0, 19,
    ],
  },
  {
    wires: [
      5, 21, 15, 9, 8, 0, 14, 24, 4, 3, 17, 25, 23, 22, 6, 2, 19, 10, 20, 16,
      18, 1, 13, 12, 7, 11,
    ],
  },
];
class Rotor {
  constructor(rotorSettingsIndex, startIndex, nextRotor) {
    this.rotorSettings = _rotorSettings[rotorSettingsIndex];
    if (!this.rotorSettings) throw new Error("This rotor doesn't exist!");
    this.startIndex = startIndex;
    this.nextRotor = nextRotor;
  }
  rotate() {
    const nextIndex = this.startIndex + 1;
    this.startIndex = nextIndex > 25 ? nextIndex - 25 : nextIndex;
  }
  input(letterIndex) {
    const index = this.startIndex + letterIndex;
    // console.log(this.rotorSettings);
    // console.log(this.startIndex, letterIndex);
    return this.rotorSettings.wires[index > 25 ? index - 25 : index];
  }
}

export function rotors(a, b, c, input) {
  if (a.nextRotor)
    if (a.startIndex === a.rotorSettings.notch) a.nextRotor.rotate();
  const rotated = c.input(b.input(a.input(input)));
  const reflector = new Rotor(5, 0);
  const cIndex = c.rotorSettings.wires.findIndex(
    (ce) => ce === reflector.input(rotated)
  );
  const bIndex = b.rotorSettings.wires.findIndex((be) => be === cIndex);
  const output = a.rotorSettings.wires.findIndex((ae) => ae === bIndex);

  a.rotate();
  return output;
}
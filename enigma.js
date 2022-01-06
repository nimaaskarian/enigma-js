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
  constructor(
    rotorSettingsIndex,
    startIndex,
    nextRotor,
    settings = _rotorSettings
  ) {
    this.rotorSettings = settings[rotorSettingsIndex];
    if (!this.rotorSettings) throw new Error("This rotor doesn't exist!");
    for (let index = 0; index < startIndex; index++) this.rotate();

    this.nextRotor = nextRotor;
  }
  rotate() {
    const elementToPush = this.rotorSettings.wires.pop();
    this.rotorSettings.wires.push(elementToPush);
  }
  input(pos) {
    return this.rotorSettings.wires[pos];
  }
}
class Reflector extends Rotor {
  constructor(reflectorSettingsIndex) {
    super(reflectorSettingsIndex, 0, null, _reflectorSettings);
  }
}
class Enigma {
  constructor(machineSettings) {
    ["a", "b", "c"].forEach((key, index) => {
      this[key] = new Rotor(
        Object.keys(machineSettings.rotors)[+index],
        Object.values(machineSettings.rotors)[+index]
      );
    });
    this.reflector = new Reflector(machineSettings.reflector);
  }
  encrypt(input) {
    if (this.a.nextRotor)
      if (this.a.startIndex === this.a.rotorSettings.notch) this.b.rotate();
    if (this.b.nextRotor)
      if (this.b.startIndex === this.a.rotorSettings.notch) this.c.rotate();

    const throughRotorsOnce = this.c.input(this.b.input(this.a.input(input)));
    const cIndex = this.c.rotorSettings.wires.findIndex(
      (ce) => ce === this.reflector.input(throughRotorsOnce)
    );
    const bIndex = this.b.rotorSettings.wires.findIndex((be) => be === cIndex);
    const output = this.a.rotorSettings.wires.findIndex((ae) => ae === bIndex);

    this.a.rotate();
    return output;
  }
}

export default Enigma;

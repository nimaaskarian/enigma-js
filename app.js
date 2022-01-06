import { rotorConstructor } from "./utils.js";
import { _rotorSettings } from "./enigma.js";
console.log(JSON.stringify(rotorConstructor()));


let c = new Rotor(2, 0);
let b = new Rotor(1, 0, c);
let a = new Rotor(0, 0, b, true);

let output = rotors(a, b, c, 5);
console.log(output);
let c2 = new Rotor(2, 0);
let b2 = new Rotor(1, 0, c2);
let a2 = new Rotor(0, 0, b2, true);

console.log(rotors(a2, b2, c2, output));

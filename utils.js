export function random(max = 1, min = 0) {
  return Math.round(Math.random() * max + min);
}

export function rotorConstructor() {
  let wires = new Set();
  while (wires.size < 26) {
    wires.add(random(25));
    //console.log([...wires].filter((e,i)=> e !== i))
    wires = new Set([...wires].filter((e,i)=> e !== i))
  }
  wires = [...wires];

  let notch = random(25);

  return { wires, notch };
}


export function random(max = 1, min = 0) {
  return Math.round(Math.random() * max + min);
}

export function alphabetsToPositionArray(text) {
  if (!text) return [];
  var result = "";
  for (var i = 0; i < text.length; i++) {
    var code = text.toUpperCase().charCodeAt(i);
    if (code > 64 && code < 91) result += code - 64 + " ";
  }
  return result
    .slice(0, result.length - 1)
    .split(/\s/)
    .map((e) => +e - 1);
}
export function positionToAlphabet(pos) {
  return (pos + 10).toString(36);
}

export function rotorConstructor() {
  let wires = new Set();
  while (wires.size < 26) {
    wires.add(random(25));
    wires = new Set([...wires].filter((e, i) => e !== i));
  }
  wires = [...wires];

  let notch = random(25);

  return { wires, notch };
}
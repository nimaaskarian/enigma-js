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
  let wires = Array.from(Array(26).keys());
  wires = shuffle(wires);
  return [...wires];
}

function fallbackCopyTextToClipboard(text, onCopy, onError) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand("copy");
    onCopy();
  } catch (err) {
    onError(err);
  }

  document.body.removeChild(textArea);
}
export function randomSettingsGenerator() {
  const _rotors = shuffle(Array.from(Array(8).keys()));
  let rotors = {
    [_rotors[0]]: random(25),
    [_rotors[1]]: random(25),
    [_rotors[2]]: random(25),
  };
  let notchs = Array.from(Array(2).keys()).map(() => {
    return random(25);
  });
  let reflector = random(4);
  let plugboard = [];

  const max = random(13, 4);
  let plugs = Array.from(Array(26).keys());

  plugs = shuffle(plugs).slice(0, max * 2);
  for (let index = 0; index < max; index++) {
    const e = plugs[index];
    plugboard.push(
      positionToAlphabet(e) +
        positionToAlphabet(plugs[plugs.length - index - 1])
    );
  }

  return { rotors, notchs, reflector, plugboard };
}
export function copyTextToClipboard(
  text,
  onCopy = new Function(),
  onError = new Function()
) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text, onCopy, onError);
    return;
  }
  navigator.clipboard.writeText(text).then(onCopy, onError);
}

if (Array.prototype.equals)
  console.warn(
    "Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code."
  );
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
  // if the other array is a falsy value, return
  if (!array) return false;

  // compare lengths - can save a lot of time
  if (this.length != array.length) return false;

  for (var i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i])) return false;
    } else if (this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
};
export function shuffle(array) {
  var tmp,
    current,
    top = array.length;
  if (top)
    while (--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }
  return array;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", { enumerable: false });

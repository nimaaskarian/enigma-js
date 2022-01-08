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

if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
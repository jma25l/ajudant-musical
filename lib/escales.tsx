/** Miscel·lani d'`"àlgebra musical" */

export const fonamentals = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

//Pre: ac: Un acord, amb les floritures que necessiti
//Post: L'índex de la seva fonamental d'acord amb la llista de dalt
export function getFonamental(original: string): number {
  let fonamental = -1;
  switch (original[0]) {
    case "C":
      fonamental = 0;
      break;
    case "D":
      fonamental = 2;
      break;
    case "E":
      fonamental = 4;
      break;
    case "F":
      fonamental = 5;
      break;
    case "G":
      fonamental = 7;
      break;
    case "A":
      fonamental = 9;
      break;
    case "B":
      fonamental = 11;
      break;
  }

  if (original.includes("#")) fonamental++;
  else if (original.includes("b")) fonamental--;
  return fonamental;
}

/** REGEX */
//https://stackoverflow.com/a/46522424 (Adaptat)
const notes = "[A-G]",
  accidentals = "(b|bb|#){0,1}",
  chords = "(m|maj|min|sus|add){0,1}",
  suspends = "\\d{0,2}"; //Entre 1 i dos dígits.

export function testAcords(x: string):string|false {
  const b = new RegExp(
    "^" + notes + accidentals + chords + suspends + "$",
    "g",
  ).test(x.trim());

  if(!b) return false;
  if(!x.includes('b')) return x;
  return fonamentals[getFonamental(x)]+x.slice(2)
}

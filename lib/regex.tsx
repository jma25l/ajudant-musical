
//https://stackoverflow.com/a/46522424 (Adaptat)
const notes = "[A-G]",
  accidentals = "(b|bb|#){0,1}",
  chords = "(m|maj|min|sus|add){0,1}",
  suspends = "\\d{0,2}"; //Entre 1 i dos dígits. 

export function testAcords(x:string) {
    return (new RegExp("^"+notes + accidentals + chords + suspends+"$", "g")).test(x.trim());
}

//https://stackoverflow.com/a/46522424 (Adaptat)
var notes = "[A-G]",
  accidentals = "(b|bb|#)?",
  chords = "(maj7|min7|maj|min|sus|m)?",
  suspends = "(1-9)?";

export function testAcords(x:string) {
    return (new RegExp("^"+notes + accidentals + chords + suspends+"$", "g")).test(x);
}
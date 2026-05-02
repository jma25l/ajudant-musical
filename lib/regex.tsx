
//https://stackoverflow.com/a/46522424 (Adaptat)
var notes = "[CDEFGAB]",
  accidentals = "(b|bb)?",
  chords = "(m|maj7|maj|min7|min|sus)?",
  suspends = "(1|2|3|4|5|6|7|8|9)?",
  sharp = "(#)?";

export function testAcords(x:string) {
    return (new RegExp(notes + accidentals + chords + suspends + sharp, "g")).test(x);
}
import { testAcords } from "./regex";

type tipusBloc =
  | "lletra"
  | "acords"
  | "titol"
  | "sotstitol"
  | "link"
  | "encaixat"
  | "buida"
  | "capçalera";
export interface BlocRenderAcords {
  tipus: tipusBloc;
  continguts?: string;
  fills?: BlocRenderAcords[];
  intro: boolean;
}

export function parseja(continguts: string[]) {
  let capçalera = false;
  let sortida: BlocRenderAcords[] = [];
  let currentBloc: BlocRenderAcords[] = [];
  let intro = true;
  for (let i = 0; i < continguts.length; i++) {
    let linea = continguts[i];

    let bloc = linea.startsWith(">");
    if (bloc) linea = linea.substring(1);

    let tipus: tipusBloc | undefined = undefined;
    if (linea.length == 0) tipus = "buida";
    else if (linea === "<#>") {
      tipus = "capçalera";
      capçalera = true;
    } else if (linea.startsWith("##")) tipus = "sotstitol";
    else if (linea.startsWith("#")) tipus = "titol";
    else if (linea.startsWith("https://")) tipus = "link";
    else if (sonAcords(linea)) tipus = "acords";
    else tipus = "lletra";

    if (!tipus) continue;
    const el: BlocRenderAcords = {
      continguts: linea,
      tipus: tipus,
      intro: intro,
    };
    if (bloc) currentBloc.push(el);
    else {
      if (currentBloc.length != 0) {
        sortida.push({
          tipus: "encaixat",
          fills: currentBloc,
          intro: intro,
        });
        currentBloc = [];
      }
      sortida.push(el);
    }
  }

  return { sortida, capçalera };
}

function sonAcords(linea: string): boolean {
  const split = linea.split(/[\s\/]/g).filter((x) => x);
  if (split.length == 0) return false; //Crec que això donarà menys problemes
  let ac = false;
  for (let x of split) {
    if (/x[0-9]+/i.test(x)) continue;
    if (/\[[^\]]*\]/i.test(x)) {
      //sep = true; // He trencat que amagar acords deixi aquestes línies
      continue;
    }
    if ((ac = testAcords(x))) continue;
    return false;
  }

  return ac;
}

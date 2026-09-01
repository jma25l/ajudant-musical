import { testAcords } from "./regex";

type tipusBlocFulla =
  "lletra" | "acords" | "titol" | "sotstitol" | "link" | "buida" | "capçalera";

interface BlocRenderAcordsFulla {
  tipus: tipusBlocFulla;
  continguts: string;
  intro: boolean;
}

type tipusBlocBranca = "encaixat";

interface BlocRenderAcordsBranca {
  tipus: tipusBlocBranca;
  fills: BlocRenderAcords[];
  intro: boolean;
}

export type BlocRenderAcords = BlocRenderAcordsFulla | BlocRenderAcordsBranca;
type tipusBloc = tipusBlocFulla | tipusBlocBranca;

export function parseja(continguts: string[]) {
  let capçalera = false;
  let sortida: BlocRenderAcords[] = [];
  let currentBloc: BlocRenderAcords[] = [];
  let llistaAcords = new Set<string>();
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
    else {
      const ac = sonAcords(linea);
      if (ac.size) {
        tipus = "acords";
        llistaAcords = llistaAcords.union(ac);
      } else tipus = "lletra";
    }

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

  return { sortida, capçalera, llistaAcords };
}

function sonAcords(linea: string): Set<string> {
  const split = linea.split(/[\s\/]/g).filter((x) => x);
  if (split.length == 0) return new Set<string>(); //Crec que això donarà menys problemes
  let ac = new Set<string>();
  for (let x of split) {
    if (/x[0-9]+/i.test(x)) continue;
    if (/\[[^\]]*\]/i.test(x)) {
      //sep = true; // He trencat que amagar acords deixi aquestes línies
      continue;
    }
    if (testAcords(x)) ac.add(x);
    else return new Set<string>();
  }

  return ac;
}

"use client";

import { useEffect, useState } from "react";
import { testAcords } from "@/lib/regex";
import { fonamentals, getFonamental } from "@/lib/escales";
import { AcordsDBList, detColorEstatAcord } from "@/lib/tipus";
import { FitxaAcord } from "./fitxaAcord";
import Link from "next/link";
import { useAccioTeclat } from "@/hooks/keyHandler";
import { BlocRenderAcords, parseja } from "@/lib/parser";
import { Capçalera } from "./capçalera";

interface AcordsProps {
  nom: string;
  lletra: string;
  coneguts: AcordsDBList;
}

export default function AcordsCanco(props: AcordsProps) {
  const { coneguts } = props;

  const {
    sortida: lletra,
    capçalera,
    llistaAcords,
  } = parseja(props.lletra.split("\n"));
  const [transposicio, setTransposicio] = useState<number>(0);
  const [nomesLletra, setNomesLletra] = useState<boolean>(false);
  const [simplifica, setSimplifica] = useState<boolean>(true); //TODO: Fer que realment es pugui act/desact
  const [visiblePopup, setVisiblePopup] = useState<string | null>(null);
  const [visiblePopupPos, setVisiblePopupPos] = useState<DOMRect | null>(null);
  const [prims, setPrims] = useState<boolean>(true);

  function preSetTransposicio(t: number) {
    if (Math.abs(t) > 12) return;
    setPrims(false);
    setTransposicio(t);
  }

  useAccioTeclat({
    tecla: "ArrowLeft",
    premuda: () => preSetTransposicio(transposicio - 1),
  });
  useAccioTeclat({
    tecla: "ArrowRight",
    premuda: () => preSetTransposicio(transposicio + 1),
  });

  function defvisiblePopup(str: string | null, visiblePopupPos: DOMRect) {
    setVisiblePopup(str);
    if (visiblePopupPos) setVisiblePopupPos(visiblePopupPos);
  }
  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        <button
          className="btn noPrint"
          style={{
            backgroundColor: nomesLletra ? "red" : "lightgreen",
            width: "100px",
          }}
          onClick={() => setNomesLletra(!nomesLletra)}
        >
          Acords
        </button>
        <input
          style={{
            textAlign: "center",
            display: nomesLletra ? "none" : "inline",
          }}
          readOnly
          type="number"
          value={transposicio}
        />
        <div
          className="noPrint"
          style={{ display: nomesLletra ? "none" : undefined }}
        >
          <button
            className="btn cA"
            onClick={() => preSetTransposicio(transposicio - 1)}
          >
            -1
          </button>
          <button className="btn cA" onClick={() => preSetTransposicio(0)}>
            0
          </button>
          <button
            className="btn cA"
            onClick={() => preSetTransposicio(transposicio + 1)}
          >
            +1
          </button>
        </div>
      </div>
      {!capçalera ? (
        <>
          <div
            className="flex-wrap"
            style={{
              justifyContent: "space-around",
              display: nomesLletra ? "none" : "flex",
            }}
          >
            {Array.from(llistaAcords).map((x) => (
              <FitxaAcord
                acord={x}
                key={x}
                coneguts={coneguts}
                transposa={transposicio}
                simplifica={simplifica}
              />
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
      <div
        className="popup"
        style={{
          display: visiblePopup ? "block" : "none",
          position: "fixed",
          left:
            (visiblePopupPos?.x || 0) +
            5 +
            (2 * (visiblePopupPos?.width || 0)) / 3,
          top: (visiblePopupPos?.y || 0) - 10,
        }}
      >
        <FitxaAcord
          acord={visiblePopup || ""}
          coneguts={coneguts}
          transposa={transposicio}
          simplifica={simplifica}
        />
      </div>
      <div className="acords">
        {lletra?.map((x, i) => (
          <BlocAcords
            key={i}
            node={x}
            data={{
              transposicio: transposicio,
              coneguts: coneguts,
              setVisiblePopup: defvisiblePopup,
              nomesLletra: nomesLletra,
              visiblePopup: visiblePopup,
              visiblePopupPos: visiblePopupPos,
              simplifica: simplifica,
              llistaAcords: llistaAcords,
            }}
          />
        ))}
      </div>
    </>
  );
}

interface BlocAcordsData {
  transposicio: number;
  coneguts: AcordsDBList;
  nomesLletra: boolean;
  setVisiblePopup: { (str: string | null, visiblePopupPos: DOMRect): void };
  visiblePopup: string | null;
  visiblePopupPos: DOMRect | null;
  simplifica: boolean;
  llistaAcords: Set<string>;
}

interface BlocAcordsProps {
  node: BlocRenderAcords;
  data: BlocAcordsData;
}

function BlocAcords(props: BlocAcordsProps) {
  const { transposicio, nomesLletra } = props.data;
  const node = props.node;
  //Veure si són títols

  switch (node.tipus) {
    case "lletra":
      return <span>{node.continguts} </span>;
    case "acords":
      if (nomesLletra) return;
      return (
        <span>
          {node.continguts.split(/[/\s]/g).map((x, i) => {
            if (x.length == 0) return " ";
            else if (testAcords(x))
              return (
                <Acord
                  key={i}
                  original={x}
                  transposicio={transposicio}
                  setVisiblePopup={props.data.setVisiblePopup}
                  coneguts={props.data.coneguts}
                  simplifica={props.data.simplifica}
                />
              ); // L'espai a la dreta és necessari
            else return x + " ";
          })}
        </span>
      );
    case "titol":
      return <h2>{node.continguts.slice(2)}</h2>;
    case "sotstitol":
      return <b>{node.continguts.slice(3)}</b>;
    case "link":
      return <Link href={node.continguts}>{node.continguts}</Link>;
    case "encaixat":
      return (
        <div className="encaixatAcords">
          {node.fills.map((x, i) => {
            return (
              <BlocAcords
                key={i}
                data={props.data} // Heretar totes les propietats
                node={x}
              />
            );
          })}
        </div>
      );
    case "capçalera":
      return (
        <Capçalera
          llista={props.data.llistaAcords}
          transposicio={props.data.transposicio}
          coneguts={props.data.coneguts}
          nomesLletra={props.data.nomesLletra}
          visiblePopup={props.data.visiblePopup}
          visiblePopupPos={props.data.visiblePopupPos}
          simplifica={props.data.simplifica}
        />
      );
    case "buida":
      return <br />; // Segurament pugui fer alguna cosa millor, però almenys ja he decidit si és acords o lletra: cap
  }
}

interface AcordProps {
  original: string;
  transposicio: number;
  coneguts: AcordsDBList;
  setVisiblePopup: { (str: string | null, visiblePopupPos: DOMRect): void };
  simplifica: boolean;
}

function Acord(props: AcordProps) {
  const { original, transposicio, simplifica } = props;
  const modificadors = original.replace(/^[A-G](#|b)?/, "");

  // MOLT BRUT
  const fonamental = getFonamental(original);
  const f = fonamentals[(fonamental + transposicio + 12) % 12];
  let acDisplay = f.slice(0, 1) + (f.length == 2 ? "#" : "") + modificadors;

  if (simplifica) {
    const simp = props.coneguts[acDisplay]?.simp;
    if (simp && props.coneguts[simp]) acDisplay = simp;
  }

  const extraD = f.length === 2 ? "" : " ";
  const color = detColorEstatAcord(props.coneguts[acDisplay]?.estat);

  return (
    <>
      <span
        className="acord"
        style={{ backgroundColor: color }}
        onMouseEnter={(e) =>
          props.setVisiblePopup(
            original,
            e.currentTarget.getBoundingClientRect(),
          )
        }
        onMouseLeave={(e) =>
          props.setVisiblePopup(null, e.currentTarget.getBoundingClientRect())
        }
      >
        {acDisplay}
      </span>
      {extraD}
    </>
  );
}

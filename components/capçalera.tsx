"use client";
import { AcordsDBList } from "@/lib/tipus";
import { FitxaAcord } from "./fitxaAcord";

interface CapçaleraProps {
  nomesLletra: boolean;
  transposicio: number;
  llista: Set<string>;
  coneguts: AcordsDBList;
  visiblePopup: string | null;
  visiblePopupPos: DOMRect | null;
  simplifica: boolean;
}

export function Capçalera(props: CapçaleraProps) {
  const {
    nomesLletra,
    transposicio,
    llista,
    coneguts,
    visiblePopup,
    visiblePopupPos,
    simplifica,
  } = props;

  return (
    <>
      <div
        className="flex-wrap"
        style={{
          justifyContent: "space-around",
          display: nomesLletra ? "none" : "flex",
        }}
      >
        {Array.from(llista).map((x) => (
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
  );
}

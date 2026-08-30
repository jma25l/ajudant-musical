"use client"
import { AcordsDBList } from "@/lib/tipus";
import { FitxaAcord } from "./fitxaAcord";

interface CapçaleraProps {
  nomesLletra: boolean;
  transposicio: number;
  llista: string[];
  coneguts: AcordsDBList;
  visiblePopup: string | null;
  visiblePopupPos: DOMRect | null;
  simplifica:boolean;
}

export function Capçalera(props: CapçaleraProps) {
  const {
    nomesLletra,
    transposicio,
    llista,
    coneguts,
    visiblePopup,
    visiblePopupPos,
    simplifica
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
        {llista?.map((x) => (
          <FitxaAcord
            acord={x}
            key={x}
            coneguts={coneguts}
            transposa={transposicio}
            simplifica={simplifica}
          />
        ))}
      </div>
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
    </>
  );
}

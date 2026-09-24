"use client";
import { cercaCanconer } from "@/lib/busca";
import { Canco } from "@/lib/tipus";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./estil.scss";

export default function Home() {
  const [canconer, setCanconer] = useState<Canco[]>([]);
  const [filtrat, setFiltrat] = useState<Canco[]>([]);
  const [autors, setAutors] = useState<Set<string>>(new Set<string>());
  const [filtreAutor, setFiltreAutor] = useState<string | undefined>(undefined);

  const preSetCanconer = (data: Canco[]) => {
    let au = new Set<string>();
    data.forEach((x) => {
      if (x.autor && !au.has(x.autor)) au.add(x.autor); //Potser estaria bé normalitzar
    });
    setCanconer(data);
    setAutors(au);
  };

  const processaFiltreCanconer = (c: Canco) => {
    if (filtreAutor && filtreAutor != c.autor) return false;
    return true;
  };

  useEffect(() => void cercaCanconer().then(preSetCanconer), []);

  useEffect(() => {
    // Soc conscient que és O(n) i segurament millorable, pero bueno
    setFiltrat(canconer.filter(processaFiltreCanconer));
  }, [filtreAutor, canconer]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div>
          <a href="acordari" className="btn cA">
            Catàleg d'acords
          </a>
          <a href="visor" className="btn cA">
            Visor "lliure"
          </a>

          <select onChange={(x) => setFiltreAutor(x.target.value)}>
            <option value=""> Sense filtre</option>
            {[...autors?.values()].map((x, i) => (
              <option value={x} key={i}>
                {x}
              </option>
            ))}
          </select>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {filtrat.map((x, i) => (
            <Link href={"/visor/" + x.id} key={i}>
              <div className={"fitxaCanco"}>
                <b>{x.nom}</b>
                <br />
                <span>
                  <i>{x.autor || "Desconegut"}</i>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

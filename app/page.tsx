"use client";
import { cercaCanconer } from "@/lib/busca";
import { Canco } from "@/lib/tipus";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [canconer, setCanconer] = useState<Canco[]>([]);

  useEffect(() => void cercaCanconer().then(setCanconer), []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {canconer.map((x, i) => (
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

"use client";

import AcordsCanco from "@/components/acords";
import { AcordsDBList } from "@/lib/tipus";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./estil.scss";
import { cercaAcordsConeguts } from "@/lib/busca";

const VALID_FILE_TYPES = ["text/plain", "text/markdown"];

export default function Visor() {
  const [lletra, setLletra] = useState<string | undefined>(undefined);
  const [coneguts, setConeguts] = useState<AcordsDBList>({});

  const canviFitxer = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) {
      setLletra(undefined);
      return;
    }
    const fitxer = e.target.files[0];

    if (!VALID_FILE_TYPES.includes(fitxer.type)) {
      console.log(fitxer.type);
      setLletra(undefined);
      return;
    }
    const lector = new FileReader();
    lector.onload = (t) => {
      setLletra(t.target?.result as string);
    };

    lector.readAsText(fitxer);
  };

  useEffect(() => {
    cercaAcordsConeguts().then(setConeguts);
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Link href="/" className="noPrint">
        Inici
      </Link>
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-start py-16 px-16 bg-white dark:bg-black sm:items-start">
        <input
          type="file"
          onChange={canviFitxer}
          accept={VALID_FILE_TYPES.join(",")}
        />{" "}
        <br />
        {lletra ? (
          <AcordsCanco nom={"Local"} lletra={lletra} coneguts={coneguts} />
        ) : (
          <h2>No s'ha sel·leccionat cap cançó vàlida</h2>
        )}
      </main>
    </div>
  );
}

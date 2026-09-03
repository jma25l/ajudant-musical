"use client";
import AcordsCanco from "@/components/acords";
import { cercaAcords, cercaAcordsConeguts } from "@/lib/busca";
import { AcordsDBList } from "@/lib/tipus";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./estil.scss";

export default function Visor() {
  const { id_canco: nom } = useParams<{ id_canco: string }>();
  const [lletra, setLletra] = useState<string>("");
  const [coneguts, setConeguts] = useState<AcordsDBList>({});

  useEffect(() => {
    cercaAcordsConeguts().then(setConeguts);
    cercaAcords(nom).then(setLletra);
  }, [nom]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Link href="/" className="noPrint">
        Inici
      </Link>
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-start py-16 px-16 bg-white dark:bg-black sm:items-start">
        <AcordsCanco nom={nom} lletra={lletra} coneguts={coneguts} />
      </main>
    </div>
  );
}

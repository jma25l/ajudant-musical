"use client"

import Link from "next/link"
import { cercaAcordsConeguts } from "@/lib/busca";
import { FitxaAcord } from "@/components/fitxaAcord";
import { useState, useEffect } from "react";
import { AcordsDBList } from "@/lib/tipus";
import { fonamentals } from "@/lib/escales";

const families = ["X", "Xm", "X7"]


export default function Acordari() {
    const [coneguts, setConeguts] = useState<AcordsDBList>({});

    useEffect(() => {
        cercaAcordsConeguts().then(setConeguts);
    }, [])

    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <Link href="/">Inici</Link>

            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-start py-16 px-16 bg-white dark:bg-black sm:items-start">
                <table className="acordari" style={{ tableLayout: "auto" }}>
                    <tbody>
                        {
                            fonamentals.map(fon => (
                                <tr key={fon}>
                                    {families.map(fam => {
                                        let acord = fam.replace('X', fon);
                                        return (
                                            <td key={acord}>
                                                {coneguts[acord] ? (<FitxaAcord
                                                    coneguts={coneguts}
                                                    simplifica={false}
                                                    acord={acord}
                                                />) : <></>}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </main>
        </div>
    )
}
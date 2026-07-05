'use client'

import { useEffect, useState } from 'react';
import { cercaAcords, cercaAcordsConeguts } from '../lib/busca';
import { testAcords } from '@/lib/regex';
import { fonamentals, getFonamental } from '@/lib/escales';
import { AcordsDBList, detColorEstatAcord } from '@/lib/tipus';
import { FitxaAcord } from './fitxaAcord';
import Link from 'next/link';


interface AcordsProps {
    nom: string;
}

export default function AcordsCanco(props: AcordsProps) {
    const { nom } = props;

    const [lletra, setLletra] = useState<string[]>([]);
    const [coneguts, setConeguts] = useState<AcordsDBList>({});
    const [transposicio, setTransposicio] = useState<number>(0);
    const [nomesLletra, setNomesLletra] = useState<boolean>(false);
    const [llista, setLlista] = useState<string[]>([]);
    const [visiblePopup, setVisiblePopup] = useState<string | null>(null);
    const [visiblePopupPos, setVisiblePopupPos] = useState<DOMRect | null>(null);
    const [prims, setPrims] = useState<boolean>(true);

    function carrega(lletra: string) {
        if (lletra == "ERROR") {
            setLletra(["## Lletra no trobada"])
            return;
        }
        setLlista([]);
        setLletra(lletra.split(`\n`));
    }

    useEffect(() => void cercaAcordsConeguts().then(setConeguts), [])
    useEffect(() => void cercaAcords(nom).then(carrega), [nom]) //Tal i com està construit, nom tampoc hauria de canviar


    function preSetTransposicio(t: number) {
        if (Math.abs(t) > 12) return;
        setPrims(false);
        setTransposicio(t);

    }

    function checkAddLista(ac: string): void {
        if (!prims) return;
        if (llista.includes(ac)) return;
        setLlista([...llista, ac]);
    }


    function defvisiblePopup(str: string | null, visiblePopupPos: DOMRect) {
        setVisiblePopup(str);
        if (visiblePopupPos) setVisiblePopupPos(visiblePopupPos);
    }
    return (
        <>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                <button className="btn" style={{ backgroundColor: (nomesLletra ? "red" : "lightgreen"), width: "100px" }} onClick={() => setNomesLletra(!nomesLletra)}>Acords</button>
                <input style={{ textAlign: "center", display: (nomesLletra ? 'none' : 'inline') }} readOnly type="number" value={transposicio} />
                <button className="btn cA" style={{ display: (nomesLletra ? 'none' : 'inline') }} onClick={() => preSetTransposicio(transposicio - 1)}>-1</button>
                <button className="btn cA" style={{ display: (nomesLletra ? 'none' : 'inline') }} onClick={() => preSetTransposicio(transposicio + 1)}>+1</button>

            </div>
            <div className='flex-wrap' style={{ justifyContent: "space-around", display: (nomesLletra ? 'none' : 'flex') }} >
                {
                    llista?.map((x) => (
                        <FitxaAcord acord={x} key={x} coneguts={coneguts} transposa={transposicio} />
                    ))
                }
            </div>
            <div className="popup" style={{
                display: visiblePopup ? "block" : "none",
                position: "fixed",
                left: (visiblePopupPos?.x || 0) + 5 + 2 * (visiblePopupPos?.width || 0) / 3,
                top: (visiblePopupPos?.y || 0) - 10,
            }}>
                <FitxaAcord acord={visiblePopup || ""} coneguts={coneguts} transposa={transposicio} />
            </div>

            <div className='acords'>
                {lletra?.map((x, i) => (
                    <LineaAcords key={i} lletra={x} transposicio={transposicio} coneguts={coneguts} setVisiblePopup={defvisiblePopup} checkLlista={checkAddLista} nomesLletra={nomesLletra} />
                ))}
            </div>

        </>
    )
}


interface LineaAcordsProps {
    lletra: string;
    transposicio: number;
    coneguts: AcordsDBList;
    checkLlista: { (ac: string): void };
    nomesLletra: boolean;
    setVisiblePopup: { (str: string | null, visiblePopupPos: DOMRect): void };
}
function LineaAcords(props: LineaAcordsProps) {
    const { lletra, transposicio, nomesLletra } = props;
    //Veure si són títols
    if (lletra.startsWith('##')) return (<b>{lletra.slice(3)}</b>);  // 2 + espai en blanc
    if (lletra.startsWith('#')) {
        return (<h2>{lletra.slice(2)}</h2>); // 1 + --
    }
    if (lletra.startsWith("https://")) return <Link href={lletra}>{lletra}</Link>;

    //Veure si són acords o lletra
    const split = lletra.split(/[/\s]/g).filter(x => x);
    if (split.length == 0) return (<br></br>);
    let acords = true;
    let i = 0;
    let sep = false;
    while (acords && i < split.length && !sep) {
        const x = split[i];
        i++;
        if (/x[0-9]+/i.test(x)) continue;
        if (/\[[^\]]*\]/i.test(x)) {
            sep = true;
            continue;
        }
        if (testAcords(x)) continue;
        acords = false;
    }


    if (acords) {
        if (nomesLletra) return;
        return (
            <span>
                {lletra.split(/[/\s]/g).map((x, i) => {
                    if (x.length == 0) return (" ");
                    else if (testAcords(x)) return (<Acord key={i} original={x} transposicio={transposicio} checkLlista={props.checkLlista} setVisiblePopup={props.setVisiblePopup} coneguts={props.coneguts} />); // L'espai a la dreta és necessari
                    else return (x + " ")
                })}
            </span>

        )
    }

    return (
        <span>{lletra}</span>

    )
}

interface AcordProps {
    original: string;
    transposicio: number;
    coneguts: AcordsDBList;
    checkLlista: { (ac: string): void };
    setVisiblePopup: { (str: string | null, visiblePopupPos: DOMRect): void };

}


function Acord(props: AcordProps) {
    const { original, transposicio, } = props;
    const modificadors = original.replace(/^[A-G](#|b)?/, '');

    // MOLT BRUT
    const fonamental = getFonamental(original);
    const f = fonamentals[(fonamental + transposicio + 12) % 12];
    const acDisplay = f.slice(0, 1) +
        modificadors
        + (f.length == 2 ? "#" : "");
    const extraD = f.length === 2 ? "" : " ";
    const color = detColorEstatAcord(props.coneguts[acDisplay]?.estat);


    useEffect(() => {
        props.checkLlista(acDisplay);
    }, [acDisplay, props]);

    return (
        <><span className='acord' style={{ backgroundColor: color }}
            onMouseEnter={(e) =>
                props.setVisiblePopup(original, e.currentTarget.getBoundingClientRect())}
            onMouseLeave={(e) => props.setVisiblePopup(null, e.currentTarget.getBoundingClientRect())}
        >{acDisplay}</span>{extraD}
        </>
    );
}

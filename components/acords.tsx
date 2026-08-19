'use client'

import { useEffect, useState } from 'react';
import { testAcords } from '@/lib/regex';
import { fonamentals, getFonamental } from '@/lib/escales';
import { AcordsDBList, detColorEstatAcord } from '@/lib/tipus';
import { FitxaAcord } from './fitxaAcord';
import Link from 'next/link';
import { useAccioTeclat } from '@/hooks/keyHandler';
import { BlocRenderAcords, parseja } from '@/lib/parser';


interface AcordsProps {
    nom: string;
    lletra:string;
    coneguts:AcordsDBList;


}

export default function AcordsCanco(props: AcordsProps) {
    const {coneguts} = props;

    const lletra:BlocRenderAcords[] = parseja(props.lletra.split('\n'));
    const [transposicio, setTransposicio] = useState<number>(0);
    const [nomesLletra, setNomesLletra] = useState<boolean>(false);
    const [llista, setLlista] = useState<string[]>([]);
    const [visiblePopup, setVisiblePopup] = useState<string | null>(null);
    const [visiblePopupPos, setVisiblePopupPos] = useState<DOMRect | null>(null);
    const [prims, setPrims] = useState<boolean>(true);

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

    useAccioTeclat({
        tecla: "ArrowLeft", 
        premuda: ()=> preSetTransposicio(transposicio-1)
    })
    useAccioTeclat({
        tecla: "ArrowRight", 
        premuda: ()=> preSetTransposicio(transposicio+1)
    })


    function defvisiblePopup(str: string | null, visiblePopupPos: DOMRect) {
        setVisiblePopup(str);
        if (visiblePopupPos) setVisiblePopupPos(visiblePopupPos);
    }
    return (
        <>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                <button className="btn noPrint" style={{ backgroundColor: (nomesLletra ? "red" : "lightgreen"), width: "100px" }} onClick={() => setNomesLletra(!nomesLletra)}>Acords</button>
                <input style={{ textAlign: "center", display: (nomesLletra ? 'none' : 'inline') }} readOnly type="number" value={transposicio} />
                <div className="noPrint" style={{ display: (nomesLletra ? 'none' : undefined) }}>
                    <button className="btn cA" onClick={() => preSetTransposicio(transposicio-1)}>-1</button>
                    <button className="btn cA" onClick={() => preSetTransposicio(0)}>0</button>
                    <button className="btn cA" onClick={() => preSetTransposicio(transposicio+1)}>+1</button>
                </div>
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
                    <BlocAcords key={i} continguts={x} transposicio={transposicio} coneguts={coneguts} setVisiblePopup={defvisiblePopup} checkLlista={checkAddLista} nomesLletra={nomesLletra} />
                ))}
            </div>

        </>
    )
}


interface BlocAcordsProps {
    continguts: BlocRenderAcords;
    transposicio: number;
    coneguts: AcordsDBList;
    checkLlista: { (ac: string): void };
    nomesLletra: boolean;
    setVisiblePopup: { (str: string | null, visiblePopupPos: DOMRect): void };
}
function BlocAcords(props: BlocAcordsProps) {
    const { continguts, transposicio, nomesLletra } = props;
    //Veure si són títols

    const lletra = continguts.continguts;
    switch(continguts.tipus) {
        case 'lletra': return (<span>{lletra} </span>)
        case 'acords':
            if (nomesLletra) return;
            return (
                <span>
                    {lletra?.split(/[/\s]/g).map((x, i) => {
                        if (x.length == 0) return (" ");
                        else if (testAcords(x)) return (<Acord key={i} original={x} transposicio={transposicio} checkLlista={props.checkLlista} setVisiblePopup={props.setVisiblePopup} coneguts={props.coneguts} />); // L'espai a la dreta és necessari
                        else return (x + " ")
                    })}
                </span>
            )
        case 'titol': return (<h2>{lletra?.slice(2)}</h2>);
        case 'sotstitol': return (<b>{lletra?.slice(3)}</b>);
        case 'link': return (<Link href={lletra || ''}>{lletra}</Link>);
        case 'encaixat':
            return (<div className='encaixatAcords'>
                {continguts.fills?.map(
                    (x,i) => {
                        return (<BlocAcords key={i} continguts={x} transposicio={transposicio} coneguts={props.coneguts} setVisiblePopup={props.setVisiblePopup} checkLlista={props.checkLlista} nomesLletra={props.nomesLletra} />)
                    }
                )}
            </div>)
    }
    
}

interface AcordProps {
    original: string;
    transposicio: number;
    coneguts: AcordsDBList;
    checkLlista: { (ac: string): void };
    setVisiblePopup: { (str: string | null, visiblePopupPos: DOMRect): void };

}


function Acord(props: AcordProps) {
    const { original, transposicio,checkLlista } = props;
    const modificadors = original.replace(/^[A-G](#|b)?/, '');

    // MOLT BRUT
    const fonamental = getFonamental(original);
    const f = fonamentals[(fonamental + transposicio + 12) % 12];
    const acDisplay = f.slice(0, 1)
        + (f.length == 2 ? "#" : "")  
        + modificadors;
        
    const extraD = f.length === 2 ? "" : " ";
    const color = detColorEstatAcord(props.coneguts[acDisplay]?.estat);


    useEffect(() => {
        checkLlista(acDisplay);
    }, [acDisplay, checkLlista]);

    return (
        <><span className='acord' style={{ backgroundColor: color }}
            onMouseEnter={(e) =>
                props.setVisiblePopup(original, e.currentTarget.getBoundingClientRect())}
            onMouseLeave={(e) => props.setVisiblePopup(null, e.currentTarget.getBoundingClientRect())}
        >{acDisplay}</span>{extraD}
        </>
    );
}

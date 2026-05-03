'use client'

import { useEffect, useState } from 'react';
import {useParams} from 'next/navigation';
import {cercaAcords} from '../lib/busca';
import { text } from 'stream/consumers';
import { testAcords } from '@/lib/regex';

interface AcordsProps{
    nom:string;
}
export default function AcordsCanco(props:AcordsProps) {
    const {nom} = props;

    const [lletra, setLletra] = useState<string[]>([]);
    const [transposicio, setTransposicio] = useState<number>(0);

    async function carrega() {

        let lletra = await cercaAcords(nom);
        if(lletra == "ERROR") {
            setLletra(["## Lletra no trobada"])
            return;
        }
        setLletra(lletra.split(`\n`));
    }
    useEffect(()=>{
        carrega();
    }, [])


    return (
        <>
            <div className='acords'>
                {lletra?.map( (x, i)=> (
                    <LineaAcords key={i} lletra={x} transposicio={transposicio}/>
                ))}
            </div>
        </>
    )
}


interface LineaAcordsProps {
    lletra:string;
    transposicio:number;
}
export function LineaAcords(props:LineaAcordsProps) {
    var {lletra, transposicio} = props;
    //Veure si són títols
    if(lletra.startsWith('##')) return (<b>{lletra.slice(3)}</b>);  // 2 + espai en blanc
    if(lletra.startsWith('#')) return (<h2>{lletra.slice(2)}</h2>); // 1 + --

    //Veure si són acords o lletra
    var split = lletra.split(' ').filter(x=> x);
    if(split.length == 0) return (<br></br>);
    let acords = true;
    let i = 0;
    while(acords && i < split.length) {
        let x = split[i];
        i++;
        if(testAcords(x)) continue;
        if(/x[0-9]+/i.test(x)) continue;
        if(/\[[^\]]*\]/i.test(x)) continue;
        acords = false;
    }

    
    if(acords) {
        return (
        <span>
            {lletra.split(' ').map((x, i)=> {
                if(x.length == 0) return <> </>;
                else if(testAcords(x)) return (<Acord key={i} original={x} transposicio={transposicio}/>); // L'espai a la dreta és necessari
                else return (<>{x} </>)
            })}
        </span>

        )
    } 

    return (
        <span>{lletra}</span>
        
    )
}

interface AcordProps {
    original:string;
    transposicio:number;
}


export function Acord(props:AcordProps) {
    const {original, transposicio} = props;

    // MOLT BRUT
    let fonamental = -1;
    switch(original[0]) {
        case "C": fonamental = 0; break;
        case "D": fonamental = 2; break;
        case "E": fonamental = 4; break;
        case "F": fonamental = 5; break;
        case "G": fonamental = 7; break;
        case "A": fonamental = 9; break;
        case "B": fonamental = 11; break;
    }

    if(original.includes('#')) fonamental++;



    return (
        <><span className='acord'>{original}
        <div className='popup'>{fonamental} - {(fonamental+transposicio)%12}</div>
        </span> </>
    );
}
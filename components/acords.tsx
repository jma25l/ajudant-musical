'use client'

import { useEffect, useState } from 'react';
import {useParams} from 'next/navigation';
import {AcordsConeguts, cercaAcords, cercaAcordsConeguts} from '../lib/busca';
import { text } from 'stream/consumers';
import { testAcords } from '@/lib/regex';
import { fonamentals } from '@/lib/escales';

interface AcordsProps{
    nom:string;
}

function detColor(st:number) {
    switch(st) {
        case undefined: return "lightgray"; // No indexat
        case 2: return("red"); // Millor no intentar-lo
        case 1: return("lightgreen"); // Asolit
        case 0: return("yellow"); // En procés d'assoliment
    }
}
export default function AcordsCanco(props:AcordsProps) {
    const {nom} = props;

    const [lletra, setLletra] = useState<string[]>([]);
    const [coneguts, setConeguts] = useState<AcordsConeguts>({});
    const [transposicio, setTransposicio] = useState<number>(0);
    const [llista, setLlista] = useState<string[]>([]);
    let llistaTemp:string[] = [];

    async function carrega() {

        let lletra = await cercaAcords(nom);
        let coneguts = await cercaAcordsConeguts();
        if(lletra == "ERROR") {
            setLletra(["## Lletra no trobada"])
            return;
        }
        setConeguts(coneguts); 
        llistaTemp = [];
        setLletra(lletra.split(`\n`));
    }
    useEffect(()=>{
        carrega();
    }, [])

    function preSetTransposicio(t:number) {
        if(Math.abs(t)>12) return;
        llistaTemp = [];
        setTransposicio(t);

    }

    function checkAddLista(ac:string):void {
        if(llistaTemp.includes(ac)) return;
        llistaTemp.push(ac);
        setLlista(llistaTemp);
    }

    return (
        <>
            <div className='row'>
                <input style={{textAlign:"center"}}readOnly type="number" value={transposicio}/>
                <button className="btn cA" onClick={(e)=> preSetTransposicio(transposicio-1)}>-1</button>
                <button className="btn cA" onClick={(e)=> preSetTransposicio(transposicio+1)}>+1</button>

            </div>
            <div className='flex flex-wrap' style={{justifyContent:"space-around"}} >
                {
                    llista?.map((x)=> (
                        <div style={{textAlign:"center", width:"75px", margin:"10px", border:"black solid 1px", borderRadius:"5px", backgroundColor:detColor(coneguts[x])}} key={x}>{x}</div>
                    ))
                }
            </div>
            <div className='acords'>
                {lletra?.map( (x, i)=> (
                    <LineaAcords key={i} lletra={x} transposicio={transposicio} coneguts={coneguts} checkLlista={checkAddLista}/>
                ))}
            </div>
        </>
    )
}


interface LineaAcordsProps {
    lletra:string;
    transposicio:number;
    coneguts: AcordsConeguts;
    checkLlista: {(ac:string): void};
}
export function LineaAcords(props:LineaAcordsProps) {
    var {lletra, transposicio} = props;
    //Veure si són títols
    if(lletra.startsWith('##')) return (<b>{lletra.slice(3)}</b>);  // 2 + espai en blanc
    if(lletra.startsWith('#')) {
        document.title = lletra.slice(2); //Tècnica molt guarra
        return (<h2>{lletra.slice(2)}</h2>); // 1 + --
    }

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
                if(x.length == 0) return (" ");
                else if(testAcords(x)) return (<Acord key={i} original={x} transposicio={transposicio} checkLlista={props.checkLlista} coneguts={props.coneguts}/>); // L'espai a la dreta és necessari
                else return (x)
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
    coneguts: AcordsConeguts;
    checkLlista: {(ac:string): void};
}


export function Acord(props:AcordProps) {
    const {original, transposicio} = props;
    if(/\[[^\]]*\]/i.test(original)) return original;

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
    if(original.includes('b')) fonamental--;

    let modificadors = original.replace(/^[A-G](#|b)?/, '');
    const [acordDisplay, setAcDisplay] = useState<string>(original);
    const [extraD, setExtraD] = useState<string>("");
    const [color, setColor] = useState<string>("gray");

    var f = fonamentals[fonamental];
    function updateD(){
        f = fonamentals[(fonamental+transposicio+12)%12];
        let d = f.slice(0,1)+
            modificadors
            +(f.length==2?"#":"");

        setAcDisplay(
            d
            );
        props.checkLlista(d);
        setExtraD((f.length==2?"":" "))

        setColor(detColor(props.coneguts[d]))

    }
    useEffect(updateD, [transposicio])    

    return (
        <><span className='acord' style={{backgroundColor:color}}>{acordDisplay}
        <div className='popup'>{fonamental}<br/>{original}<br/>{modificadors}</div>
        </span>{extraD}</>
    );
}
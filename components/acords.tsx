'use client'

import { useEffect, useState } from 'react';
import {useParams} from 'next/navigation';
import {cercaAcords, cercaAcordsConeguts} from '../lib/busca';
import { text } from 'stream/consumers';
import { testAcords } from '@/lib/regex';
import { fonamentals } from '@/lib/escales';
import { AcordsDBList, detColorEstatAcord } from '@/lib/tipus';
import { FitxaAcord } from './dibuixAc';
import Link from 'next/link';

interface AcordsProps{
    nom:string;
}

export default function AcordsCanco(props:AcordsProps) {
    const {nom} = props;

    const [lletra, setLletra] = useState<string[]>([]);
    const [coneguts, setConeguts] = useState<AcordsDBList>({});
    const [transposicio, setTransposicio] = useState<number>(0);
    const [nomesLletra, setNomesLletra] = useState<boolean>(false);
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
            <div style={{display:'flex', flexWrap:'wrap', justifyContent:'space-around'}}>
                <button className="btn" style={{backgroundColor:(nomesLletra?"red":"lightgreen"), width:"100px"}} onClick={(e)=> setNomesLletra(!nomesLletra)}>Acords</button>
                <input style={{textAlign:"center", display:(nomesLletra?'none':'inline')}} readOnly type="number" value={transposicio}/>
                <button className="btn cA" style={{display:(nomesLletra?'none':'inline')}} onClick={(e)=> preSetTransposicio(transposicio-1)}>-1</button>
                <button className="btn cA" style={{display:(nomesLletra?'none':'inline')}} onClick={(e)=> preSetTransposicio(transposicio+1)}>+1</button>

            </div>
            <div className='flex-wrap' style={{justifyContent:"space-around", display:(nomesLletra?'none':'flex')}} >
                {
                    llista?.map((x)=> (
                        <FitxaAcord acord={x} key={x} coneguts={coneguts}/>
                    ))
                }
            </div>
            <div className='acords'>
                {lletra?.map( (x, i)=> (
                    <LineaAcords key={i} lletra={x} transposicio={transposicio} coneguts={coneguts} checkLlista={checkAddLista} nomesLletra={nomesLletra}/>
                ))}
            </div>
        </>
    )
}


interface LineaAcordsProps {
    lletra:string;
    transposicio:number;
    coneguts: AcordsDBList;
    checkLlista: {(ac:string): void};
    nomesLletra:boolean
}
export function LineaAcords(props:LineaAcordsProps) {
    var {lletra, transposicio, nomesLletra} = props;
    //Veure si són títols
    if(lletra.startsWith('##')) return (<b>{lletra.slice(3)}</b>);  // 2 + espai en blanc
    if(lletra.startsWith('#')) {
        document.title = lletra.slice(2); //Tècnica molt guarra
        return (<h2>{lletra.slice(2)}</h2>); // 1 + --
    }
    if(lletra.startsWith("https://")) return <Link href={lletra}>{lletra}</Link>;

    //Veure si són acords o lletra
    var split = lletra.split(/[/\s]/g).filter(x=> x);
    if(split.length == 0) return (<br></br>);
    let acords = true;
    let i = 0;
    let sep = false;
    while(acords && i < split.length && !sep) {
        let x = split[i];
        i++;
        if(/x[0-9]+/i.test(x)) continue;
        if(/\[[^\]]*\]/i.test(x)) {
            sep = true;
            continue;
        }
        if(testAcords(x)) continue;
        acords = false;
    }

    
    if(acords) {
        if(nomesLletra) return;
        return (
        <span>
            {lletra.split(/[/\s]/g).map((x, i)=> {
                if(x.length == 0) return (" ");
                else if(testAcords(x)) return (<Acord key={i} original={x} transposicio={transposicio} checkLlista={props.checkLlista} coneguts={props.coneguts}/>); // L'espai a la dreta és necessari
                else return (x+" ")
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
    coneguts: AcordsDBList;
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
        setColor(detColorEstatAcord(props.coneguts[d]?.estat))

    }
    useEffect(updateD, [transposicio])    

    return (
        <><span className='acord' style={{backgroundColor:color}}>{acordDisplay}
        <div className='popup'> <FitxaAcord acord={acordDisplay} coneguts={props.coneguts} popup={true}/>
</div>
        </span>
        </>
    );
}

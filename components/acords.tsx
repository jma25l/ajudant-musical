'use client'

import { useState } from 'react';
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

    async function carrega() {

        let lletra = await cercaAcords(nom);

        setLletra(lletra.split(`\n`));
    }
    carrega()


    return (
        <>
            <div className='acords'>
                {lletra?.map( (x, i)=> (
                    <LineaAcords key={i} lletra={x} />
                ))}
            </div>
        </>
    )
}


interface LineaAcordsProps {
    lletra:string;
}
export function LineaAcords(props:LineaAcordsProps) {
    var {lletra} = props;
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
        <span style={{color:'red'}}>
            {lletra.split(' ').map((x, i)=> {
                if(x.length == 0) return <> </>;
                else if(testAcords(x)) return (<Acord key={i} original={x}/>); // L'espai a la dreta és necessari
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
}

export function Acord(props:AcordProps) {
    const {original} = props;

    return (
        <><span className='acord'>{original}</span> </>
    );
}
'use client'

import { fonamentals, getFonamental } from "@/lib/escales";
import { AcordDB, AcordsDBList, detColorEstatAcord } from "@/lib/tipus";
import Image from "next/image";
import { CSSProperties } from "react";

interface FitxaAcordProps{
    coneguts:AcordsDBList;
    acord:string;
    popup?:boolean;
    transposa?:number;
}


export function FitxaAcord(props:FitxaAcordProps) {
    const {acord} = props;
    const transposa = props.transposa??0;
    const modificadors = acord.replace(/^[A-G](#|b)?/, '');

    // MOLT BRUT
    const fonamental = getFonamental(acord);
    const f = fonamentals[(fonamental+transposa+12)%12];
    const acDisplay  = f.slice(0,1)+
        modificadors
        +(f.length==2?"#":"");

    const fitxa:AcordDB = props.coneguts[acDisplay];


    if(fitxa) {
        const style:CSSProperties = {backgroundColor:detColorEstatAcord(fitxa.estat)};
        if(props.popup) {
            style.width = "100%";
            style.height = "100%";
        }
        const acordNet = acDisplay.replace('#', 'h');
        return (<div style={style} className="fitxaAcord">
            <Image width={150} height={200} alt={acordNet} src={"/diagrames/"+acordNet+".png"}/>
        </div>);
    }
    
    return (
        <div className="fitxaAcord desconegut" >
            <big>?</big>
            <span>{acDisplay}</span>
        </div>);    
}
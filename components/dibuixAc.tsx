'use client'

import { AcordDB, AcordsDBList, detColorEstatAcord } from "@/lib/tipus";
import Image from "next/image";
import { CSSProperties } from "react";

interface FitxaAcordProps{
    coneguts:AcordsDBList;
    acord:string;
    popup?:boolean;
}


export function FitxaAcord(props:FitxaAcordProps) {
    const {acord} = props;
    const fitxa:AcordDB = props.coneguts[acord];
    
    if(fitxa) {
        const style:CSSProperties = {backgroundColor:detColorEstatAcord(fitxa.estat)};
        if(props.popup) {
            style.width = "100%";
            style.height = "100%";
        }
        const acordNet = acord.replace('#', 'h');
        return (<div style={style} className="fitxaAcord">
            <Image width={150} height={200} alt={acordNet} src={"/diagrames/"+acordNet+".png"}/>
        </div>);
    }
    
    return (
        <div className="fitxaAcord desconegut">
            <big>?</big>
            <span>{acord}</span>
        </div>);    
}
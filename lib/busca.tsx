'use client'

import {parse as yamlParse} from "yaml"
import { AcordDB, AcordsApiInterface, AcordsDBList, Canco, CanconerApiInterface } from "./tipus";

export async function cercaAcords(nom:string):Promise<string> {
    try {
        let q = await fetch(`/test/${nom}.md`);
        if(!q.ok) return "ERROR";
        return q.text();
    } catch (error:any) {
        if(error instanceof Error) {
            return error.message;
        }
        return "ERROR";
    }
    
}

export async function cercaCanconer():Promise<Canco[]> {
    try {
        let q = await fetch(`/test/index.yml`);
        if(!q.ok) return [];
        let t = await q.text();
        let d = yamlParse(t) as CanconerApiInterface;

        return d.cancons;
    } catch (error) {
        console.error(error);
        return [];
    }
}


export async function cercaAcordsConeguts():Promise<AcordsDBList> {
    try {
        let q = await fetch(`/test/acords.yml`);
        if(!q.ok) return {};
        let t = await q.text();
        let d = yamlParse(t) as AcordsApiInterface;
        return d.coneguts;
    } catch (error) {
        console.error(error);
        return {};
    }
}
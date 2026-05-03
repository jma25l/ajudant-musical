'use client'

import {parse as yamlParse} from "yaml"

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

export interface Canco {
    id:string;
    nom:string;
}

export interface CanconerApiInterface {
    cancons: Canco[];
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
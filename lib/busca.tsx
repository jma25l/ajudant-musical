'use server'
import {parse as yamlParse} from "yaml"
import { AcordsApiInterface, AcordsDBList, Canco, CanconerApiInterface } from "./tipus";
import { readFile } from "fs/promises";

export async function cercaAcords(nom:string):Promise<string> {
    try {
        const q = await readFile(`./data/${nom}.md`);
        return q.toString()
    } catch (error) {
        if(error instanceof Error) {
            return error.message;
        }
        return "ERROR";
    }
    
}

export async function cercaCanconer():Promise<Canco[]> {
    try {
        const q = await readFile(`./data/index.yml`);
        const t = q.toString();
        const d = yamlParse(t) as CanconerApiInterface;

        return d.cancons;
    } catch (error) {
        console.error(error);
        return [];
    }
}


export async function cercaAcordsConeguts():Promise<AcordsDBList> {
    try {
        const q = await readFile(`./data/acords.yml`);
        const t = await q.toString();
        const d = yamlParse(t) as AcordsApiInterface;
        return d.coneguts;
    } catch (error) {
        console.error(error);
        return {};
    }
}
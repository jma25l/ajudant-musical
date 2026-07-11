'use server'
import {parse as yamlParse} from "yaml"
import { AcordsApiInterface, AcordsDBList, Canco, CanconerApiInterface } from "./tipus";
import { readFile, access} from "fs/promises";

export async function cercaAcords(nom:string):Promise<string> {
    try {
        let p:string|undefined = undefined;
        if(await checkExists(`./data/${nom}.md`)) p = `./data/${nom}.md`;
        else if(process.env.EXTRA_DATA && await checkExists(`${process.env.EXTRA_DATA}/${nom}.md`)) 
            p = `${process.env.EXTRA_DATA}/${nom}.md`;

        if(!p) return "ERROR"
        const q = await readFile(p);
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

        if(process.env.EXTRA_DATA && await checkExists(`${process.env.EXTRA_DATA}/index.yml`)) {
            const qE = await readFile(`${process.env.EXTRA_DATA}/index.yml`);
            const tE = qE.toString();
            const dE = yamlParse(tE) as CanconerApiInterface;
            d.cancons = [...d.cancons, ...dE.cancons]
        }
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

        if(process.env.EXTRA_DATA && await checkExists(`${process.env.EXTRA_DATA}/acords.yml`)) {
            const qE = await readFile(`${process.env.EXTRA_DATA}/acords.yml`);
            const tE = await qE.toString();
            const dE = yamlParse(tE) as AcordsApiInterface;

            Object.entries(dE.coneguts).forEach(([k,v])=>{
                if(!d.coneguts[k]) d.coneguts[k] = v;
                else d.coneguts[k] = {...d.coneguts[k], ...v}
            });

        }
        return d.coneguts;
    } catch (error) {
        console.error(error);
        return {};
    }
}

async function checkExists(filePath:string):Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}
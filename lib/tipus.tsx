export interface Canco {
    id:string;
    nom:string;
}

export interface CanconerApiInterface {
    cancons: Canco[];
}

export interface AcordDB {
    estat?:number
    ukelele?:number[]
}

export type AcordsDBList = Record<string, AcordDB>;

export interface AcordsApiInterface{
    coneguts: AcordsDBList;
}

export function detColorEstatAcord(st:number|undefined):string{
    switch(st) {
        case 2: return("red"); // Millor no intentar-lo
        case 1: return("lightgreen"); // Asolit
        case 0: return("yellow"); // En procés d'assoliment
        default: return "lightgray"; // No indexat
    }
}
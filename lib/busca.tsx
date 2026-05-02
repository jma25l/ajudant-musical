'use client'

export async function cercaAcords(nom:string):Promise<string> {
    try {
        let q = await fetch(`/test/${nom}.md`);
        if(!q.ok) return "ERROR";
        return q.text();
    } catch (error) {
        console.error(error);
        return "ERROR";
    }
    
}
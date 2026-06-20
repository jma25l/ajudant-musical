import { AcordDB, AcordsDBList, detColorEstatAcord } from "@/lib/tipus";

interface FitxaAcordProps{
    coneguts:AcordsDBList;
    acord:string;
}


export function FitxaAcord(props:FitxaAcordProps) {
    const {acord} = props;
    let fitxa:AcordDB = {};
    if(props.coneguts[acord]) fitxa = props.coneguts[acord];
    const uk = fitxa.ukelele?.toReversed();
    
    return (
        <div style={{textAlign:"center", width:"75px", margin:"10px", border:"black solid 1px", borderRadius:"5px", backgroundColor:detColorEstatAcord(fitxa.estat)}}>
            <span>{acord}</span>
            <br/>
            <div>
            {uk}
            </div>
        </div>)
}
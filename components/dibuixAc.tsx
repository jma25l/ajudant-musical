import { AcordDB, AcordsDBList, detColorEstatAcord } from "@/lib/tipus";

interface FitxaAcordProps{
    coneguts:AcordsDBList;
    acord:string;
    popup?:boolean;
}


export function FitxaAcord(props:FitxaAcordProps) {
    const {acord} = props;
    let fitxa:AcordDB = {};
    if(props.coneguts[acord]) fitxa = props.coneguts[acord];
    
    let style:any = {textAlign:"center", width:"75px", margin:"10px", border:"black solid 1px", borderRadius:"5px", backgroundColor:detColorEstatAcord(fitxa.estat)};
    if(props.popup) {
        style.width = "100%";
        style.height = "100%";
    }

    return (
        <div style={style}>
            <span>{acord}</span>
            <br/>
            <div>
            {fitxa.ukelele?.join(' ')}
            </div>
        </div>)
}
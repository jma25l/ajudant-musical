import { AcordDB, AcordsDBList, detColorEstatAcord } from "@/lib/tipus";

interface FitxaAcordProps{
    coneguts:AcordsDBList;
    acord:string;
    popup?:boolean;
}


export function FitxaAcord(props:FitxaAcordProps) {
    const {acord} = props;
    let fitxa:AcordDB = props.coneguts[acord];
    
    if(fitxa) {
        let style:any = {backgroundColor:detColorEstatAcord(fitxa.estat)};
        if(props.popup) {
            style.width = "100%";
            style.height = "100%";
        }
        const acordNet = acord.replace('#', 'h');
        return (<div style={style} className="fitxaAcord">
            <img src={"/diagrames/"+acordNet+".png"}/>
        </div>);
    }
    
    return (
        <div className="fitxaAcord desconegut">
            <big>?</big>
            <span>{acord}</span>
        </div>);    
}
// https://dev.to/barrymichaeldoyle/how-to-build-a-custom-react-hook-to-listen-for-keyboard-events-32b4
import { useEffect } from "react";

interface accioTeclatProps {
    tecla:string; // Potser ho podria millorar
    premuda: () => boolean|void; //Mantenir la opció de preventsDefault, si la vull 
}

export function useAccioTeclat({tecla, premuda}: accioTeclatProps) {
    useEffect( ()=> {
        function keyDownHandler(e:globalThis.KeyboardEvent) {
            //console.log(e.key);
            if(e.key == tecla) {
                if(premuda()) e.preventDefault();
            }
        }
        document.addEventListener("keydown", keyDownHandler);
        return ()=> {
            document.removeEventListener("keydown", keyDownHandler);
        }
    }, [premuda, tecla]);

}
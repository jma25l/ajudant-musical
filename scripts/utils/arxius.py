from pathlib import Path
import yaml


def pP()->Path: 
    """Ruta al directori public"""
    return Path(__file__).absolute().parent/"../../public/"

def pD()->Path: 
    """Ruta segura al directori data"""
    print(Path(__file__).absolute().parent/'..')
    return Path(__file__).absolute().parent/"../../data/"

def llegeixAcords(): 
    """Llegeix el arxiu amb la informació dels acords"""
    with open(pD()/"acords.yml", 'r') as arxiu: 
        acords = yaml.safe_load(arxiu) # TODO: Veure si puc redirigir-ho a una classe
        return acords
    
def escriuAcords(cnt)->None: 
    """Actualitza el arxiu amb la informació dels acords"""
    with open(pD()/"acords.yml", "w") as f:
        f.write(cnt)
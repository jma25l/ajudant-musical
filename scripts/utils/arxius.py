import os
from pathlib import Path
import yaml

from dotenv import load_dotenv
load_dotenv()


def pP()->Path: 
    """Ruta al directori public"""
    return Path(__file__).absolute().parent/"../../public/"

def pD()->Path: 
    """Ruta segura al directori data"""
    print(Path(__file__).absolute().parent/'..')
    return Path(__file__).absolute().parent/"../../data/"

def llegeixAcords(env=False): 
    """Llegeix el arxiu amb la informació dels acords"""
    path = pD()
    if env and os.getenv('EXTRA_DATA') is not None: path = Path(os.getenv('EXTRA_DATA')).resolve()
    with open(path/"acords.yml", 'r') as arxiu: 
        acords = yaml.safe_load(arxiu) # TODO: Veure si puc redirigir-ho a una classe
        return acords
    
def escriuAcords(cnt, env=True)->None: 
    """Actualitza el arxiu amb la informació dels acords"""
    path = pD()
    if env and os.getenv('EXTRA_DATA') is not None: path = Path(os.getenv('EXTRA_DATA')).resolve()
    with open(path/"acords.yml", "w") as f:
        f.write(cnt)
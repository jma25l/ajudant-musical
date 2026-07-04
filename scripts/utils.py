import os
import yaml


def pP()->str: 
    """Ruta al directori public"""
    return os.path.dirname(__file__)+"/../public/"

def pD()->str: 
    """Ruta segura al directori data"""
    return os.path.dirname(__file__)+"/../data/"

def llegeixAcords(): 
    """Llegeix el arxiu amb la informació dels acords"""
    with open(pD()+"acords.yml", 'r') as arxiu: 
        acords = yaml.safe_load(arxiu)
        return acords
    
def escriuAcords(cnt)->None: 
    """Actualitza el arxiu amb la informació dels acords"""
    with open(pD()+"acords.yml", "w") as f:
        f.write(cnt)
import os
import yaml

def pP(): 
    return os.path.dirname(__file__)+"/../public/"

def llegeixAcords(): 
    with open(pP()+"test/acords.yml", 'r') as arxiu: 
        acords = yaml.safe_load(arxiu)
        return acords
    
def escriuAcords(cnt): 
    with open(pP()+"test/acords.yml", "w") as f:
        f.write(cnt)
# Script que endreça l'arxiu acords.yml alfabèticament per a que no hagi de pensar gaire. 
from utils.arxius import *

import yaml


# Dins de cada fitxa, ordenar alfabèticament, potser seria millor fixar algun altre ordre més natural. 
def inSort(acord): 
    return {k:v for k,v in sorted(acord.items(), key=lambda item: item[0])}

for entorn in [True, False]:
    acords = llegeixAcords(entorn)
    acords["coneguts"] = {k: inSort(v) for k, v in sorted(acords["coneguts"].items(), key=lambda item: item[0])}

    escriuAcords(yaml.safe_dump(acords, default_flow_style=False if entorn else None), entorn)
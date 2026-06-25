# Script que endreça l'arxiu acords.yml alfabèticament per a que no hagi de pensar gaire. 
from utils import *
acords = llegeixAcords()
acords["coneguts"] = {k: v for k, v in sorted(acords["coneguts"].items(), key=lambda item: item[0])}
escriuAcords(yaml.safe_dump(acords, default_flow_style=None))
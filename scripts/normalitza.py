from utils.arxius import *

CANVIS = {
    "DO": "C",
    "RE": "D",
    "MI": "E",
    "FA": "F",
    "SOL": "G",
    "LA": "A",
    "SI": "B",
}


codi = input("Digues l'id/ruta a normalitzar - passar a notació americana: ")
if Path(codi).exists(): path = Path(codi)
else: path = pD()/str("/"+codi+".md")

acords = ""
with open(path, 'r') as arxiu: 
    acords = arxiu.read()

def totesVariants(acords, k, v): 
    acords = acords.replace(" "+k+"m ", " "+v+"m"+(" "*len(k)))
    acords = acords.replace(" "+k+" ", " "+v+(" "*len(k)))
    acords = acords.replace("\n"+k+"m ", "\n"+v+"m"+(" "*len(k)))
    acords = acords.replace("\n"+k+" ", "\n"+v+(" "*len(k)))
    acords = acords.replace(" "+k+"m\n", " "+v+"m"+"\n")
    acords = acords.replace(" "+k+"\n", " "+v+"\n")
    return acords

for (k, v) in CANVIS.items(): 
    acords = totesVariants(acords, k, v)
    acords = totesVariants(acords, k.upper(), v)
    acords = totesVariants(acords, k.lower(), v)

#print(acords)
with open(path, 'w') as arxiu: 
    arxiu.write(acords)
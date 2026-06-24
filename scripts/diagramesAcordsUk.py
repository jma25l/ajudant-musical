from PIL import Image, ImageDraw, ImageFont
import yaml
import os
#Funcions i variables auxiliars que si no empro ara, les empraré
publicPath = os.path.dirname(__file__)+"/../public/"
def rect(dib, x1, y1, x2, y2, col):
    dib.polygon([(x1, y1), (x2, y1), (x2, y2), (x1, y2)], col)
def cercle(dib, p, r, c): 
    (x,y) = p
    dib.ellipse([(x-r, y-r), (x+r, y+r)], c)

# Lectura de l'arxiu de dades: 
print(publicPath)
with open(publicPath+"test/acords.yml", 'r') as arxiu: 
    acords = yaml.safe_load(arxiu)["coneguts"]

# Iterar entre els acords i generar les imatges
for k in acords: 
    v = acords[k]
    img = Image.new('RGBA', (150, 200))
    dib = ImageDraw.Draw(img)

    #Nom de l'acord
    font = ImageFont.truetype("arial.ttf", 40)
    dib.text((75, 75), ' '.join(str(x) for x in v["ukelele"]), font=font, anchor="mm", fill="black")
    rect(dib, 0, 150, 150, 220, 'lightgray')
    dib.text((75, 175), k, font=font, anchor="mm", fill="black")
    kNet = k.replace('#', 'h')
    img.save(publicPath+"/diagrames/"+kNet+".png")
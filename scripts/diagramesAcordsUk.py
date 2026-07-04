from PIL import Image, ImageDraw, ImageFont
from utils import *

#Funcions i variables auxiliars que si no empro ara, les empraré
publicPath = pP()
def rect(dib:ImageDraw.ImageDraw, x1:int, y1:int, x2:int, y2:int, col)->None:
    """Dibuixa un rectangle de diagonal (x1,y1) -- (x2,y2) i color col"""
    dib.polygon([(x1, y1), (x2, y1), (x2, y2), (x1, y2)], col)

def cercle(dib:ImageDraw.ImageDraw, p:tuple[int, int], r:int, c)->None: 
    """Dibuixa un centre p=(x,y), radi r i color col"""
    (x,y) = p
    dib.ellipse([(x-r, y-r), (x+r, y+r)], c)

# Lectura de l'arxiu de dades: 
print(publicPath)
acords = llegeixAcords()["coneguts"]

# Iterar entre els acords i generar les imatges
for k in acords: 
    v = acords[k]
    img = Image.new('RGBA', (150, 200))
    dib = ImageDraw.Draw(img)

    #Nom de l'acord
    font = ImageFont.truetype("arial.ttf", 30)

    #Trastes 
    for j in range(6): 
        rect(dib, 29, 39+21*j, 121, 41+21*j, 'darkgray')
    for i in range(4): 
        I = i+1
        t:int = v["ukelele"][i]
        st = str(t)
        #Cordes
        rect(dib, I*30-1, 40, I*30+1, 145, 'darkgray')
        if t > 0: 
            cercle(dib, (I*30, t*21+30), 5, 'black')
        elif t == -1: 
            st = 'X'
        dib.text((I*30, 20), st, font=font, anchor="mm", fill="black")

    #dib.text((75, 75), ' '.join(str(x) for x in v["ukelele"]), font=font, anchor="mm", fill="black")
    rect(dib, 0, 150, 150, 220, 'lightgray')
    dib.text((75, 175), k, font=font, anchor="mm", fill="black")
    kNet = k.replace('#', 'h')
    img.save(publicPath+"/diagrames/"+kNet+".png")
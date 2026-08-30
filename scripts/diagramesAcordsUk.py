from PIL import Image, ImageDraw, ImageFont
from utils.arxius import *
from utils.dibuixos import *

#Funcions i variables auxiliars que si no empro ara, les empraré
publicPath = pP()


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
    kNet = k.replace('#', 'h') # Broma tonta, # no vol dir h(ashtag), però em serveix per a que fs no peti
    img.save(publicPath/str("diagrames/"+kNet+".png"))
        #Parsejo a string per a que no em faci coses rares el mypy.
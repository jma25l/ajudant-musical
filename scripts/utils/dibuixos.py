from PIL import Image, ImageDraw, ImageFont


def rect(dib:ImageDraw.ImageDraw, x1:int, y1:int, x2:int, y2:int, col)->None:
    """Dibuixa un rectangle de diagonal (x1,y1) -- (x2,y2) i color col"""
    dib.polygon([(x1, y1), (x2, y1), (x2, y2), (x1, y2)], col)

def cercle(dib:ImageDraw.ImageDraw, p:tuple[int, int], r:int, c)->None: 
    """Dibuixa un centre p=(x,y), radi r i color col"""
    (x,y) = p
    dib.ellipse([(x-r, y-r), (x+r, y+r)], c)
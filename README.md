![demo1](docs/img/demo1.png)

# Ajudant musical (nom temporal)
Aquesta aplicació neix amb un objectiu força simple. És útil tenir tots els acords de les cançons que un toca *(en el meu cas, de forma més que amateur)*, i algunes eines addicionals. Tanmateix, l'aplicació que vaig trobar i que segurament és de les més importants mundialment té diversos problemes. En primer lloc, que quan passes un temps sense obrir-la, et comença a bombardejar amb missatges sobre les subscripcions de pagament, que gairebé et surt més a compte anar a buscar les 7 boles de drac que tancar-los un per un. La versió de pagament també té alguna de les funcionalitats importants. Un també troba l'extrem contrari, webs on hi ha acords sense cap mena de formatació ni eina addicional. 

Amb tot això, un comença a pensar i es planteja si hi hauria alguna alternativa millor, i em vaig dir: "Si vols alguna cosa ben feta, fes-la tu". 

## Estructura tècnica
De moment, els arxius importants es troben al directori `public/test/`. Aquí hi ha diversos arxius: 
- acords.yml: Inclou la informació sobre quins acords sé fer per mostrar-los de colors i identificar com de factible serà provar una cançó. També conté informació tècnica dels acords.
- index.yml, un arxiu que serveix d'índex per a poder veure ràpidament quines cançons tinc i en un futur poder classificar-les: 
```markdown 
cancons: 
  - id: far
    nom: El Far del Sud
  - id: monde
    nom: Un monde sans danger
```
- Les cançons han d'estar en arxius anomenats `<id>.md`, en un format força compatible a Markdown (#/## per a títols, https per a enllaços). A grosso modo, es divideix en files d'acords i files de text. És important que als ponts instrumentals hi hagi dos espais entre els acords, no un, perquè hi hagi lloc per a posar els sostinguts en trasposar sense que s'enganxi tot. `G  D  C  G  x2`


## Requisits python
PIL (pillow), pyyaml

*(c) Joaquín Millán Aldaz (2026)*
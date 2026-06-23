# Ajudant musical (nom temporal)
Aquesta aplicació neix amb un objectiu força simple. És útil tenir tots els acords de les cançons que un toca *(en el meu cas, de forma més que amateur)*, i algunes eines adicionals. Tanmateix, l'aplicació que vaig trobar i que segurament és de les més importants a nivell mundial té diversos problemes. En primer lloc, que quan passes un temps sense obrir-la, et comença a bombardejar amb missatges sobre les suscripcions de pagament, que gairebé et surt a compte anar a buscar les 7 boles de drac més que tancar-los. A més, unes quantes de les funcionalitats estan només a la versió de pagament. Un també troba l'extrem contrari, webs on hi ha acords sense cap mena de formatat ni eina addicional. 

Amb tot això, un comença a pensar i es planteja si hi hauria alguna alternativa millor, i en vaig dir: "Si vols alguna cosa ben feta, fes-la tu". És el que vaig fer. 

## Estructura técnica
De moment, els arxius importants (les cançons) es troben al directori `public/test/`. Aquí hi ha diversos arxius: 
- acords.yml: Inclou la informació sobre quins acords sé fer per mostrar-los de colors i identificar com de factible serà provar una cançó.
- index.yml, un arxiu que serveix d'índex per a poder veure ràpidament quines cançons tinc i en un futur poder classificar-les: 
```markdown 
cancons: 
  - id: far
    nom: El Far del Sud
  - id: monde
    nom: Un monde sans danger
```
- Les cançons, en arxius anomenats `<id>.yml`, en un format força compatible a Markdown (#, ## títols, accepta https). Divideixen en files d'acords i files de text. És important que les files de ponts instrumentals, hi hagi dos espais entre els acords, no un, per a que hi hagi lloc per a posar els sostinguts en trasposar. `G  D  C  G  x2`


*(c) Joaquín Millán Aldaz (2026)*
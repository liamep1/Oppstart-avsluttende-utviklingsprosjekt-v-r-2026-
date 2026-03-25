# Ide: EventLine

## Kort om ideen

Jeg vil lage en webapp der brukeren kan lage flere tidslinjer og legge inn hendelser i dem.

Brukeren skal kunne skrive inn informasjon om en hendelse og tidspungt i et skjema, og etterpå blir hendelsen plassert på riktig sted i tidslinjen ut fra dato.

Brukeren skal også kunne gi navn til tidslinjen de lager, slik at de kan ha flere ulike tidslinjer, for eksempel en om familie og minner, og en annen om historiequiz.

## Hva brukeren skal kunne gjøre

Brukeren skal kunne:

- lage en ny tidslinje
- gi navn til en tidslinje
- legge til en ny hendelse
- se alle hendelser i en tidslinje
- trykke på en hendelse for å lese mer
- redigere en hendelse
- slette en hendelse

## Informasjon som skal fylles inn

Når brukeren lager en tidslinje, skal brukeren fylle inn:

- navn på tidslinjen

Når brukeren lager en hendelse, skal brukeren fylle inn:

- navn på hendelse
- beskrivelse
- dato
- årstid
- kategori

## Hvordan appen skal fungere

Når en hendelse blir lagt til, skal den vises i den valgte tidslinjen fra venstre til høyre som avrunde firkanter bortover.
Hendelsene skal vises i rekkefølge utifra dato.
Når brukeren trykker på en hendelse, skal det komme opp beskrivelse av hendelse.

Brukeren skal kunne ha flere tidslinjer og velge hvilken tidslinje de vil se på eller legge inn hendelser i.

## Ekstra hvis jeg får tid

Jeg vil også prøve å lage en spilldel.

Der skal brukeren kunne trykke på **Spill** og få opp en og en hendelse fra den valgte tidslinjen.

Spillet starter med at en tilfeldig hendelse allerede er plassert på tidslinjen.

Etter det får brukeren opp en ny hendelse om gangen, uten dato, og må velge om hendelsen skjedde **før** eller **etter** hendelsen som allerede er plassert.

Hvis brukeren svarer riktig, blir hendelsen plassert på riktig sted i tidslinjen.

Etter hvert som flere hendelser kommer inn på tidslinjen, blir spillet vanskeligere, fordi brukeren må være mer nøyaktig for å plassere nye hendelser riktig mellom de andre.

Datoene skal være skjult hele tiden, og målet er å plassere alle hendelsene riktig på tidslinjen.

### Regler i spillet

**Hvis brukeren plasserer feil:**

- brukeren får 1 minuspoeng
- hendelsen flytter seg til riktig plass
- boksen blir rød

**Hvis brukeren plasserer riktig:**

- brukeren får 1 poeng
- hendelsen blir stående
- boksen blir grønn

**Når spillet er ferdig, skal brukeren få opp:**

- hvor mange riktige svar
- hvor mange feil svar
- hvilke hendelser som var riktige
- hvilke hendelser som var feil

## Denne nettsiden skal være for

- **Minner**
    - holde oversikt over ting brukeren har gjort i livet
    - legge til nye minner

- **Hukommelse**
    - hjelpe brukeren med å huske tilbake på viktige hendelser og opplevelser

- **Læring og quiz**
    - lage historiequizzer
    - legge inn historiske hendelser, kriger og viktige datoer

- **Konkurranse**
    - utfordre venner eller seg selv
    - prøve å få flest mulig riktige svar i spillet

- **Flere tidslinjer**
    - lage egne tidslinjer med ulike navn
    - ha en tidslinje for familie og minner
    - ha en annen tidslinje for historiequiz og læring

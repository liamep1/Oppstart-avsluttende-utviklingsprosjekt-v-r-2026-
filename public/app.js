// viser alle tidslinjene på forsiden, og legger til en knapp for å åpne hver tidslinje
const tekst = document.getElementById("tekst");
const tidslinjelisten = document.getElementById("tidslinjer");

start();

async function start() {
    const svar = await fetch("/api/tidslinjer");
    const tidslinjer = await svar.json();

    for (const tidslinje of tidslinjer) {
        const li = document.createElement("li");
        const kort = document.createElement("div");
        const navn = document.createElement("h3");
        const id = document.createElement("p");
        const brukerId = document.createElement("p");
        const brukernavn = document.createElement("p");
        const synlighet = document.createElement("p");
        const opprettetDato = document.createElement("p");
        const knapp = document.createElement("a");

        kort.className = "hendelse-kort";
        navn.textContent = tidslinje.navn;
        id.textContent = `Tidslinje-id: ${tidslinje.id}`;
        brukerId.textContent = `Bruker-id: ${tidslinje.bruker_id}`;
        brukernavn.textContent = `Laget av: ${tidslinje.brukernavn}`;
        synlighet.textContent = `Synlighet: ${tidslinje.synlighet}`;
        opprettetDato.textContent = `Opprettet: ${tidslinje.opprettet_dato}`;
        knapp.textContent = "Åpne tidslinje";
        knapp.href = `/tidslinje.html?id=${tidslinje.id}`;
        knapp.className = "knapp";

        kort.appendChild(navn);
        kort.appendChild(id);
        kort.appendChild(brukerId);
        kort.appendChild(brukernavn);
        kort.appendChild(synlighet);
        kort.appendChild(opprettetDato);
        kort.appendChild(knapp);
        li.appendChild(kort);
        tidslinjelisten.appendChild(li);
    }
}

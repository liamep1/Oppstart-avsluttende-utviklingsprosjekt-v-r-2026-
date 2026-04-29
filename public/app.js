// Viser alle tidslinjene på forsiden

const tekst = document.getElementById("tekst");
const tidslinjelisten = document.getElementById("tidslinjer");
const serverAdresse = window.location.origin;




start();

async function start() {
    try {
        const svar = await fetch("/api/tidslinjer");

        if (!svar.ok) {
            throw new Error("Kunne ikke hente tidslinjer");
        }

        const tidslinjer = await svar.json();

        for (const tidslinje of tidslinjer) {
            
            const li = document.createElement("li");
            const kort = document.createElement("div");
            const navn = document.createElement("h3");
            const id = document.createElement("p");
            const synlighet = document.createElement("p");
            const opprettetDato = document.createElement("p");
            const knapp = document.createElement("a");

            kort.className = "tidslinje-kort";
            navn.textContent = tidslinje.navn;
            id.textContent = `Tidslinje-id: ${tidslinje.id}`;
            synlighet.textContent = `Synlighet: ${tidslinje.synlighet}`;
            opprettetDato.textContent = `Opprettet: ${tidslinje.opprettet_dato}`;
            knapp.textContent = "Åpne tidslinje";
            knapp.href = `/tidslinje.html?id=${tidslinje.id}`;
            knapp.className = "knapp";

            kort.appendChild(navn);
            kort.appendChild(id);

            if (tidslinje.brukernavn) {
                const brukernavn = document.createElement("p");
                brukernavn.textContent = `Laget av: ${tidslinje.brukernavn}`;
                kort.appendChild(brukernavn);
            }

            kort.appendChild(synlighet);
            kort.appendChild(opprettetDato);
            kort.appendChild(knapp);
            li.appendChild(kort);
            tidslinjelisten.appendChild(li);
        }
    } catch (feil) {
        console.error("Kunne ikke hente tidslinjer:", feil);
        tekst.textContent = `Får ikke kontakt med serveren på ${serverAdresse}. Start Node-serveren og prøv igjen.`;
    }
}



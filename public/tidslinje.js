// Viser informasjon om tidslinjen og alle hendelsene i tidslinjen
const params = new URLSearchParams(window.location.search);
const tidslinjeId = params.get("id");

const tittel = document.getElementById("tittel");
const tekst = document.getElementById("tekst");
const info = document.getElementById("info");
const hendelser = document.getElementById("hendelser");
const slettKnapp = document.getElementById("slettKnapp");
const hendelseSkjema = document.getElementById("hendelseSkjema");
const hendelsesMelding = document.getElementById("hendelsesMelding");
const serverAdresse = window.location.origin;

slettKnapp.addEventListener("click", slettTidslinje);
// Når hendelseSkjemaet blir sendt inn, kalles funksjonen opprettHendelse
hendelseSkjema.addEventListener("submit", opprettHendelse);

start();

async function start() {
    try {
        const svarTidslinje = await fetch(`/api/tidslinje?tidslinjeId=${tidslinjeId}`);

        if (!svarTidslinje.ok) {
            throw new Error("Kunne ikke hente tidslinjen");
        }

        const tidslinje = await svarTidslinje.json();

        const svarHendelser = await fetch(`/api/hendelser?tidslinjeId=${tidslinjeId}`);

        if (!svarHendelser.ok) {
            throw new Error("Kunne ikke hente hendelser");
        }

        const hendelserListe = await svarHendelser.json();

        tittel.textContent = tidslinje.navn;
        tekst.textContent = `Her ser du alt i tidslinjen ${tidslinje.navn}.`;

        leggTilInfo(`Tidslinje-id: ${tidslinje.id}`);
        if (tidslinje.brukernavn) {
            leggTilInfo(`Laget av: ${tidslinje.brukernavn}`);
        }
        leggTilInfo(`Synlighet: ${tidslinje.synlighet}`);
        leggTilInfo(`Opprettet: ${tidslinje.opprettet_dato}`);

        function leggTilInfo(tekstlinje) {
            const li = document.createElement("li");
            li.textContent = tekstlinje;
            info.appendChild(li);
        }
    

        hendelser.innerHTML = "";

        // Looper gjennom alle hendelsene og viser dem som kort på siden
        for (const hendelse of hendelserListe) {
            const li = document.createElement("li");
            const kort = document.createElement("div");
            const navn = document.createElement("h3");
            const id = document.createElement("p");
            const dato = document.createElement("p");
            const beskrivelse = document.createElement("p");
            const besvartDato = document.createElement("p");
            
            // Lager en sletteknapp for denne hendelsen
            const slettHendelseKnapp = document.createElement("button");
            slettHendelseKnapp.textContent = "Slett hendelse";
            slettHendelseKnapp.className = "knapp slett-hendelse";
            // Når man klikker på knappen, kjører den slettHendelse med hendelseId
            slettHendelseKnapp.addEventListener("click", () => slettHendelse(hendelse.id));

            kort.className = "hendelse-kort";

            navn.textContent = hendelse.navn;
            id.textContent = `Hendelse-id: ${hendelse.id}`;
            dato.textContent = `Dato: ${hendelse.dato}`;
            beskrivelse.textContent = `Beskrivelse: ${hendelse.beskrivelse}`;
            besvartDato.textContent = `Besvart dato: ${hendelse.besvart_dato}`;
            kort.appendChild(navn);
            kort.appendChild(id);
            kort.appendChild(dato);
            kort.appendChild(beskrivelse);
            kort.appendChild(besvartDato);
            // Legg delete-knappen sist i kortet
            kort.appendChild(slettHendelseKnapp);

            li.appendChild(kort);
            hendelser.appendChild(li);
        }
    } catch (feil) {
        console.error("Kunne ikke hente tidslinjedata:", feil);
        tekst.textContent = `Får ikke kontakt med serveren på ${serverAdresse}. Start Node-serveren og prøv igjen.`;
    }
}

// Sletter hele tidslinjen
async function slettTidslinje() {
    if (confirm("oj oj oj..... Sikker på at du vil slette denne tidslinjen?")) {
        try {
            const svar = await fetch(`/api/tidslinjer/${tidslinjeId}`, { method: "DELETE" });
            
            if (svar.ok) {
                alert("Tidslinje slettet!");
                window.location.href = "/";
            } else {
                alert("Feil ved sletting av tidslinje");
            }
        } catch (feil) {
            console.error("Kunne ikke slette tidslinje:", feil);
            alert(`Får ikke kontakt med serveren på ${serverAdresse}.`);
        }
    }
}

// Sletter en enkelt hendelse
async function slettHendelse(hendelseId) {
    if (confirm("oj oj oj..... Sikker på at du vil slette denne hendelsen?")) {
        try {
            const svar = await fetch(`/api/hendelser/${hendelseId}`, { method: "DELETE" });
            
            if (svar.ok) {
                alert("Hendelse slettet!");
                location.reload();
            } else {
                alert("Feil ved sletting av hendelse");
            }
        } catch (feil) {
            console.error("Kunne ikke slette hendelse:", feil);
            alert(`Får ikke kontakt med serveren på ${serverAdresse}.`);
        }
    }
}

// Oppretter en ny hendelse
async function opprettHendelse(event) {
    event.preventDefault();

    const navn = document.getElementById("hendelsNavn").value;
    const dato = document.getElementById("hendelseDato").value;
    const beskrivelse = document.getElementById("hendelseBeskrivelse").value;

    try {
        const svar = await fetch("/api/hendelser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ navn, dato, beskrivelse, tidslinje_id: tidslinjeId })
        });

        if (svar.ok) {
            await svar.json();
            hendelsesMelding.textContent = `Hendelse "${navn}" opprettet!`;
            hendelseSkjema.reset();
            setTimeout(() => location.reload(), 2000);
        } else {
            hendelsesMelding.textContent = "Feil ved opprettelse av hendelse";
        }
    } catch (feil) {
        console.error("Kunne ikke opprette hendelse:", feil);
        hendelsesMelding.textContent = `Får ikke kontakt med serveren på ${serverAdresse}. Start Node-serveren og prøv igjen.`;
    }
}

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

slettKnapp.addEventListener("click", slettTidslinje);
// Når hendelseSkjemaet vert submitta, kall funksjonen opprettHendelse
hendelseSkjema.addEventListener("submit", opprettHendelse);

start();

async function start() {
    const svarTidslinje = await fetch(`/api/tidslinje?tidslinjeId=${tidslinjeId}`);
    const tidslinje = await svarTidslinje.json();

    const svarHendelser = await fetch(`/api/hendelser?tidslinjeId=${tidslinjeId}`);
    const hendelserListe = await svarHendelser.json();

    tittel.textContent = tidslinje.navn;
    tekst.textContent = `Her ser du alt i tidslinjen ${tidslinje.navn}.`;

    leggTilInfo(`Tidslinje-id: ${tidslinje.id}`);
    leggTilInfo(`Bruker-id: ${tidslinje.bruker_id}`);
    leggTilInfo(`Synlighet: ${tidslinje.synlighet}`);
    leggTilInfo(`Opprettet: ${tidslinje.opprettet_dato}`);

    hendelser.innerHTML = "";

    // Loopper gjennom alle hendelsene og viser de som kort på sida
    for (const hendelse of hendelserListe) {
        const li = document.createElement("li");
        const kort = document.createElement("div");
        const navn = document.createElement("h3");
        const id = document.createElement("p");
        const dato = document.createElement("p");
        const beskrivelse = document.createElement("p");
        const bilde = document.createElement("p");
        const svarteRiktig = document.createElement("p");
        const besvartDato = document.createElement("p");
        
        // Lag ein delete-knapp for denne hendelsen
        const slettHendelseKnapp = document.createElement("button");
        slettHendelseKnapp.textContent = "Slett hendelse";
        slettHendelseKnapp.className = "knapp slett-hendelse";
        // Når man klikkar knappen, køyrer slettHendelse-funksjonen med hendelseId
        slettHendelseKnapp.addEventListener("click", () => slettHendelse(hendelse.id));

        kort.className = "hendelse-kort";

        navn.textContent = hendelse.navn;
        id.textContent = `Hendelse-id: ${hendelse.id}`;
        dato.textContent = `Dato: ${hendelse.dato}`;
        beskrivelse.textContent = `Beskrivelse: ${hendelse.beskrivelse}`;
        bilde.textContent = `Bilde: ${hendelse.bilde}`;
        svarteRiktig.textContent = `Svarte riktig: ${hendelse.svarte_riktig}`;
        besvartDato.textContent = `Besvart dato: ${hendelse.besvart_dato}`;

        kort.appendChild(navn);
        kort.appendChild(id);
        kort.appendChild(dato);
        kort.appendChild(beskrivelse);
        kort.appendChild(bilde);
        kort.appendChild(svarteRiktig);
        kort.appendChild(besvartDato);
        // Legg delete-knappen sist i kortet
        kort.appendChild(slettHendelseKnapp);

        li.appendChild(kort);
        hendelser.appendChild(li);
    }
}

function leggTilInfo(tekstlinje) {
    const li = document.createElement("li");
    li.textContent = tekstlinje;
    info.appendChild(li);
}
// Sletter heile tidslinjen
async function slettTidslinje() {
    if (confirm("oj oj oj..... Sikker på at du vil slette denne tidslinjen?")) {
        const svar = await fetch(`/api/tidslinjer/${tidslinjeId}`, { method: "DELETE" });
        
        if (svar.ok) {
            alert("Tidslinje slettet!");
            window.location.href = "/";
        } else {
            alert("Feil ved sletting av tidslinje");
        }
    }
}

// Sletter en enkelt hendelse
async function slettHendelse(hendelseId) {
    if (confirm("oj oj oj..... Sikker på at du vil slette denne hendelsen?")) {
        const svar = await fetch(`/api/hendelser/${hendelseId}`, { method: "DELETE" });
        
        if (svar.ok) {
            alert("Hendelse slettet!");
            location.reload();
        } else {
            alert("Feil ved sletting av hendelse");
        }
    }
}

// Opprettar en ny hendelse
async function opprettHendelse(event) {
    event.preventDefault();

    const navn = document.getElementById("hendelsNavn").value;
    const dato = document.getElementById("hendelseDato").value;
    const beskrivelse = document.getElementById("hendelseBeskrivelse").value;
    const bilde = document.getElementById("hendelseBilde").value;

    const svar = await fetch("/api/hendelser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ navn, dato, beskrivelse, bilde, tidslinje_id: tidslinjeId })
    });

    if (svar.ok) {
        const nyHendelse = await svar.json();
        hendelsesMelding.textContent = `Hendelse "${navn}" oppretta!`;
        hendelseSkjema.reset();
        setTimeout(() => location.reload(), 2000);
    } else {
        hendelsesMelding.textContent = "Feil ved opprettinga av hendelse";
    }
}
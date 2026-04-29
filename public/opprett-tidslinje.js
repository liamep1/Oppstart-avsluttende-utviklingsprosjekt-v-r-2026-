const form = document.getElementById("skjema");
const melding = document.getElementById("melding");
const brukernavnInput = document.getElementById("brukernavn");
const brukerforslag = document.getElementById("brukerforslag");
const opprettServerAdresse = window.location.origin;

form.addEventListener("submit", oprettTidslinje);



async function oprettTidslinje(event) {
    event.preventDefault();
    const navn = document.getElementById("navn").value.trim();
    const brukernavn = document.getElementById("brukernavn").value.trim();
    const synlighet = document.getElementById("synlighet").value;
    melding.textContent = "";

    if (!navn) {
        melding.textContent = "Skriv inn et navn på tidslinjen.";
        return;
    }

    if (!brukernavn) {
        melding.textContent = "Velg en person fra listen.";
        return;
    }


    try {
        const svar = await fetch("/api/tidslinjer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ navn, brukernavn, synlighet })
        });

        const resultat = await svar.json().catch(() => null);

        if (!svar.ok) {
            throw new Error(resultat?.feil || "Kunne ikke opprette tidslinje");
        }

        form.reset();
        location.reload();
    } catch (feil) {
        console.error("Kunne ikke opprette tidslinje:", feil);
        melding.textContent = feil.message;
    }
}
console.log("ok")







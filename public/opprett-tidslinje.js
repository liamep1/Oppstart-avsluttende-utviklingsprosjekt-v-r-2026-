(() => {
    const form = document.getElementById("skjema");
    const melding = document.getElementById("melding");
    const brukernavnInput = document.getElementById("brukernavn");
    const brukerforslag = document.getElementById("brukerforslag");
    const opprettServerAdresse = window.location.origin;
    const kjenteBrukernavn = new Set();

    form.addEventListener("submit", oprettTidslinje);

    lastBrukerforslag();

    async function lastBrukerforslag() {
        try {
            const svar = await fetch("/api/brukere");

            if (!svar.ok) {
                throw new Error("Kunne ikke hente brukere");
            }

            const brukere = await svar.json();
            brukerforslag.innerHTML = "";
            kjenteBrukernavn.clear();

            for (const bruker of brukere) {
                if (!bruker.brukernavn) {
                    continue;
                }

                kjenteBrukernavn.add(bruker.brukernavn.toLowerCase());

                const option = document.createElement("option");
                option.value = bruker.brukernavn;
                brukerforslag.appendChild(option);
            }
        } catch (feil) {
            console.error("Kunne ikke hente brukerforslag:", feil);
            melding.textContent = `Får ikke kontakt med serveren på ${opprettServerAdresse}. Start Node-serveren og prøv igjen.`;
        }
    }

    async function oprettTidslinje(event) {
        event.preventDefault();

        const navn = document.getElementById("navn").value.trim();
        const brukernavn = brukernavnInput.value.trim();
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

        if (!kjenteBrukernavn.has(brukernavn.toLowerCase())) {
            melding.textContent = "Denne personen finnes ikke. Velg en fra forslaget.";
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

            if (feil instanceof TypeError) {
                melding.textContent = `Får ikke kontakt med serveren på ${opprettServerAdresse}. Start Node-serveren og prøv igjen.`;
                return;
            }

            melding.textContent = feil.message;
        }
    }
})();

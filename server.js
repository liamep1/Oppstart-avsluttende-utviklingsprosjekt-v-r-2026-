require("dotenv").config();

const express = require("express");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const port = Number(process.env.PORT) || 3004;
const host = process.env.HOST || "127.0.0.1";

function hentMiljoVariabel(navn) {
    const verdi = process.env[navn];

    if (!verdi) {
        throw new Error(
            `Mangler miljøvariabelen ${navn}. Kopier .env.example til .env og fyll inn riktige Supabase-verdier.`
        );
    }

    return verdi;
}

// Koble til Supabase-databasen
const supabase = createClient(
    hentMiljoVariabel("SUPABASE_URL"),
    hentMiljoVariabel("SUPABASE_ANON_KEY")
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));



// HENT ALLE TIDSLINJER
// Brukes på forsiden for å vise alle tidslinjer

app.get("/api/tidslinjer", async (req, res) => {
    const svar = await supabase.from("Tidslinje").select("*");
    res.json(svar.data);
});


// HENT ALLE BRUKERE
// Brukes på forsiden for å vise forslag i brukernavn-feltet

app.get("/api/brukere", async (req, res) => {
    const svar = await supabase
        .from("Bruker")
        .select("brukernavn")
        .order("brukernavn", { ascending: true });

    if (svar.error) {
        console.error("Kunne ikke hente brukere:", svar.error);
        return res.status(500).json({ feil: "Kunne ikke hente brukere fra databasen." });
    }

    res.json(svar.data);
});



// HENT EN TIDSLINJE
// Brukes på tidslinje-siden for å vise tittel og info

app.get("/api/tidslinje", async (req, res) => {
    const id = req.query.tidslinjeId;

    const svar = await supabase
        .from("Tidslinje")
        .select("*")
        .eq("id", id)
        .single();

    res.json(svar.data);
});


// HENT ALLE HENDELSER I EN TIDSLINJE
// Brukes på tidslinje-siden for å vise hendelsene

app.get("/api/hendelser", async (req, res) => {
    const tidslinjeId = req.query.tidslinjeId;

    const svar = await supabase
        .from("Hendelse")
        .select("*")
        .eq("tidslinje_id", tidslinjeId);

    res.json(svar.data);
});



// LAG EN NY TIDSLINJE
// Brukes når bruker fyller ut skjemaet på forsiden

app.post("/api/tidslinjer", async (req, res) => {
    const navn = req.body.navn?.trim();
    const brukernavn = req.body.brukernavn?.trim();
    const synlighet = req.body.synlighet || "offentlig";

    if (!navn) {
        return res.status(400).json({ feil: "Du må skrive inn navn på tidslinjen." });
    }

    if (!brukernavn) {
        return res.status(400).json({ feil: "Du må velge et brukernavn som finnes fra før." });
    }

    const brukerSvar = await supabase
        .from("Bruker")
        .select("brukernavn")
        .eq("brukernavn", brukernavn)
        .maybeSingle();

    if (brukerSvar.error) {
        console.error("Kunne ikke sjekke brukernavn:", brukerSvar.error);
        return res.status(500).json({ feil: "Kunne ikke sjekke brukeren i databasen." });
    }

    if (!brukerSvar.data) {
        return res.status(400).json({ feil: "Brukernavnet finnes ikke. Velg en person fra forslaget." });
    }

    const svar = await supabase
        .from("Tidslinje")
        .insert([{ navn, brukernavn, synlighet }])
        .select();

    if (svar.error) {
        console.error("Kunne ikke opprette tidslinje:", svar.error);
        return res.status(500).json({ feil: "Kunne ikke opprette tidslinjen i databasen." });
    }

    res.status(201).json(svar.data[0]);
});



// LAG EN HENDELSE
// Brukes når bruker fyller ut skjemaet på tidslinje-siden

app.post("/api/hendelser", async (req, res) => {
    const navn = req.body.navn?.trim();
    const { dato, beskrivelse, tidslinje_id } = req.body;

    if (!navn || !dato || !tidslinje_id) {
        return res.status(400).json({ feil: "Navn, dato og tidslinje må være fylt ut." });
    }

    const svar = await supabase
        .from("Hendelse")
        .insert([{ navn, dato, beskrivelse, tidslinje_id }])
        .select();

    if (svar.error) {
        console.error("Kunne ikke opprette hendelse:", svar.error);
        return res.status(500).json({ feil: "Kunne ikke opprette hendelsen i databasen." });
    }

    res.status(201).json(svar.data[0]);
});



// SLETT EN TIDSLINJE
// Sletter først alle hendelsene i tidslinjen, så selve tidslinjen

app.delete("/api/tidslinjer/:id", async (req, res) => {
    const id = req.params.id;
    try {
        // Hendelsene må slettes først, ellers får vi feil
        await supabase.from("Hendelse").delete().eq("tidslinje_id", id); 
        await supabase.from("Tidslinje").delete().eq("id", id);
        res.json({ success: true });
    } catch (feil) {
        console.error("Noe gikk galt ved sletting:", feil);
    }
});



// SLETT EN HENDELSE
// Sletter bare den ene hendelsen

app.delete("/api/hendelser/:id", async (req, res) => {
    const id = req.params.id;

    await supabase.from("Hendelse").delete().eq("id", id);

    res.json({ success: true });
});


// Start serveren
const server = app.listen(port, host, () => {
    const adresse = host === "127.0.0.1" ? "localhost" : host;
    console.log(`Server kjører på http://${adresse}:${port}`);
});

server.on("error", (feil) => {
    if (feil.code === "EADDRINUSE") {
        console.error(`Port ${port} er allerede i bruk. Stopp den andre serveren eller bytt PORT i .env.`);
    } else if (feil.code === "EPERM") {
        console.error(
            `Serveren fikk ikke lov til å lytte på ${host}:${port}. Prøv en annen HOST/PORT eller sjekk miljøet du kjører i.`
        );
    } else {
        console.error("Serveren startet ikke:", feil);
    }

    process.exit(1);
});

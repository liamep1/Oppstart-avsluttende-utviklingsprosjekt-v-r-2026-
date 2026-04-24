require("dotenv").config();

const express = require("express");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const port = 3001;

// Koble til Supabase-databasen
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


// ----------------------------------------
// HENT ALLE TIDSLINJER
// Brukes på forsiden for å vise alle tidslinjer
// ----------------------------------------
app.get("/api/tidslinjer", async (req, res) => {
    const svar = await supabase.from("Tidslinje").select("*");
    res.json(svar.data);
});


// ----------------------------------------
// HENT ÉI TIDSLINJE
// Brukes på tidslinje-siden for å vise tittel og info
// ----------------------------------------
app.get("/api/tidslinje", async (req, res) => {
    const id = req.query.tidslinjeId;

    const svar = await supabase
        .from("Tidslinje")
        .select("*")
        .eq("id", id)
        .single();

    res.json(svar.data);
});


// ----------------------------------------
// HENT ALLE HENDELSER I EI TIDSLINJE
// Brukes på tidslinje-siden for å vise hendelsane
// ----------------------------------------
app.get("/api/hendelser", async (req, res) => {
    const tidslinjeId = req.query.tidslinjeId;

    const svar = await supabase
        .from("Hendelse")
        .select("*")
        .eq("tidslinje_id", tidslinjeId);

    res.json(svar.data);
});


// ----------------------------------------
// LAG EI NY TIDSLINJE
// Brukes når bruker fyller ut skjemaet på forsiden
// ----------------------------------------
app.post("/api/tidslinjer", async (req, res) => {
    const { navn, brukernavn, synlighet } = req.body;

    const svar = await supabase
        .from("Tidslinje")
        .insert([{ navn, brukernavn, synlighet }])
        .select();

    res.json(svar.data[0]);
});


// ----------------------------------------
// LAG EI NY HENDELSE
// Brukes når bruker fyller ut skjemaet på tidslinje-siden
// ----------------------------------------
app.post("/api/hendelser", async (req, res) => {
    const { navn, dato, beskrivelse, bilde, tidslinje_id } = req.body;

    const svar = await supabase
        .from("Hendelse")
        .insert([{ navn, dato, beskrivelse, bilde, tidslinje_id }])
        .select();

    res.json(svar.data[0]);
});


// ----------------------------------------
// SLETT EI TIDSLINJE
// Sletter først alle hendelsane i tidslinjen, så tidslinjen sjølv
// ----------------------------------------
app.delete("/api/tidslinjer/:id", async (req, res) => {
    const id = req.params.id;

    // Hendelsane må slettast først, elles får vi feil
    await supabase.from("Hendelse").delete().eq("tidslinje_id", id);
    await supabase.from("Tidslinje").delete().eq("id", id);

    res.json({ success: true });
});


// ----------------------------------------
// SLETT EI HENDELSE
// Sletter berre den eine hendelsen
// ----------------------------------------
app.delete("/api/hendelser/:id", async (req, res) => {
    const id = req.params.id;

    await supabase.from("Hendelse").delete().eq("id", id);

    res.json({ success: true });
});


// Start serveren
app.listen(port, () => {
    console.log(`Server kjører på http://localhost:${port}`);
});
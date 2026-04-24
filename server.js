require("dotenv").config();

const express = require("express");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const port = process.env.PORT || 3001;

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/tidslinjer", async (req, res) => {
    const svar = await supabase.from("Tidslinje").select("*");
    res.json(svar.data);
});

app.get("/api/tidslinje", async (req, res) => {
    const tidslinjeId = req.query.tidslinjeId;

    const svar = await supabase
        .from("Tidslinje")
        .select("*")
        .eq("id", tidslinjeId)
        .single();

    res.json(svar.data);
});

app.get("/api/hendelser", async (req, res) => {
    const tidslinjeId = req.query.tidslinjeId;

    const svar = await supabase
        .from("Hendelse")
        .select("*")
        .eq("tidslinje_id", tidslinjeId);

    res.json(svar.data);
});

app.post("/api/tidslinjer", async (req, res) => {
    const navn = req.body.navn;
    const brukernavn = req.body.brukernavn;
    const synlighet = req.body.synlighet;

    const svar = await supabase
        .from("Tidslinje")
        .insert([
            {
                navn: navn,
                brukernavn: brukernavn,
                synlighet: synlighet
            }
        ])
        .select();

    res.json(svar.data[0]);
});

// DELETE - Sletter ei heil tidslinje og alle hendelsene inni henne
// Mottaker: tidslinjeId som parameter i URL (f.eks. /api/tidslinjer/123)
// Returner: { success: true }
app.delete("/api/tidslinjer/:id", async (req, res) => {
    const id = req.params.id;

    // Sletter tidslinjen frå Supabase-tabellen "Tidslinje"
    const svar = await supabase
        .from("Tidslinje")
        .delete()
        .eq("id", id);

    res.json({ success: true });
});

// DELETE - Sletter ei enkelt hendelse frå ei tidslinje
// Mottaker: hendelseId som parameter i URL (f.eks. /api/hendelser/456)
// Returner: { success: true }
app.delete("/api/hendelser/:id", async (req, res) => {
    const id = req.params.id;

    // Sletter hendelsen frå Supabase-tabellen "Hendelse"
    const svar = await supabase
        .from("Hendelse")
        .delete()
        .eq("id", id);

    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Server kjører på http://localhost:${port}`);
});
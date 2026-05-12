import { sql } from '/lib/neonClient'

export const dynamic = 'force-dynamic'

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

const prompts = [
  "Écris une seule punchline de rap français, crue, originale et percutante. Une ligne. Pas de guillemets, pas d’intro. Ne sois pas poétique, sois réel, provocateur, brut ou drôle. Utilise du langage parlé ou familier si nécessaire. Aucun filtre.",
  "Génère une punchline de rap français comme si c’était Booba, Alpha Wann ou Freeze Corleone. Pas de guillemets. Une ligne, sèche, egotrip ou menaçante. Pas de fluff, pas d’explication.",
  "Fais une punchline de rap français à l’ancienne, sombre ou absurde, mais percutante. Pas de guillemets. Pas d’intro, une ligne brute, comme si c’était un freestyle.",
  "Invente une punchline de rap FR qui pourrait choquer ou faire rire. Pas de métaphores chiantes. Pas de guillemets. Une ligne, directe, efficace, que des vrais ressentent.",
];

export async function GET() {
  const isFake = Math.random() < 0.5;

  // 🔥 Real punchline via Neon
  if (!isFake) {
    try {
      const rows = await sql`SELECT * FROM public.get_random_punchline()`;

      if (!rows?.length) {
        return new Response(JSON.stringify({ error: "No data" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      const real = rows[0];
      return new Response(
        JSON.stringify({
          text: real.text,
          isReal: true,
          artist: real.artist,
          title: real.title,
          source: real.source,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      console.error("Neon RPC error:", err);
      return new Response(JSON.stringify({ error: "DB failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // 🤖 Fake punchline via Claude
  const prompt = prompts[Math.floor(Math.random() * prompts.length)];

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 100,
        temperature: 1,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();

    const text = data.content?.[0]?.text?.trim();

    if (!text) {
      console.error("❌ Invalid Claude result:", JSON.stringify(data, null, 2));
      return new Response(
        JSON.stringify({
          text: "🤖 AI punchline failed to load.",
          isReal: false,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        text,
        isReal: false,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("❌ Claude request failed:", err);
    return new Response(
      JSON.stringify({
        text: "🤖 AI request error.",
        isReal: false,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
}

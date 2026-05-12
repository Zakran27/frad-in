import { sql } from '/lib/neonClient'

export const dynamic = 'force-dynamic'

const openaiApiKey = process.env.OPENAI_API_KEY;

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
        console.warn("No punchlines returned.");
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

  // 🤖 Fake punchline via OpenAI
  const prompt = prompts[Math.floor(Math.random() * prompts.length)];

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 1.2,
        top_p: 1,
        frequency_penalty: 0.2,
        presence_penalty: 0.6,
        max_tokens: 60,
      }),
    });

    const data = await res.json();

    const text = data.choices?.[0]?.message?.content?.trim();

    if (!text) {
      console.error("❌ Invalid OpenAI result:", JSON.stringify(data, null, 2));
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
    console.error("❌ OpenAI request failed:", err);
    return new Response(
      JSON.stringify({
        text: "🤖 OpenAI request error.",
        isReal: false,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
}

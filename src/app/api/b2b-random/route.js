import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const openaiApiKey = process.env.OPENAI_API_KEY;

export async function GET() {
  const isFake = Math.random() < 0.5;

  if (!isFake) {
    const { data, error } = await supabase.rpc("get_random_punchline");

    if (error) {
      console.error("Supabase RPC error:", error.message);
      return new Response(JSON.stringify({ error: "Supabase failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!data?.length) {
      console.warn("No punchlines returned.");
      return new Response(JSON.stringify({ error: "No data" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const real = data[0];
    return new Response(
      JSON.stringify({
        text: real.text,
        isReal: true,
        artist: real.artist,
        title: real.title,
        source: real.source,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // ⚠️ Only hit OpenAI if `isFake` is true
  const prompt = `Génère une seule punchline de rap français inventée. Une seule ligne. 200% Rap FR!!! Pas d’intro, pas d’explication. Juste la punchline. Essaie pas d'é^tre trop dans les métaphores, les images etc. Fais parfois simple et effeicace, n'éhsite pas à être cru ou à choquer.`;

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
        temperature: 0.9,
        max_tokens: 60,
      }),
    });

    const data = await res.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error(
        "❌ OpenAI response invalid:",
        JSON.stringify(data, null, 2)
      );
      return new Response(
        JSON.stringify({
          text: "🤖 AI punchline failed to load.",
          isReal: false,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    const text = data.choices[0].message.content.trim();

    return new Response(
      JSON.stringify({
        text,
        isReal: false,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("❌ OpenAI request failed:", err);
    return new Response(
      JSON.stringify({
        text: "🤖 OpenAI request error.",
        isReal: false,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

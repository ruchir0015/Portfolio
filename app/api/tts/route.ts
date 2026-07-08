// app/api/tts/route.ts
export async function POST(req: Request) {
  const { text } = await req.json();
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2",   // fastest model, good quality
        voice_settings: {
          stability: 0.5,              // higher = more consistent, lower = more expressive
          similarity_boost: 0.75,      // how closely it matches your cloned voice
        },
      }),
    }
  );
  const audioBuffer = await response.arrayBuffer();
  return new Response(audioBuffer, { headers: { "Content-Type": "audio/mpeg" } });
}
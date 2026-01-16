import { OpenAI } from "openai";

export const config = {
  runtime: "edge",
};

export default async function handler(request: Request) {
  try {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST allowed" }), { status: 405 });
    }

    const { message } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "message is required" }), { status: 400 });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }]
    });

    return new Response(
      JSON.stringify({ reply: completion.choices[0].message.content }),
      { status: 200 }
    );

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

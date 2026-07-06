export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { system, messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Falta 'messages'" });
  }

  const trimmedMessages = messages.slice(-20);

  const deepseekMessages = [
    { role: "system", content: system || "" },
    ...trimmedMessages,
  ];

  try {
    const deepseekResponse = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.DEEPSEEK_API_KEY,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        max_tokens: 1000,
        messages: deepseekMessages,
      }),
    });

    const data = await deepseekResponse.json();

    let translated;
    if (data.choices && data.choices[0] && data.choices[0].message) {
      translated = {
        content: [{ type: "text", text: data.choices[0].message.content }],
      };
    } else {
      translated = { content: [], error: data.error || "Respuesta inesperada de DeepSeek" };
    }

    return res.status(deepseekResponse.status).json(translated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

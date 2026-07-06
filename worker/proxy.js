/**
 * Proxy minimo para conectar tu sitio (GitHub Pages) con la API de DeepSeek
 * sin exponer tu API key en el navegador del cliente.
 *
 * Usa DeepSeek V4-Flash: muy barato ($0.14 / $0.28 por millon de tokens) y
 * DeepSeek regala 5 millones de tokens gratis a cada cuenta nueva (sin
 * tarjeta). Despues de eso cobra por uso, pero a una fraccion del costo
 * de Claude u OpenAI. No es un plan gratis permanente.
 *
 * Nota de privacidad: DeepSeek procesa las solicitudes en su propia
 * infraestructura (empresa china). Si el reporte de tu cliente incluye
 * informacion sensible, tenlo en cuenta antes de usar este proveedor.
 *
 * DESPLIEGUE (una sola vez):
 * 1. Crea una cuenta en https://platform.deepseek.com y genera una API key.
 * 2. npm install -g wrangler
 * 3. wrangler login
 * 4. wrangler init proxy-estado-proyecto   (elige "Hello World Worker", Javascript)
 * 5. Reemplaza el contenido de src/index.js por este archivo
 * 6. wrangler secret put DEEPSEEK_API_KEY   (pega tu API key cuando te la pida)
 * 7. wrangler deploy
 * 8. Copia la URL que te da y pegala en index.html en la constante PROXY_URL.
 *
 * IMPORTANTE: cambia ALLOWED_ORIGIN abajo por el dominio real de tu GitHub
 * Pages (ej: "https://tu-usuario.github.io") para que solo tu sitio pueda
 * usar el proxy.
 */

const ALLOWED_ORIGIN = "*"; // cambia esto a tu dominio de GitHub Pages en produccion

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders() });
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "JSON invalido" }), {
        status: 400,
        headers: { ...corsHeaders(), "Content-Type": "application/json" },
      });
    }

    const { system, messages } = body;
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Falta 'messages'" }), {
        status: 400,
        headers: { ...corsHeaders(), "Content-Type": "application/json" },
      });
    }

    // Limite simple para evitar abuso: solo permite hasta 20 mensajes de contexto
    const trimmedMessages = messages.slice(-20);

    // DeepSeek (formato OpenAI) espera el system prompt como un mensaje mas,
    // no como un campo separado (a diferencia de Anthropic).
    const deepseekMessages = [
      { role: "system", content: system || "" },
      ...trimmedMessages,
    ];

    const deepseekResponse = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + env.DEEPSEEK_API_KEY,
      },
      body: JSON.stringify({
        model: "deepseek-v4-flash",
        max_tokens: 1000,
        messages: deepseekMessages,
      }),
    });

    const data = await deepseekResponse.json();

    // Traducimos la respuesta de DeepSeek (formato OpenAI) al mismo formato
    // que ya usa index.html (formato Anthropic), para no tener que tocar
    // el HTML al cambiar de proveedor.
    let translated;
    if (data.choices && data.choices[0] && data.choices[0].message) {
      translated = {
        content: [{ type: "text", text: data.choices[0].message.content }],
      };
    } else {
      translated = { content: [], error: data.error || "Respuesta inesperada de DeepSeek" };
    }

    return new Response(JSON.stringify(translated), {
      status: deepseekResponse.status,
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
    });
  },
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

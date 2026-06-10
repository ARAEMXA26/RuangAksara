// Chat API Route — Groq (Primary) + Gemini (Fallback)

const SYSTEM_PROMPT = `Kamu adalah asisten virtual pintar untuk "RuangAksara" (Sistem Perpustakaan Canggih).
Tugasmu adalah membantu pengguna dengan informasi terkait perpustakaan. 
Jawablah dengan rapi, ramah, dan sangat humanis (seperti manusia sungguhan). 
Gunakan formatting markdown jika diperlukan (bold, list) agar jawaban mudah dibaca.
RuangAksara memiliki fitur: Pencarian Semantik AI, Sirkulasi (peminjaman buku), Knowledge Base (untuk pustakawan).
Jawab dengan ringkas namun jelas. Jika ditanya pertanyaan di luar perpustakaan, jawablah dengan sopan bahwa kamu hanya asisten perpustakaan RuangAksara.`;

// ===== GROQ MODELS (primary) =====
const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "gemma2-9b-it",
  "mixtral-8x7b-32768",
];

// ===== GEMINI MODELS (fallback) =====
const GEMINI_MODELS = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-pro",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-pro",
];

// ----- Groq API Call -----
async function tryGroq(message, history, apiKey) {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  // Add history (skip leading model messages)
  let started = false;
  for (const msg of history) {
    if (!started && msg.role !== "user") continue;
    started = true;
    if (msg.text && msg.text.trim()) {
      messages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.text,
      });
    }
  }

  // Add current message
  messages.push({ role: "user", content: message });

  for (const model of GROQ_MODELS) {
    try {
      console.log(`[Chat API] Trying Groq model: ${model}`);
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        console.warn(`[Chat API] ❌ Groq ${model} HTTP ${res.status}: ${errBody}`);
        continue;
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content;
      if (reply) {
        console.log(`[Chat API] ✅ Success with Groq model: ${model}`);
        return reply;
      }
    } catch (err) {
      console.warn(`[Chat API] ❌ Groq ${model} error: ${err.message}`);
    }
  }
  return null; // all Groq models failed
}

// ----- Gemini API Call (fallback) -----
async function tryGemini(message, history, apiKey) {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(apiKey);

  let formattedHistory = (history || [])
    .filter((msg) => msg.text && msg.text.trim() !== "")
    .map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

  // Gemini requires history to start with 'user'
  while (formattedHistory.length > 0 && formattedHistory[0].role === "model") {
    formattedHistory.shift();
  }

  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`[Chat API] Trying Gemini model: ${modelName}`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_PROMPT,
      });
      const chat = model.startChat({ history: formattedHistory });
      const result = await chat.sendMessage(message);
      const text = result.response.text();
      if (text) {
        console.log(`[Chat API] ✅ Success with Gemini model: ${modelName}`);
        return text;
      }
    } catch (err) {
      console.warn(`[Chat API] ❌ Gemini ${modelName} error: ${err.message}`);
    }
  }
  return null; // all Gemini models failed
}

// ===== MAIN HANDLER =====
export async function POST(req) {
  try {
    const { message, history } = await req.json();

    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!groqKey && !geminiKey) {
      return Response.json(
        { reply: "⚠️ Tidak ada API Key yang dikonfigurasi di server." },
        { status: 500 }
      );
    }

    // 1) Try Groq first (primary)
    if (groqKey) {
      const reply = await tryGroq(message, history || [], groqKey);
      if (reply) {
        return Response.json({ reply });
      }
    }

    // 2) Fallback to Gemini
    if (geminiKey) {
      const reply = await tryGemini(message, history || [], geminiKey);
      if (reply) {
        return Response.json({ reply });
      }
    }

    // 3) All providers failed
    return Response.json(
      { reply: "⚠️ Semua layanan AI sedang tidak tersedia. Silakan coba lagi nanti." },
      { status: 500 }
    );
  } catch (error) {
    console.error("[Chat API] Final Error:", error.message || error);
    return Response.json(
      { reply: "Maaf, terjadi kesalahan saat menghubungi server AI. Silakan coba lagi nanti." },
      { status: 500 }
    );
  }
}

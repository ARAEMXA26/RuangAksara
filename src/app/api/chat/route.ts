import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

// ----- Local DB / Rules Fallback -----
async function localChatFallback(message: string) {
  try {
    const query = message.toLowerCase();
    
    // 1. Fetch all knowledge base entries
    const kbEntries = await prisma.knowledgeBase.findMany();
    
    // 2. Try to match KB entries by title or content keywords
    for (const kb of kbEntries) {
      const titleLower = kb.title.toLowerCase();
      const contentLower = kb.content.toLowerCase();
      
      // If title or content is highly relevant to the query
      if (
        query.includes(titleLower) || 
        titleLower.includes(query) ||
        (query.includes("perpanjang") && titleLower.includes("perpanjangan")) ||
        (query.includes("pinjam") && titleLower.includes("peminjaman")) ||
        (query.includes("denda") && titleLower.includes("denda")) ||
        (query.includes("jurnal") && titleLower.includes("jurnal")) ||
        (query.includes("sop") && titleLower.includes("sop"))
      ) {
        return `Berikut informasi dari Knowledge Base kami mengenai **${kb.title}**:\n\n${kb.content}`;
      }
    }
    
    // 3. Fallback keywords for general library info
    if (query.includes("ruangaksara") || query.includes("aplikasi") || query.includes("sistem") || query.includes("apa itu")) {
      return "**RuangAksara** adalah Sistem Perpustakaan Canggih berbasis AI. Sistem ini memudahkan Anda untuk melakukan pencarian koleksi (semantik), sirkulasi peminjaman secara mandiri, mengelola denda, serta mengakses asisten AI untuk memandu aktivitas perpustakaan Anda.";
    }

    if (query.includes("fitur") || query.includes("menu") || query.includes("layanan")) {
      return "RuangAksara memiliki beberapa fitur utama:\n1. **Pencarian Semantik**: Cari buku/dokumen menggunakan bahasa alami.\n2. **Kelola Buku & Sirkulasi**: Menu khusus pustakawan untuk peminjaman, pengembalian, dan denda.\n3. **Knowledge Base**: Panduan operasional perpustakaan bagi pustakawan.\n4. **Asisten Virtual**: Obrolan interaktif AI untuk membantu Anda.";
    }

    if (query.includes("buku") || query.includes("cari") || query.includes("katalog")) {
      // Find up to 3 books in the database to show
      const books = await prisma.book.findMany({ take: 3 });
      if (books.length > 0) {
        const bookList = books.map(b => `- **${b.title}** oleh ${b.author} (${b.year})`).join("\n");
        return `Anda dapat mencari koleksi lengkap melalui menu **Katalog**. Berikut adalah beberapa koleksi teratas yang tersedia di perpustakaan saat ini:\n${bookList}\n\nSilakan gunakan menu pencarian untuk menelusuri kategori lainnya.`;
      }
      return "Anda dapat menelusuri dan mencari buku secara lengkap melalui menu **Katalog** di bagian atas halaman.";
    }

    // 4. Default helpful offline response
    return "Halo! Saya **RuangAksara Assistant**. Saat ini koneksi ke server AI utama kami sedang terputus, sehingga saya beroperasi dalam mode luring (offline).\n\nAda beberapa panduan yang bisa saya berikan. Silakan ketik kata kunci seperti **'pinjam'**, **'perpanjang'**, **'denda'**, **'jurnal'**, atau **'buku'** untuk mendapatkan panduan otomatis dari sistem perpustakaan.";
  } catch (error) {
    console.error("Local fallback error:", error);
    return "Halo! Mohon maaf, saat ini asisten AI sedang tidak tersedia karena kendala koneksi server. Silakan coba beberapa saat lagi.";
  }
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

    // 3) All providers failed, fallback to local database / rules matching
    console.warn("[Chat API] ⚠️ External AIs failed or keys invalid. Falling back to local database/rules matching.");
    const fallbackReply = await localChatFallback(message);
    return Response.json({ reply: fallbackReply });
  } catch (error) {
    console.error("[Chat API] Final Error:", error.message || error);
    return Response.json(
      { reply: "Maaf, terjadi kesalahan saat menghubungi server AI. Silakan coba lagi nanti." },
      { status: 500 }
    );
  }
}

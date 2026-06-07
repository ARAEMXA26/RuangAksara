import { NextResponse } from "next/server";
import { simulateChatbotResponse } from "@/lib/mockData";

// POST /api/chat/message
// Sequence Diagram UC4: Chatbot Referensi (RAG Pipeline)
export async function POST(request) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Step 3: Ekstrak Intent dan Konteks Pesan
    // In production: const intent = await extractIntent(message);

    // Step 4: Ambil dokumen referensi terkait (RAG Model)
    // In production:
    // const queryVector = await generateEmbedding(message);
    // const docs = await db.query(
    //   'SELECT content, 1-(embedding <=> $1) AS score FROM knowledge_base ORDER BY score DESC LIMIT 5',
    //   [queryVector]
    // );

    // Step 5: Return Konteks Aturan SOP
    // Step 6: Generate balasan AI berdasarkan Konteks
    // In production: const response = await llm.generate(prompt + context + message);

    const response = simulateChatbotResponse(message);

    // Step 7: Stream Response AI
    // This returns as a regular response; in production, use ReadableStream for SSE
    return NextResponse.json(
      {
        id: `msg_${Date.now()}`,
        sessionId: sessionId || `session_${Date.now()}`,
        message: response,
        sender_type: "bot",
        timestamp: new Date().toISOString(),
        metadata: {
          intent: "detected",
          ragDocumentsUsed: 3,
          confidenceScore: 0.92,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Chat processing failed" },
      { status: 500 }
    );
  }
}

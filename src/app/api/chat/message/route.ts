import { NextResponse } from "next/server";

function getChatbotResponse(message: string) {
  const msg = message.toLowerCase();

  if (msg.includes("perpanjang") || msg.includes("extend")) {
    return "Berdasarkan panduan perpustakaan kami, buku dapat diperpanjang **maksimal 1 kali** selama **7 hari tambahan**. Anda bisa melakukannya secara online melalui menu **Sirkulasi** di akun RuangAksara Anda, atau datang langsung ke meja sirkulasi. ⚠️ Perpanjangan hanya bisa dilakukan jika tidak ada antrian peminjam lain.";
  }
  if (msg.includes("denda") || msg.includes("fine") || msg.includes("telat") || msg.includes("terlambat")) {
    return "Kebijakan denda perpustakaan kami:\n\n• **Rp 1.000 per hari** per buku yang terlambat dikembalikan\n• **Denda maksimal**: Rp 50.000 per buku\n• ⚠️ Peminjaman baru **tidak dapat dilakukan** jika ada denda yang belum dibayar\n\nAnda bisa membayar denda di meja sirkulasi atau secara online melalui sistem.";
  }
  if (msg.includes("pinjam") || msg.includes("borrow") || msg.includes("cara")) {
    return "Berikut SOP Peminjaman Buku:\n\n1️⃣ **Login** ke sistem RuangAksara\n2️⃣ **Cari buku** melalui pencarian semantik\n3️⃣ Klik tombol **'Pinjam'** pada buku yang tersedia\n4️⃣ **Konfirmasi** peminjaman\n5️⃣ **Ambil buku** di rak yang tertera pada sistem\n\n📅 Durasi pinjam standar adalah **14 hari**.";
  }
  if (msg.includes("jurnal") || msg.includes("journal") || msg.includes("riset") || msg.includes("research")) {
    return "Tips pencarian jurnal ilmiah:\n\n🔍 Gunakan **kata kunci spesifik** dengan operator boolean (AND, OR, NOT)\n📅 Manfaatkan **filter tahun** untuk referensi terkini\n📊 Periksa **impact factor** jurnal melalui Scopus atau Web of Science\n📚 Akses database jurnal melalui **pencarian semantik** RuangAksara\n\nCoba gunakan fitur Pencarian Semantik kami untuk menemukan jurnal yang relevan!";
  }
  if (msg.includes("jam") || msg.includes("buka") || msg.includes("operasional") || msg.includes("hours")) {
    return "Jam operasional perpustakaan:\n\n🏫 **Senin - Jumat**: 08:00 - 21:00 WIB\n📅 **Sabtu**: 09:00 - 17:00 WIB\n🔴 **Minggu & Hari Libur**: Tutup\n\n💡 Namun, layanan **Chatbot Referensi** dan **Pencarian Semantik** kami tersedia **24/7** secara online!";
  }

  return "Terima kasih atas pertanyaan Anda! 📚\n\nSaya adalah asisten virtual perpustakaan **RuangAksara**. Saya bisa membantu Anda dengan:\n\n• 📖 **Peminjaman & Pengembalian** buku\n• 💰 **Informasi denda** keterlambatan\n• 🔍 **Pencarian referensi** ilmiah\n• ⏰ **Jam operasional** perpustakaan\n• 📋 **Panduan** penggunaan perpustakaan\n\nSilakan ajukan pertanyaan spesifik Anda!";
}

// POST /api/chat/message
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = getChatbotResponse(message);

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

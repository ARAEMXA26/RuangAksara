// ============================================================
// LibKMS-AI Mock Data
// Simulated data for demo/presentation purposes
// ============================================================

export const mockUsers = [
  {
    id: "u1",
    name: "Ari Ardianto",
    email: "ari@university.ac.id",
    firebase_uid: "firebase_001",
    role: "mahasiswa",
    borrow_limit: 3,
  },
  {
    id: "u2",
    name: "Dr. Sari Dewi",
    email: "sari.dewi@university.ac.id",
    firebase_uid: "firebase_002",
    role: "dosen",
    borrow_limit: 5,
  },
  {
    id: "u3",
    name: "Budi Pustakawan",
    email: "budi@university.ac.id",
    firebase_uid: "firebase_003",
    role: "pustakawan",
    borrow_limit: 10,
  },
];

export const mockBooks = [
  {
    id: "b1",
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell & Peter Norvig",
    isbn: "978-0134610993",
    cover: "📘",
  },
  {
    id: "b2",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    isbn: "978-0262033848",
    cover: "📗",
  },
  {
    id: "b3",
    title: "Deep Learning",
    author: "Ian Goodfellow",
    isbn: "978-0262035613",
    cover: "📕",
  },
  {
    id: "b4",
    title: "Database System Concepts",
    author: "Abraham Silberschatz",
    isbn: "978-0078022159",
    cover: "📙",
  },
  {
    id: "b5",
    title: "Clean Code: A Handbook of Agile Software",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    cover: "📓",
  },
  {
    id: "b6",
    title: "Design Patterns: Elements of Reusable Software",
    author: "Erich Gamma et al.",
    isbn: "978-0201633610",
    cover: "📔",
  },
  {
    id: "b7",
    title: "The Pragmatic Programmer",
    author: "David Thomas & Andrew Hunt",
    isbn: "978-0135957059",
    cover: "📒",
  },
  {
    id: "b8",
    title: "Computer Networking: A Top-Down Approach",
    author: "James Kurose",
    isbn: "978-0133594140",
    cover: "📘",
  },
];

export const mockInventory = [
  { id: "inv1", book_id: "b1", status: "available", location_rack: "Lantai 2, Rak A-1" },
  { id: "inv2", book_id: "b1", status: "borrowed", location_rack: "Lantai 2, Rak A-1" },
  { id: "inv3", book_id: "b2", status: "available", location_rack: "Lantai 2, Rak A-3" },
  { id: "inv4", book_id: "b3", status: "available", location_rack: "Lantai 3, Rak B-2" },
  { id: "inv5", book_id: "b3", status: "borrowed", location_rack: "Lantai 3, Rak B-2" },
  { id: "inv6", book_id: "b4", status: "available", location_rack: "Lantai 1, Rak C-5" },
  { id: "inv7", book_id: "b5", status: "maintenance", location_rack: "Lantai 1, Rak D-1" },
  { id: "inv8", book_id: "b6", status: "available", location_rack: "Lantai 2, Rak A-4" },
  { id: "inv9", book_id: "b7", status: "available", location_rack: "Lantai 3, Rak B-6" },
  { id: "inv10", book_id: "b8", status: "borrowed", location_rack: "Lantai 1, Rak C-2" },
];

export const mockTransactions = [
  {
    id: "t1",
    user_id: "u1",
    inventory_id: "inv2",
    borrow_date: "2026-05-20",
    due_date: "2026-06-03",
    return_date: null,
    status: "overdue",
  },
  {
    id: "t2",
    user_id: "u1",
    inventory_id: "inv5",
    borrow_date: "2026-06-01",
    due_date: "2026-06-15",
    return_date: null,
    status: "active",
  },
  {
    id: "t3",
    user_id: "u2",
    inventory_id: "inv10",
    borrow_date: "2026-05-25",
    due_date: "2026-06-08",
    return_date: null,
    status: "active",
  },
  {
    id: "t4",
    user_id: "u1",
    inventory_id: "inv3",
    borrow_date: "2026-04-01",
    due_date: "2026-04-15",
    return_date: "2026-04-14",
    status: "returned",
  },
];

export const mockFines = [
  {
    id: "f1",
    transaction_id: "t1",
    amount: 15000,
    status: "unpaid",
  },
];

export const mockKnowledgeBase = [
  {
    id: "kb1",
    content: "Panduan Perpanjangan Pinjaman: Buku dapat diperpanjang maksimal 1 kali selama 7 hari. Perpanjangan hanya bisa dilakukan jika tidak ada antrian peminjam lain untuk buku tersebut. Perpanjangan bisa dilakukan secara online melalui akun LibKMS-AI atau datang langsung ke meja sirkulasi.",
    created_by: "u3",
    created_at: "2026-05-01",
  },
  {
    id: "kb2",
    content: "Strategi Pencarian Jurnal Ilmiah: Gunakan kata kunci spesifik dengan operator boolean (AND, OR, NOT). Manfaatkan filter tahun publikasi untuk mendapatkan referensi terkini. Periksa impact factor jurnal melalui database Scopus atau Web of Science.",
    created_by: "u3",
    created_at: "2026-05-10",
  },
  {
    id: "kb3",
    content: "SOP Peminjaman Buku: 1) Login ke sistem LibKMS-AI. 2) Cari buku melalui pencarian semantik. 3) Klik tombol 'Pinjam' pada buku yang tersedia. 4) Konfirmasi peminjaman. 5) Ambil buku di rak yang tertera. 6) Durasi pinjam standar adalah 14 hari.",
    created_by: "u3",
    created_at: "2026-05-15",
  },
  {
    id: "kb4",
    content: "Kebijakan Denda Keterlambatan: Denda keterlambatan pengembalian buku sebesar Rp 1.000 per hari per buku. Denda maksimal adalah Rp 50.000 per buku. Jika denda belum dibayar, peminjaman baru tidak dapat dilakukan.",
    created_by: "u3",
    created_at: "2026-05-20",
  },
];

export const mockChatHistory = [
  {
    id: "msg1",
    session_id: "cs1",
    sender_type: "user",
    message: "Bagaimana cara memperpanjang pinjaman buku?",
    timestamp: "2026-06-06T10:00:00",
  },
  {
    id: "msg2",
    session_id: "cs1",
    sender_type: "bot",
    message: "Berdasarkan panduan perpustakaan kami, buku dapat diperpanjang maksimal 1 kali selama 7 hari. Anda bisa melakukannya secara online melalui akun LibKMS-AI di menu Sirkulasi, atau datang langsung ke meja sirkulasi. Perlu diingat, perpanjangan hanya bisa dilakukan jika tidak ada antrian peminjam lain untuk buku tersebut.",
    timestamp: "2026-06-06T10:00:05",
  },
];

// Helper: get book by ID
export function getBookById(id) {
  return mockBooks.find((b) => b.id === id);
}

// Helper: get inventory for a book
export function getInventoryForBook(bookId) {
  return mockInventory.filter((inv) => inv.book_id === bookId);
}

// Helper: get available count for a book
export function getAvailableCount(bookId) {
  return mockInventory.filter((inv) => inv.book_id === bookId && inv.status === "available").length;
}

// Helper: get total count for a book
export function getTotalCount(bookId) {
  return mockInventory.filter((inv) => inv.book_id === bookId).length;
}

// Simulated semantic search results
export function simulateSemanticSearch(query) {
  const q = query.toLowerCase();
  return mockBooks
    .map((book) => {
      let score = 0;
      const titleLower = book.title.toLowerCase();
      const authorLower = book.author.toLowerCase();

      // Simple keyword matching to simulate semantic similarity
      const queryWords = q.split(/\s+/);
      queryWords.forEach((word) => {
        if (titleLower.includes(word)) score += 0.3;
        if (authorLower.includes(word)) score += 0.2;
      });

      // Semantic-ish category matching
      if (q.includes("ai") || q.includes("kecerdasan") || q.includes("artificial")) {
        if (titleLower.includes("artificial") || titleLower.includes("deep learning")) score += 0.4;
      }
      if (q.includes("algorithm") || q.includes("algoritma")) {
        if (titleLower.includes("algorithm")) score += 0.4;
      }
      if (q.includes("database") || q.includes("basis data")) {
        if (titleLower.includes("database")) score += 0.4;
      }
      if (q.includes("network") || q.includes("jaringan")) {
        if (titleLower.includes("networking")) score += 0.4;
      }
      if (q.includes("software") || q.includes("perangkat lunak") || q.includes("code")) {
        if (titleLower.includes("clean code") || titleLower.includes("design pattern") || titleLower.includes("pragmatic"))
          score += 0.4;
      }

      // Add some randomness
      score += Math.random() * 0.15;
      score = Math.min(score, 0.99);

      const availableCount = getAvailableCount(book.id);
      const totalCount = getTotalCount(book.id);

      return {
        ...book,
        similarity: parseFloat(score.toFixed(4)),
        available: availableCount,
        total: totalCount,
        location: mockInventory.find((inv) => inv.book_id === book.id)?.location_rack || "-",
      };
    })
    .filter((r) => r.similarity > 0.1)
    .sort((a, b) => b.similarity - a.similarity);
}

// Simulated chatbot responses
export function simulateChatbotResponse(message) {
  const msg = message.toLowerCase();

  if (msg.includes("perpanjang") || msg.includes("extend")) {
    return "Berdasarkan panduan perpustakaan kami, buku dapat diperpanjang **maksimal 1 kali** selama **7 hari tambahan**. Anda bisa melakukannya secara online melalui menu **Sirkulasi** di akun LibKMS-AI Anda, atau datang langsung ke meja sirkulasi. ⚠️ Perpanjangan hanya bisa dilakukan jika tidak ada antrian peminjam lain.";
  }
  if (msg.includes("denda") || msg.includes("fine") || msg.includes("telat") || msg.includes("terlambat")) {
    return "Kebijakan denda perpustakaan kami:\n\n• **Rp 1.000 per hari** per buku yang terlambat dikembalikan\n• **Denda maksimal**: Rp 50.000 per buku\n• ⚠️ Peminjaman baru **tidak dapat dilakukan** jika ada denda yang belum dibayar\n\nAnda bisa membayar denda di meja sirkulasi atau secara online melalui sistem.";
  }
  if (msg.includes("pinjam") || msg.includes("borrow") || msg.includes("cara")) {
    return "Berikut SOP Peminjaman Buku:\n\n1️⃣ **Login** ke sistem LibKMS-AI\n2️⃣ **Cari buku** melalui pencarian semantik\n3️⃣ Klik tombol **'Pinjam'** pada buku yang tersedia\n4️⃣ **Konfirmasi** peminjaman\n5️⃣ **Ambil buku** di rak yang tertera pada sistem\n\n📅 Durasi pinjam standar adalah **14 hari**.";
  }
  if (msg.includes("jurnal") || msg.includes("journal") || msg.includes("riset") || msg.includes("research")) {
    return "Tips pencarian jurnal ilmiah:\n\n🔍 Gunakan **kata kunci spesifik** dengan operator boolean (AND, OR, NOT)\n📅 Manfaatkan **filter tahun** untuk referensi terkini\n📊 Periksa **impact factor** jurnal melalui Scopus atau Web of Science\n📚 Akses database jurnal melalui **pencarian semantik** LibKMS-AI\n\nCoba gunakan fitur Pencarian Semantik kami untuk menemukan jurnal yang relevan!";
  }
  if (msg.includes("jam") || msg.includes("buka") || msg.includes("operasional") || msg.includes("hours")) {
    return "Jam operasional perpustakaan:\n\n🏫 **Senin - Jumat**: 08:00 - 21:00 WIB\n📅 **Sabtu**: 09:00 - 17:00 WIB\n🔴 **Minggu & Hari Libur**: Tutup\n\n💡 Namun, layanan **Chatbot Referensi** dan **Pencarian Semantik** kami tersedia **24/7** secara online!";
  }

  return "Terima kasih atas pertanyaan Anda! 📚\n\nSaya adalah asisten virtual perpustakaan **LibKMS-AI**. Saya bisa membantu Anda dengan:\n\n• 📖 **Peminjaman & Pengembalian** buku\n• 💰 **Informasi denda** keterlambatan\n• 🔍 **Pencarian referensi** ilmiah\n• ⏰ **Jam operasional** perpustakaan\n• 📋 **Panduan** penggunaan perpustakaan\n\nSilakan ajukan pertanyaan spesifik Anda!";
}

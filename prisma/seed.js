const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ========== USERS ==========
  const user1 = await prisma.user.upsert({
    where: { email: "ari@university.ac.id" },
    update: {},
    create: {
      firebaseUid: "firebase_001",
      email: "ari@university.ac.id",
      name: "Ari Ardianto",
      role: "mahasiswa",
      borrowLimit: 3,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "sari.dewi@university.ac.id" },
    update: {},
    create: {
      firebaseUid: "firebase_002",
      email: "sari.dewi@university.ac.id",
      name: "Dr. Sari Dewi",
      role: "dosen",
      borrowLimit: 5,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: "budi@university.ac.id" },
    update: {},
    create: {
      firebaseUid: "XlPfj1X0yTSngjslj7RHT5CwCng2",
      email: "budi@university.ac.id",
      name: "Budi Pustakawan",
      role: "pustakawan",
      borrowLimit: 10,
    },
  });

  console.log("✅ Users seeded");

  // ========== BOOKS ==========
  const booksData = [
    // --- Teknologi ---
    { title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell & Peter Norvig", isbn: "978-0134610993", category: "Teknologi", year: 2020, cover: "📘", description: "Buku panduan utama untuk kecerdasan buatan. Bahasa: Inggris. Format: Hardcopy Buku." },
    { title: "Introduction to Algorithms", author: "Thomas H. Cormen", isbn: "978-0262033848", category: "Teknologi", year: 2022, cover: "📗", description: "Buku referensi algoritma terlengkap untuk ilmu komputer. Bahasa: Inggris." },
    { title: "Deep Learning", author: "Ian Goodfellow", isbn: "978-0262035613", category: "Teknologi", year: 2023, cover: "📕", description: "Panduan komprehensif tentang deep learning. Bahasa: Inggris." },
    { title: "Database System Concepts", author: "Abraham Silberschatz", isbn: "978-0078022159", category: "Teknologi", year: 2023, cover: "📙", description: "Konsep dasar dan arsitektur sistem basis data modern. Bahasa: Inggris." },
    { title: "Clean Code: A Handbook of Agile Software", author: "Robert C. Martin", isbn: "978-0132350884", category: "Teknologi", year: 2022, cover: "📓", description: "Panduan menulis kode yang bersih dan mudah dipelihara. Bahasa: Inggris." },
    { title: "Design Patterns: Elements of Reusable Software", author: "Erich Gamma et al.", isbn: "978-0201633610", category: "Teknologi", year: 2020, cover: "📔", description: "Pola desain berorientasi objek klasik. Bahasa: Inggris." },
    { title: "The Pragmatic Programmer", author: "David Thomas & Andrew Hunt", isbn: "978-0135957059", category: "Teknologi", year: 2023, cover: "📒", description: "Tips and best practices untuk developer profesional. Bahasa: Inggris." },
    { title: "Computer Networking: A Top-Down Approach", author: "James Kurose", isbn: "978-0133594140", category: "Teknologi", year: 2021, cover: "📘", description: "Konsep dasar jaringan komputer secara top-down. Bahasa: Inggris." },

    // --- Bisnis ---
    { title: "Prinsip-Prinsip Manajemen Modern", author: "James Stoner", isbn: "978-6024340562", category: "Bisnis", year: 2019, cover: "💼", description: "Konsep manajemen bisnis untuk era modern. Bahasa: Indonesia. Buku Cetak." },
    { title: "Digital Business and E-Commerce Management", author: "Dave Chaffey", isbn: "978-1292147703", category: "Bisnis", year: 2021, cover: "🌐", description: "E-Book komprehensif mengenai strategi bisnis digital dan e-commerce. Bahasa: Inggris. Format: E-Book PDF." },

    // --- Pendidikan ---
    { title: "Jurnal Pendidikan Indonesia: Inovasi Pembelajaran", author: "Sri Handayani", isbn: "2301-123X", category: "Pendidikan", year: 2022, cover: "📝", description: "Jurnal ilmiah yang membahas metode pembelajaran interaktif di sekolah dasar. Bahasa: Indonesia. Jenis Koleksi: Jurnal Ilmiah." },
    { title: "Education and the Significance of Life", author: "Jiddu Krishnamurti", isbn: "978-0060647841", category: "Pendidikan", year: 2018, cover: "🏫", description: "Buku filsafat pendidikan tentang arti hidup yang sebenarnya. Bahasa: Inggris." },

    // --- Kesehatan ---
    { title: "Anatomi dan Fisiologi untuk Mahasiswa", author: "Evelyn Pearce", isbn: "978-9792209355", category: "Kesehatan", year: 2020, cover: "🩺", description: "Buku pegangan dasar anatomi tubuh manusia untuk perawat dan dokter. Bahasa: Indonesia." },
    { title: "Jurnal Gizi dan Kesehatan Indonesia", author: "Budi Santoso", isbn: "2442-5678", category: "Kesehatan", year: 2023, cover: "🥗", description: "Jurnal riset kesehatan mengenai pola makan sehat. Bahasa: Indonesia. Jenis Koleksi: Jurnal." },

    // --- Hukum ---
    { title: "Tesis Analisis Hukum Perdata Internasional", author: "Rian Hidayat", isbn: "TESIS-HUKUM-2023", category: "Hukum", year: 2023, cover: "⚖️", description: "Tesis untuk gelar Master Hukum mengenai sengketa bisnis lintas negara. Bahasa: Indonesia. Jenis Koleksi: Tesis Akademik." },
    { title: "Pengantar Hukum Indonesia", author: "Soerjono Soekanto", isbn: "978-9794210338", category: "Hukum", year: 2021, cover: "📜", description: "Buku pengantar dasar sistem hukum di Indonesia. Bahasa: Indonesia." },

    // --- Sosial & Humaniora ---
    { title: "Skripsi Dampak Sosial Media terhadap Remaja", author: "Dina Maria", isbn: "SKRIPSI-SOS-2024", category: "Sosial", year: 2024, cover: "📱", description: "Skripsi penelitian kualitatif tentang kecanduan media sosial. Bahasa: Indonesia. Jenis Koleksi: Skripsi." },
    { title: "Sosiologi: Suatu Pengantar", author: "Soerjono Soekanto", isbn: "978-9794210093", category: "Sosial", year: 2022, cover: "👥", description: "Buku pengantar ilmu sosiologi dan interaksi sosial masyarakat. Bahasa: Indonesia." },

    // --- Repository / Umum ---
    { title: "The wisdom of Harry Potter", author: "Edmund M. Kern", isbn: "978-1591021339", category: "Repository", year: 2003, cover: "🔮", description: "Buku analisis filosofis tentang karya fiksi Harry Potter. Bahasa: Inggris." }
  ];

  const books = [];
  for (const bookData of booksData) {
    const book = await prisma.book.upsert({
      where: { isbn: bookData.isbn },
      update: {
        description: bookData.description,
        category: bookData.category,
        year: bookData.year
      },
      create: bookData,
    });
    books.push(book);
  }

  console.log("✅ Books seeded");

  // ========== DELETIONS FOR DEPENDENT TABLES ==========
  // Delete existing fines, transactions, and inventory in correct dependency order
  await prisma.fine.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.inventory.deleteMany({});

  // ========== INVENTORY ==========
  const inventoryData = [
    { bookId: books[0].id, status: "available", locationRack: "Lantai 2, Rak A-1" },
    { bookId: books[0].id, status: "borrowed", locationRack: "Lantai 2, Rak A-1" },
    { bookId: books[1].id, status: "available", locationRack: "Lantai 2, Rak A-3" },
    { bookId: books[2].id, status: "available", locationRack: "Lantai 3, Rak B-2" },
    { bookId: books[2].id, status: "borrowed", locationRack: "Lantai 3, Rak B-2" },
    { bookId: books[3].id, status: "available", locationRack: "Lantai 1, Rak C-5" },
    { bookId: books[4].id, status: "maintenance", locationRack: "Lantai 1, Rak D-1" },
    { bookId: books[5].id, status: "available", locationRack: "Lantai 2, Rak A-4" },
    { bookId: books[6].id, status: "available", locationRack: "Lantai 3, Rak B-6" },
    { bookId: books[7].id, status: "borrowed", locationRack: "Lantai 1, Rak C-2" },
    
    // Add copies for new books
    { bookId: books[8].id, status: "available", locationRack: "Lantai 1, Rak B-1" },
    { bookId: books[9].id, status: "available", locationRack: "Lantai 1, Rak B-2" },
    { bookId: books[10].id, status: "available", locationRack: "Lantai 2, Rak J-1" },
    { bookId: books[11].id, status: "available", locationRack: "Lantai 2, Rak J-2" },
    { bookId: books[12].id, status: "available", locationRack: "Lantai 3, Rak K-1" },
    { bookId: books[13].id, status: "available", locationRack: "Lantai 3, Rak K-2" },
    { bookId: books[14].id, status: "available", locationRack: "Lantai 1, Rak H-1" },
    { bookId: books[15].id, status: "available", locationRack: "Lantai 1, Rak H-2" },
    { bookId: books[16].id, status: "available", locationRack: "Lantai 2, Rak S-1" },
    { bookId: books[17].id, status: "available", locationRack: "Lantai 2, Rak S-2" },
    { bookId: books[18].id, status: "available", locationRack: "Lantai 3, Rak R-1" },
  ];

  const inventories = [];
  for (const invData of inventoryData) {
    const inv = await prisma.inventory.create({ data: invData });
    inventories.push(inv);
  }

  console.log("✅ Inventory seeded");

  // ========== TRANSACTIONS ==========
  await prisma.fine.deleteMany({});
  await prisma.transaction.deleteMany({});

  const t1 = await prisma.transaction.create({
    data: {
      userId: user1.id,
      inventoryId: inventories[1].id, // borrowed copy of book[0]
      borrowDate: new Date("2026-05-20"),
      dueDate: new Date("2026-06-03"),
      status: "overdue",
    },
  });

  const t2 = await prisma.transaction.create({
    data: {
      userId: user1.id,
      inventoryId: inventories[4].id, // borrowed copy of book[2]
      borrowDate: new Date("2026-06-01"),
      dueDate: new Date("2026-06-15"),
      status: "active",
    },
  });

  await prisma.transaction.create({
    data: {
      userId: user2.id,
      inventoryId: inventories[9].id, // borrowed copy of book[7]
      borrowDate: new Date("2026-05-25"),
      dueDate: new Date("2026-06-08"),
      status: "active",
    },
  });

  await prisma.transaction.create({
    data: {
      userId: user1.id,
      inventoryId: inventories[2].id,
      borrowDate: new Date("2026-04-01"),
      dueDate: new Date("2026-04-15"),
      returnDate: new Date("2026-04-14"),
      status: "returned",
    },
  });

  console.log("✅ Transactions seeded");

  // ========== FINES ==========
  await prisma.fine.create({
    data: {
      transactionId: t1.id,
      amount: 15000,
      status: "unpaid",
    },
  });

  console.log("✅ Fines seeded");

  // ========== KNOWLEDGE BASE ==========
  await prisma.knowledgeBase.deleteMany({});

  const kbEntries = [
    { title: "Strategi Pencarian Jurnal Ilmiah", content: "Gunakan kata kunci spesifik dengan operator boolean (AND, OR, NOT). Manfaatkan filter tahun publikasi untuk mendapatkan referensi terkini. Periksa impact factor jurnal melalui database Scopus atau Web of Science.", category: "Riset & Jurnal", access: "Terbuka", createdBy: user3.id },
    { title: "SOP Peminjaman Buku", content: "Prosedur standar peminjaman buku oleh anggota perpustakaan.", category: "SOP & Panduan", access: "Terbuka", createdBy: user3.id },
    { title: "Panduan Penelusuran Koleksi OPAC", content: "Cara menelusur koleksi buku, jurnal, dan media lain menggunakan OPAC perpustakaan.", category: "SOP & Panduan", access: "Terbuka", createdBy: user3.id },
    { title: "SOP Pengembalian Buku", content: "Prosedur standar pengembalian buku dan penanganan denda keterlambatan.", category: "SOP & Panduan", access: "Terbuka", createdBy: user3.id },
    { title: "Kebijakan Akses Jurnal Terbatas", content: "Akses ke database jurnal premium Elsevier dan IEEE hanya diperuntukkan bagi Dosen dan Peneliti dengan akun terverifikasi. Penggunaan di luar kampus memerlukan koneksi VPN universitas.", category: "Kebijakan", access: "Terbatas", createdBy: user3.id },
  ];

  for (const kb of kbEntries) {
    await prisma.knowledgeBase.create({ data: kb });
  }

  console.log("✅ Knowledge Base seeded");
  console.log("🎉 Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

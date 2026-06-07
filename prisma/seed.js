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
      firebaseUid: "firebase_003",
      email: "budi@university.ac.id",
      name: "Budi Pustakawan",
      role: "pustakawan",
      borrowLimit: 10,
    },
  });

  console.log("✅ Users seeded");

  // ========== BOOKS ==========
  const booksData = [
    { title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell & Peter Norvig", isbn: "978-0134610993", category: "AI", year: 2020, cover: "📘" },
    { title: "Introduction to Algorithms", author: "Thomas H. Cormen", isbn: "978-0262033848", category: "Algoritma", year: 2022, cover: "📗" },
    { title: "Deep Learning", author: "Ian Goodfellow", isbn: "978-0262035613", category: "AI", year: 2023, cover: "📕" },
    { title: "Database System Concepts", author: "Abraham Silberschatz", isbn: "978-0078022159", category: "Database", year: 2023, cover: "📙" },
    { title: "Clean Code: A Handbook of Agile Software", author: "Robert C. Martin", isbn: "978-0132350884", category: "Software Engineering", year: 2022, cover: "📓" },
    { title: "Design Patterns: Elements of Reusable Software", author: "Erich Gamma et al.", isbn: "978-0201633610", category: "Software Engineering", year: 2020, cover: "📔" },
    { title: "The Pragmatic Programmer", author: "David Thomas & Andrew Hunt", isbn: "978-0135957059", category: "Software Engineering", year: 2023, cover: "📒" },
    { title: "Computer Networking: A Top-Down Approach", author: "James Kurose", isbn: "978-0133594140", category: "Jaringan", year: 2021, cover: "📘" },
  ];

  const books = [];
  for (const bookData of booksData) {
    const book = await prisma.book.upsert({
      where: { isbn: bookData.isbn },
      update: {},
      create: bookData,
    });
    books.push(book);
  }

  console.log("✅ Books seeded");

  // ========== INVENTORY ==========
  // Delete existing inventory first to avoid duplicates
  await prisma.inventory.deleteMany({});

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
    { title: "Panduan Perpanjangan Pinjaman", content: "Buku dapat diperpanjang maksimal 1 kali selama 7 hari. Perpanjangan hanya bisa dilakukan jika tidak ada antrian peminjam lain untuk buku tersebut. Perpanjangan bisa dilakukan secara online melalui akun RuangAksara atau datang langsung ke meja sirkulasi.", createdBy: user3.id },
    { title: "Strategi Pencarian Jurnal Ilmiah", content: "Gunakan kata kunci spesifik dengan operator boolean (AND, OR, NOT). Manfaatkan filter tahun publikasi untuk mendapatkan referensi terkini. Periksa impact factor jurnal melalui database Scopus atau Web of Science.", createdBy: user3.id },
    { title: "SOP Peminjaman Buku", content: "1) Login ke sistem RuangAksara. 2) Cari buku melalui pencarian semantik. 3) Klik tombol 'Pinjam' pada buku yang tersedia. 4) Konfirmasi peminjaman. 5) Ambil buku di rak yang tertera. 6) Durasi pinjam standar adalah 14 hari.", createdBy: user3.id },
    { title: "Kebijakan Denda Keterlambatan", content: "Denda keterlambatan pengembalian buku sebesar Rp 1.000 per hari per buku. Denda maksimal adalah Rp 50.000 per buku. Jika denda belum dibayar, peminjaman baru tidak dapat dilakukan.", createdBy: user3.id },
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

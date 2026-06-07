# 📚 RuangAksara — Sistem Perpustakaan Canggih Berbasis AI

<p align="center">
  <strong>Sistem Manajemen Perpustakaan Modern dengan Kecerdasan Buatan</strong><br>
  Dibangun menggunakan Next.js, Firebase, Prisma & Groq AI
</p>

---

## 🌟 Tentang RuangAksara

**RuangAksara** adalah platform perpustakaan digital canggih yang dirancang untuk membantu institusi pendidikan dalam mengelola koleksi buku, jurnal, disertasi, dan artikel penelitian secara modern dan efisien. Dengan integrasi **Artificial Intelligence (AI)**, RuangAksara menghadirkan pengalaman pencarian dan interaksi yang lebih cerdas dibandingkan sistem perpustakaan konvensional.

Sistem ini dikembangkan sebagai proyek **Ujian Akhir Semester (UAS)** mata kuliah Media Pembelajaran.

---

## ✨ Fitur Utama

### 🤖 Chatbot AI (RuangAksara Assistant)
- Asisten virtual berbasis **Groq AI (Llama 3.3 70B)** dengan fallback ke **Google Gemini**
- Mampu menjawab pertanyaan seputar perpustakaan secara natural dan humanis
- Mendukung percakapan kontekstual (mengingat riwayat chat)
- Animasi loading bubble saat AI sedang memproses jawaban

### 🔍 Pencarian Semantik AI
- Pencarian buku menggunakan pemahaman semantik, bukan hanya keyword matching
- Pengguna bisa mencari dengan bahasa natural (contoh: "buku tentang kecerdasan buatan")

### 📖 Katalog & Repository Digital
- Koleksi lengkap: Buku, Jurnal, Skripsi, Disertasi, Artikel Penelitian
- Filter berdasarkan kategori, tahun, dan jenis koleksi
- Statistik koleksi: 15.000+ buku, 5.200+ jurnal, 12.500+ artikel penelitian

### 🔄 Sistem Sirkulasi
- Peminjaman dan pengembalian buku secara digital
- Tracking status peminjaman real-time
- Perhitungan denda otomatis untuk keterlambatan

### 🧠 Knowledge Base
- Basis pengetahuan khusus untuk pustakawan
- Eksternalisasi dan sharing pengetahuan antar pustakawan
- Manajemen informasi perpustakaan terpusat

### 👤 Autentikasi & Dashboard
- Sistem login/register dengan **Firebase Authentication**
- Dashboard personal untuk setiap pengguna
- Manajemen profil dan riwayat aktivitas

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi |
|---|---|
| **Frontend** | Next.js 15, React 19, CSS3 |
| **Backend** | Next.js API Routes |
| **Database** | PostgreSQL + Prisma ORM |
| **Autentikasi** | Firebase Authentication |
| **AI Provider (Primary)** | Groq API (Llama 3.3 70B, Llama 3.1 8B, Gemma2, Mixtral) |
| **AI Provider (Fallback)** | Google Gemini API (1.5 Flash, 2.0 Flash, 2.5 Pro) |
| **Styling** | Vanilla CSS dengan Custom Design System |
| **Animasi** | Intersection Observer API, CSS Animations |

---

## 📁 Struktur Proyek

```
libkms-ai/
├── prisma/                    # Database schema & seed
│   ├── schema.prisma
│   └── seed.js
├── public/                    # Aset statis (gambar, logo)
├── src/
│   ├── app/
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Autentikasi (register, verify, me)
│   │   │   ├── books/         # CRUD buku
│   │   │   ├── chat/          # Chatbot AI (Groq + Gemini)
│   │   │   ├── circulation/   # Sirkulasi peminjaman
│   │   │   ├── knowledge/     # Knowledge base
│   │   │   └── search/        # Pencarian semantik
│   │   ├── circulation/       # Halaman sirkulasi
│   │   ├── dashboard/         # Dashboard pengguna & admin
│   │   ├── knowledge/         # Halaman knowledge base
│   │   ├── login/             # Halaman login
│   │   ├── register/          # Halaman register
│   │   ├── repository/        # Halaman repository
│   │   ├── search/            # Halaman pencarian
│   │   ├── globals.css        # Design system & global styles
│   │   ├── layout.js          # Root layout
│   │   └── page.js            # Landing page
│   ├── components/            # Komponen reusable
│   │   ├── ChatBubble.js      # Widget chatbot AI
│   │   ├── Navbar.js          # Navigasi utama
│   │   ├── Footer.js          # Footer
│   │   ├── BookCard.js        # Kartu buku
│   │   └── ...
│   ├── contexts/              # React Context
│   │   └── AuthContext.js     # Context autentikasi
│   └── lib/                   # Utilitas & konfigurasi
│       ├── db.js              # Koneksi database Prisma
│       ├── firebase.js        # Konfigurasi Firebase
│       └── mockData.js        # Data mock untuk demo
└── .env.local                 # Environment variables
```

---

## 🚀 Cara Menjalankan

### Prasyarat
- **Node.js** v18 atau lebih baru
- **PostgreSQL** (opsional, sistem memiliki fallback ke mock data)
- **API Key Groq** (gratis di [console.groq.com](https://console.groq.com))

### Instalasi

```bash
# 1. Clone repository
git clone https://github.com/ARAEMXA26/RuangAksara.git
cd RuangAksara

# 2. Install dependencies
npm install

# 3. Konfigurasi environment
# Edit file .env.local sesuai kebutuhan Anda

# 4. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## ⚙️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────┐
│                    CLIENT                        │
│  (Next.js Frontend + React Components)           │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│              NEXT.JS API ROUTES                  │
│  /api/chat  /api/books  /api/auth  /api/search   │
└──────┬──────────┬───────────┬───────────────────┘
       │          │           │
       ▼          ▼           ▼
  ┌────────┐  ┌────────┐  ┌──────────┐
  │ Groq   │  │PostgreSQL│ │ Firebase │
  │ AI API │  │ (Prisma) │ │   Auth   │
  └───┬────┘  └────────┘  └──────────┘
      │
      ▼ (fallback)
  ┌────────┐
  │ Gemini │
  │ AI API │
  └────────┘
```

---

## 👨‍💻 Pengembang

| Nama | NIM |
|---|---|
| **Arae Mahesa Armera** | 2024081015 |
| **Laurensius Jovito Mahaputra Darsono** | 2024081008 |
| **Ruud Zaki Bramdani** | 2024081028 |

Dikembangkan sebagai proyek UAS Semester 4.

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik.
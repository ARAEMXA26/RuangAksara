"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, HelpCircle, MessageSquare, Mail, Clock, ChevronDown, ChevronUp, Sparkles, BookOpen, User, ShieldCheck } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 1,
    category: "akun",
    question: "Bagaimana cara melakukan registrasi akun di RuangAksara?",
    answer: "Anda dapat menekan tombol 'Daftar' di pojok kanan atas halaman masuk (login). Isi formulir dengan nama lengkap, alamat email institusi, password, dan pilih peran Anda (Mahasiswa atau Dosen). Setelah itu, klik tombol 'Daftar Sekarang' dan Anda akan diarahkan untuk masuk ke sistem."
  },
  {
    id: 2,
    category: "akun",
    question: "Bagaimana cara mengubah peran (role) akun saya menjadi Pustakawan?",
    answer: "Untuk alasan keamanan sistem, pengubahan peran (role) menjadi Pustakawan (Admin) memerlukan verifikasi dokumen kredensial dan hak akses basis data secara langsung. Silakan hubungi Administrator IT Perpustakaan di meja layanan utama atau kirimkan email permohonan resmi Anda."
  },
  {
    id: 3,
    category: "sirkulasi",
    question: "Bagaimana alur peminjaman buku di RuangAksara?",
    answer: "1. Cari buku yang Anda inginkan melalui menu 'Pencarian Koleksi'.\n2. Klik buku tersebut untuk membuka halaman detailnya, lalu klik tombol 'Pinjam Buku'.\n3. Permintaan Anda akan masuk ke antrean persetujuan Pustakawan.\n4. Kunjungi meja perpustakaan fisik, tunjukkan profil digital Anda, dan Pustakawan akan menyetujui peminjaman di sistem lalu menyerahkan buku fisik kepada Anda."
  },
  {
    id: 4,
    category: "sirkulasi",
    question: "Berapa lama batas waktu peminjaman buku yang diizinkan?",
    answer: "Batas waktu peminjaman standar untuk Mahasiswa adalah 7 hari kalender, sedangkan untuk Dosen adalah 14 hari kalender. Anda dapat memantau sisa hari tenggat waktu peminjaman secara real-time pada dashboard akun Anda."
  },
  {
    id: 5,
    category: "sirkulasi",
    question: "Berapa denda keterlambatan jika saya terlambat mengembalikan buku?",
    answer: "Denda keterlambatan yang ditetapkan sistem adalah sebesar Rp 1.000 per hari untuk setiap buku yang dipinjam. Denda akan terakumulasi otomatis di dashboard Anda sampai buku fisik dikembalikan ke Pustakawan dan transaksi dinyatakan selesai."
  },
  {
    id: 6,
    category: "ai",
    question: "Apa itu fitur Pencarian Semantik (AI-Powered Search)?",
    answer: "Berbeda dari pencarian konvensional yang mencocokkan kata kunci secara persis, Pencarian Semantik di RuangAksara memanfaatkan kecerdasan buatan untuk memahami makna, konteks, dan niat (intent) di balik kueri pencarian Anda. Anda dapat mengetik menggunakan bahasa alami (contoh: 'buku tentang cara membuat website dengan react') dan AI akan menyajikan referensi yang relevan secara kontekstual."
  },
  {
    id: 7,
    category: "ai",
    question: "Bagaimana cara kerja chatbot Asisten Virtual di pojok kanan bawah?",
    answer: "Asisten Virtual AI kami siap membantu Anda 24/7. Anda dapat menanyakan tentang ketersediaan buku, panduan penggunaan perpustakaan, informasi SOP sirkulasi perpustakaan, atau bahkan meminta rangkuman dan rekomendasi topik riset akademik tertentu secara interaktif."
  },
  {
    id: 8,
    category: "pustakawan",
    question: "Bagaimana cara pustakawan menghapus user yang masih memiliki peminjaman aktif?",
    answer: "Sistem RuangAksara yang baru kini memperbolehkan pustakawan menghapus akun user kapan saja meskipun user tersebut masih memiliki peminjaman aktif. Saat user dihapus, sistem secara otomatis akan me-release status buku yang dipinjam kembali menjadi 'Tersedia' (available) agar dapat kembali disirkulasikan, serta menghapus seluruh riwayat transaksi terkait."
  }
];

export default function BantuanPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("semua");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const filteredFAQs = FAQS.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "semua" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-primary selection:text-white">


      {/* Hero Section */}
      <section className="relative pt-44 pb-20 overflow-hidden bg-white border-b border-slate-100">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-indigo-300/5 rounded-full blur-3xl -z-10 -translate-y-1/2" />
        
        <div className="max-w-4xl mx-auto px-6 relative text-center">
          <AnimatedSection>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-wider mb-6 border border-blue-100">
              Pusat Dukungan
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              Ada yang Bisa Kami <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Bantu?</span>
            </h1>
            <p className="text-base md:text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
              Temukan jawaban atas pertanyaan Anda mengenai akun, sirkulasi peminjaman buku, denda, dan integrasi asisten AI perpustakaan.
            </p>

            {/* Interactive Search Bar */}
            <div className="max-w-xl mx-auto relative shadow-lg rounded-2xl">
              <input
                type="text"
                placeholder="Cari panduan, pertanyaan, atau kata kunci..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ height: "54px", boxSizing: "border-box" }}
                className="w-full pl-14 pr-6 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Support Section */}
      <section id="faq" className="py-20 max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12 items-start">
          
          {/* FAQ Categories Sidebar */}
          <div className="md:col-span-4 space-y-3 sticky top-28">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-3 mb-4">Kategori Bantuan</h3>
            {[
              { id: "semua", label: "Semua FAQ", icon: <HelpCircle size={18} /> },
              { id: "akun", label: "Akun & Keanggotaan", icon: <User size={18} /> },
              { id: "sirkulasi", label: "Sirkulasi & Peminjaman", icon: <BookOpen size={18} /> },
              { id: "ai", label: "Fitur Pintar AI", icon: <Sparkles size={18} /> },
              { id: "pustakawan", label: "Panduan Pustakawan", icon: <ShieldCheck size={18} /> }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setExpandedFAQ(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat.id 
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/10" 
                    : "bg-white text-slate-600 border-slate-200/60 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQs List Accordion */}
          <div className="md:col-span-8 space-y-4">
            <AnimatedSection>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-2.5">
                Pertanyaan Sering Diajukan (FAQ)
                <span className="text-sm font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {filteredFAQs.length}
                </span>
              </h2>
            </AnimatedSection>

            {filteredFAQs.length > 0 ? (
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div 
                    key={faq.id}
                    className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                    >
                      <span className="font-bold text-slate-900 pr-4 text-base md:text-lg">
                        {faq.question}
                      </span>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="text-primary shrink-0" size={20} />
                      ) : (
                        <ChevronDown className="text-slate-400 shrink-0" size={20} />
                      )}
                    </button>
                    
                    {expandedFAQ === faq.id && (
                      <div className="px-6 pb-6 pt-2 border-t border-slate-50">
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center">
                <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h4 className="font-bold text-slate-800 text-lg mb-2">Pencarian Tidak Ditemukan</h4>
                <p className="text-slate-500 text-sm">Coba kata kunci lain atau silakan hubungi tim pustakawan kami.</p>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Support Contact Section */}
      <section id="kontak" className="pt-24 pb-36 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-primary tracking-widest uppercase mb-3">Butuh Bantuan Lebih Lanjut?</h2>
            <h3 className="text-3xl font-extrabold text-slate-900">Hubungi Layanan Meja Pustakawan</h3>
            <p className="text-slate-600 text-sm md:text-base mt-4 max-w-xl mx-auto">
              Tim pustakawan kami siap membantu Anda secara langsung atau secara daring pada jam operasional kerja.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1.5 hover:border-primary/20 hover:bg-blue-50/10 transition-all duration-300 min-h-[260px] shadow-sm">
              <div>
                <MessageSquare className="w-8 h-8 text-primary mb-4" />
                <h4 className="font-bold text-slate-800 text-lg mb-2">WhatsApp Pustakawan</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">Konsultasikan keluhan akun atau reservasi buku secara instan.</p>
              </div>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark font-semibold text-sm inline-flex items-center gap-1 mt-auto">
                Hubungi via WhatsApp →
              </a>
            </div>

            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1.5 hover:border-primary/20 hover:bg-blue-50/10 transition-all duration-300 min-h-[260px] shadow-sm">
              <div>
                <Mail className="w-8 h-8 text-primary mb-4" />
                <h4 className="font-bold text-slate-800 text-lg mb-2">Kirim Surel / Email</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">Kirimkan permohonan akses, reset password, atau kerjasama perpustakaan.</p>
              </div>
              <a href="mailto:perpustakaan@university.ac.id" className="text-primary hover:text-primary-dark font-semibold text-sm inline-flex items-center gap-1 mt-auto">
                Kirim Email Dukungan →
              </a>
            </div>

            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1.5 hover:border-primary/20 hover:bg-blue-50/10 transition-all duration-300 min-h-[260px] shadow-sm">
              <div>
                <Clock className="w-8 h-8 text-primary mb-4" />
                <h4 className="font-bold text-slate-800 text-lg mb-2">Jam Kerja Layanan</h4>
                <div className="text-slate-500 text-sm leading-relaxed space-y-1 mb-4">
                  <div><strong>Senin - Jumat:</strong> 08:00 - 16:30 WIB</div>
                  <div><strong>Sabtu:</strong> 09:00 - 13:00 WIB</div>
                </div>
              </div>
              <Link href="/tentang-kami" className="text-primary hover:text-primary-dark font-semibold text-sm inline-flex items-center gap-1 mt-auto">
                Kunjungi Lokasi Fisik →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import {
  Search, Book, BookOpen, Brain, GraduationCap, Monitor,
  FileText, Headphones, ChevronLeft, ChevronRight,
  ArrowRight, Plus, Minus, MapPin,
  Phone, Mail, Users, Award, Sparkles, Database, Layers
} from "lucide-react";
import Image from "next/image";

const socialLinks = [
  {
    href: "https://www.instagram.com/",
    label: "Instagram",
    icon: (
      <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.88 1.75a1.12 1.12 0 1 1 0 2.24 1.12 1.12 0 0 1 0-2.24ZM12 6.5A5.5 5.5 0 1 1 6.5 12 5.5 5.5 0 0 1 12 6.5Zm0 1.5A4 4 0 1 0 16 12a4 4 0 0 0-4-4Z" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/",
    label: "LinkedIn",
    icon: (
      <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.98 3.5A1.98 1.98 0 1 1 5 7.46 1.98 1.98 0 0 1 4.98 3.5ZM3.5 8.75h2.96V20.5H3.5V8.75Zm5.25 0h2.84v1.6h.04c.4-.75 1.37-1.84 3.34-1.84 3.57 0 4.23 2.35 4.23 5.4v6.59h-2.96v-5.84c0-1.39-.03-3.18-1.94-3.18-1.95 0-2.25 1.52-2.25 3.08v5.94H8.75V8.75Z" />
      </svg>
    ),
  },
  {
    href: "https://github.com/",
    label: "GitHub",
    icon: (
      <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1-.02-1.97-3.2.69-3.88-1.54-3.88-1.54-.52-1.32-1.28-1.67-1.28-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.52-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a10.95 10.95 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.39-5.26 5.67.41.36.78 1.08.78 2.18 0 1.57-.01 2.84-.01 3.23 0 .31.2.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const heroRef = useRef(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const popularScrollRef = useRef(null);
  const [bgSrc, setBgSrc] = useState("/library-hero.png");
  const [bgError, setBgError] = useState(false);

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/books");
        const data = await res.json();
        setBooks(data.books || []);
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // ... (keep categories and other arrays inside)
  const kategoriKoleksi = [
    { icon: <Book size={28} />, label: "Buku" },
    { icon: <Monitor size={28} />, label: "E-Book" },
    { icon: <FileText size={28} />, label: "Jurnal" },
    { icon: <BookOpen size={28} />, label: "Skripsi" },
    { icon: <GraduationCap size={28} />, label: "Tesis" },
    { icon: <Award size={28} />, label: "Disertasi" },
    { icon: <Headphones size={28} />, label: "Multimedia" },
  ];

  const popularBooks = [
    { rank: 1, title: "Deep Learning", author: "Ian Goodfellow", year: 2023, cover: "📕" },
    { rank: 2, title: "Clean Code", author: "Robert C. Martin", year: 2022, cover: "📓" },
    { rank: 3, title: "Design Thinking", author: "Tim Brown", year: 2023, cover: "📙" },
    { rank: 4, title: "Statistik Untuk Penelitian", author: "Sugiyono", year: 2023, cover: "📗" },
    { rank: 5, title: "Database System Concepts", author: "Abraham Silberschatz", year: 2023, cover: "📘" },
  ];

  const repoItems = [
    { icon: <FileText size={18} />, label: "Skripsi", count: "4.250" },
    { icon: <GraduationCap size={18} />, label: "Tesis", count: "2.150" },
    { icon: <Award size={18} />, label: "Disertasi", count: "850" },
    { icon: <BookOpen size={18} />, label: "Artikel Penelitian", count: "12.500" },
  ];

  const katalogTerbaru = [
    { icon: <Book size={18} />, title: "Pemrograman Web Lanjut", desc: "Koleksi Buku Teks • 2024" },
    { icon: <FileText size={18} />, title: "Jurnal Ilmu Komputer", desc: "Koleksi Jurnal Ilmiah • 2023" },
    { icon: <Monitor size={18} />, title: "Sistem Informasi Manajemen", desc: "Koleksi E-Book • 2023" },
    { icon: <Layers size={18} />, title: "Prosiding Seminar Nasional", desc: "Koleksi Prosiding • 2022" },
  ];

  const testimonials = [
    { name: "Dinda Aulia", role: "Mahasiswa", text: "\"RuangAksara sangat membantu saya menemukan referensi yang relevan dengan cepat dan mudah.\"" },
    { name: "Dr. Budi Santoso", role: "Dosen", text: "\"Koleksi jurnalnya lengkap, sangat mendukung penelitian dan publikasi kami.\"" },
    { name: "Ricky Kurniawan", role: "Peneliti", text: "\"Repository akademik memudahkan akses terhadap karya ilmiah di lingkungan kampus.\"" },
  ];

  const faqItems = [
    { q: "Bagaimana cara mencari buku di perpustakaan digital?", a: "Anda dapat menggunakan fitur Pencarian Semantik AI kami. Cukup ketik kata kunci atau pertanyaan dengan bahasa alami, dan sistem akan menemukan buku yang paling relevan untuk Anda." },
    { q: "Bagaimana cara mengakses jurnal berlangganan?", a: "Jurnal berlangganan dapat diakses melalui menu Katalog. Anda perlu login terlebih dahulu untuk mendapatkan akses penuh ke database jurnal yang tersedia." },
    { q: "Bagaimana cara mengunduh e-book atau karya ilmiah?", a: "Setelah login, buka halaman detail koleksi yang Anda inginkan. Klik tombol 'Unduh' jika tersedia dalam format digital. Beberapa koleksi mungkin memiliki batasan akses." },
  ];

  const popularTags = ["Machine Learning", "Manajemen", "Teknologi Informasi", "Kesehatan"];

  const scrollPopular = (dir: any) => {
    if (popularScrollRef.current) {
      (popularScrollRef.current as any).scrollBy({ left: dir * 260, behavior: "smooth" });
    }
  };

  return (
    <div className="landing-page">
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-32 pb-20 bg-white" ref={heroRef}>
        {/* Background Image UPJ */}
        <div className="absolute inset-0 z-0 flex justify-center items-center bg-gray-50">
          {!bgError ? (
            <Image 
              src={bgSrc} 
              alt="UPJ Background" 
              fill
              priority
              sizes="100vw"
              onError={() => setBgError(true)}
              style={{ objectFit: "cover", objectPosition: "center" }}
              className="scale-135 translate-y-32 opacity-[0.9] transition-all duration-500" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-slate-100 via-indigo-50 to-slate-100 opacity-60"></div>
          )}
          {/* Gradient overlays to fade into white at top and bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center px-4 max-w-4xl mx-auto text-center mt-8">
          {/* Title Image */}
          <Image 
            src="/group-408.png" 
            alt="Ruang Aksara Library" 
            width={576}
            height={295}
            priority
            className="w-full max-w-xl mb-8 h-auto"
          />

          {/* Description */}
          <p className="font-sans text-black text-base md:text-lg font-normal leading-relaxed max-w-3xl mb-10">
            Perpustakaan Cerdas dengan AI & Knowledge Management adalah
            perpustakaan modern yang memakai AI untuk membantu mencari informasi
            dan Knowledge Management untuk mengatur pengetahuan agar mudah
            diakses.
          </p>

          {/* Search Button */}
          <Link href="/search" className="relative group mb-14 inline-block">
            <div className="bg-black text-white px-8 py-3.5 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_25px_rgba(0,0,0,0.3)] transition-all duration-300 transform group-hover:-translate-y-1">
              <span className="font-light text-base md:text-lg tracking-wider uppercase">
                MULAI PENCARIAN
              </span>
            </div>
          </Link>

          {/* Social Links */}
          <nav aria-label="Social media">
            <ul className="flex items-center gap-6 md:gap-8">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label}
                    className="block text-black w-7 h-7 md:w-9 md:h-9 hover:text-primary transition-transform hover:scale-110"
                  >
                    {link.icon}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <AnimatedSection>
        <section className="lp-stats-bar">
          <div className="container">
            <div className="lp-stats-grid">
              {[
                { icon: <Book size={28} />, value: "150.000+", label: "Buku" },
                { icon: <FileText size={28} />, value: "25.000+", label: "Jurnal" },
                { icon: <GraduationCap size={28} />, value: "8.000+", label: "Skripsi & Tesis" },
                { icon: <Users size={28} />, value: "50.000+", label: "Anggota Aktif" },
              ].map((stat, i) => (
                <div key={i} className="lp-stat-card">
                  <div className="lp-stat-icon">{stat.icon}</div>
                  <div>
                    <div className="lp-stat-value">{stat.value}</div>
                    <div className="lp-stat-label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ===== FITUR UNGGULAN ===== */}
      <AnimatedSection>
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Fitur Unggulan</h2>
            </div>
            <div className="lp-features-grid">
              {[
                { icon: <Search size={28} />, title: "Smart Search", desc: "Pencarian semantik berbasis AI untuk menemukan informasi lebih relevan." },
                { icon: <Brain size={28} />, title: "Knowledge Management", desc: "Menghubungkan informasi dan referensi ke wawasan yang lebih mendalam." },
                { icon: <Database size={28} />, title: "Repository Akademik", desc: "Akses karya ilmiah, skripsi, tesis, disertasi, dan publikasi penelitian." },
                { icon: <Layers size={28} />, title: "Digital Collection", desc: "Koleksi digital lengkap mulai dari e-book, jurnal, hingga multimedia pembelajaran." },
              ].map((f, i) => (
                <div key={i} className="lp-feature-card">
                  <div className="lp-feature-icon">{f.icon}</div>
                  <h3 className="lp-feature-title">{f.title}</h3>
                  <p className="lp-feature-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ===== LAYANAN KAMI ===== */}
      <AnimatedSection>
        <section className="layanan-section">
          <div className="layanan-container">
            <div className="layanan-left">
              <h2 className="layanan-title">
                Layanan <span className="layanan-highlight">Kami</span>
              </h2>
              <p className="layanan-desc">
                Kami menyediakan layanan perpustakaan cerdas dan repositori akademik berbasis AI yang dirancang untuk mempermudah penemuan literatur dan mendukung kegiatan riset Anda.
              </p>

              <div className="layanan-list">
                <div className="layanan-item">
                  <div className="layanan-item-left">
                    <span className="layanan-item-num">01</span>
                    <span className="layanan-item-title">Katalog Digital AI</span>
                  </div>
                  <div className="layanan-item-arrow"><ArrowRight size={16} /></div>
                </div>

                <div className="layanan-item">
                  <div className="layanan-item-left">
                    <span className="layanan-item-num">02</span>
                    <span className="layanan-item-title">Sistem Repositori</span>
                  </div>
                  <div className="layanan-item-arrow"><ArrowRight size={16} /></div>
                </div>

                <div className="layanan-item">
                  <div className="layanan-item-left">
                    <span className="layanan-item-num">03</span>
                    <span className="layanan-item-title">Dukungan Riset</span>
                  </div>
                  <div className="layanan-item-arrow"><ArrowRight size={16} /></div>
                </div>

                <div className="layanan-item">
                  <div className="layanan-item-left">
                    <span className="layanan-item-num">04</span>
                    <span className="layanan-item-title">Analitik Data</span>
                  </div>
                  <div className="layanan-item-arrow"><ArrowRight size={16} /></div>
                </div>
              </div>
            </div>

            <div className="layanan-right">
              <Link href="/tentang-kami" className="layanan-showcase block cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] relative group">
                <div className="layanan-badge layanan-badge-top-left transition-colors duration-300 group-hover:bg-black group-hover:text-white">TENTANG KAMI</div>
                <Image
                  src="/team-photo.png"
                  alt="Tim Kami"
                  fill
                  className="object-contain object-bottom pointer-events-none z-10 scale-[0.85] origin-bottom translate-y-[8%] transition-transform duration-500 group-hover:scale-[0.88]"
                />
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ===== JELAJAHI KOLEKSI ===== */}
      <AnimatedSection>
        <section className="section">
          <div className="container">
            <h2 className="section-title" style={{ marginBottom: "32px", textAlign: "center" }}>Jelajahi Koleksi</h2>
            <div className="marquee-wrapper" style={{ overflow: 'hidden', width: '100%', padding: '10px 0' }}>
              <div className="marquee-content">
                {[...kategoriKoleksi, ...kategoriKoleksi, ...kategoriKoleksi, ...kategoriKoleksi].map((cat, i) => (
                  <Link href="/search" key={i} className="lp-category-card" style={{ flexShrink: 0, width: '160px' }}>
                    <div className="lp-category-icon">{cat.icon}</div>
                    <span className="lp-category-label">{cat.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ===== BUKU BARU ===== */}
      <AnimatedSection>
        <section className="section">
          <div className="container">
            <div className="lp-section-header-row" style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
              <h2 className="section-title" style={{ marginBottom: "0", textAlign: "center" }}>Buku Baru</h2>
              <Link href="/search" className="lp-link-arrow">Lihat semua <ArrowRight size={16} /></Link>
            </div>
            <div className="lp-scroll-wrapper">
              <button className="lp-scroll-btn lp-scroll-left" onClick={() => scrollPopular(-1)}><ChevronLeft size={20} /></button>
              <div className="lp-scroll-container" ref={popularScrollRef}>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="lp-book-card" style={{ minHeight: "280px" }}>
                      <div className="lp-book-cover skeleton-box" style={{ height: "150px" }} />
                      <div className="lp-book-info" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div className="skeleton-line" style={{ width: "85%", height: "16px" }} />
                        <div className="skeleton-line" style={{ width: "60%", height: "12px" }} />
                        <div className="skeleton-line" style={{ width: "35%", height: "20px", marginTop: "8px" }} />
                      </div>
                    </div>
                  ))
                ) : books.length > 0 ? (
                  books.map((book, index) => {
                    const isNew = index < 3;
                    const isAvailable = (book.available ?? 0) > 0;
                    return (
                      <div key={book.id || index} className="lp-book-card" style={{ display: "flex", flexDirection: "column" }}>
                        <div className="lp-book-cover" style={{ position: "relative", height: "150px" }}>
                          {isNew && <div className="lp-book-badge-new">Baru</div>}
                          <div className={`lp-book-badge-status ${isAvailable ? "available" : "unavailable"}`}>
                            <span className="status-dot"></span>
                            {isAvailable ? "Tersedia" : "Habis"}
                          </div>
                          {book.cover && (book.cover.startsWith("http://") || book.cover.startsWith("https://") || book.cover.startsWith("/")) ? (
                            <img src={book.cover} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ fontSize: "3rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {book.cover || "📘"}
                            </div>
                          )}
                        </div>
                        <div className="lp-book-info">
                          <div>
                            <h4 className="lp-book-title" title={book.title}>{book.title}</h4>
                            <p className="lp-book-author">{book.author}</p>
                          </div>
                          <div>
                            <span className="lp-book-year" style={{ display: "inline-block", alignSelf: "flex-start" }}>{book.year}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  popularBooks.map((book) => (
                    <div key={book.rank} className="lp-book-card">
                      <div className="lp-book-cover" style={{ position: "relative", height: "150px" }}>
                        <div style={{ fontSize: "3rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {book.cover || "📘"}
                        </div>
                      </div>
                      <div className="lp-book-info">
                        <div>
                          <h4 className="lp-book-title" title={book.title}>{book.title}</h4>
                          <p className="lp-book-author">{book.author}</p>
                        </div>
                        <div>
                          <span className="lp-book-year" style={{ display: "inline-block", alignSelf: "flex-start" }}>{book.year}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button className="lp-scroll-btn lp-scroll-right" onClick={() => scrollPopular(1)}><ChevronRight size={20} /></button>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ===== REPOSITORY + EVENT ===== */}
      <AnimatedSection>
        <section className="section">
          <div className="container">
            <div className="lp-dual-grid">
              <div className="lp-repo-card">
                <h3 className="lp-card-heading">Repository Akademik</h3>
                <div className="lp-repo-list">
                  {repoItems.map((item, i) => (
                    <div key={i} className="lp-repo-item">
                      <div className="lp-repo-icon">{item.icon}</div>
                      <span className="lp-repo-label">{item.label}</span>
                      <span className="lp-repo-count">{item.count}</span>
                    </div>
                  ))}
                </div>
                <Link href="/search" className="lp-link-arrow" style={{ marginTop: "16px" }}>Lihat semua repository <ArrowRight size={16} /></Link>
              </div>
              <div className="lp-repo-card">
                <h3 className="lp-card-heading">Katalog Terbaru</h3>
                <div className="lp-event-list">
                  {katalogTerbaru.map((item, i) => (
                    <div key={i} className="lp-event-item">
                      <div className="lp-repo-icon">
                        {item.icon}
                      </div>
                      <div className="lp-event-info">
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                      <ChevronRight size={18} className="lp-event-arrow" />
                    </div>
                  ))}
                </div>
                <Link href="/dashboard" className="lp-link-arrow" style={{ marginTop: "16px" }}>Lihat semua katalog <ArrowRight size={16} /></Link>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ===== TESTIMONIAL ===== */}
      <AnimatedSection>
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Apa Kata Mereka?</h2>
            </div>
            <div className="lp-testimonial-grid">
              {testimonials.map((t, i) => (
                <div key={i} className="lp-testimonial-card">
                  <div className="lp-testimonial-avatar"><Users size={24} /></div>
                  <p className="lp-testimonial-text">{t.text}</p>
                  <h4 className="lp-testimonial-name">{t.name}</h4>
                  <span className="lp-testimonial-role">{t.role}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ===== FAQ ===== */}
      <AnimatedSection>
        <section className="section">
          <div className="container" style={{ maxWidth: "800px" }}>
            <div className="section-header">
              <h2 className="section-title">FAQ</h2>
            </div>
            <div className="lp-faq-list">
              {faqItems.map((faq, i) => (
                <div key={i} className={`lp-faq-item ${activeFaq === i ? "active" : ""}`}>
                  <button className="lp-faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                    <span>{faq.q}</span>
                    {activeFaq === i ? <Minus size={18} /> : <Plus size={18} />}
                  </button>
                  {activeFaq === i && (<div className="lp-faq-answer">{faq.a}</div>)}
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>


    </div>
  );
}


"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import {
  Search, Book, BookOpen, Brain, GraduationCap, Monitor,
  FileText, Headphones, ChevronLeft, ChevronRight,
  ArrowRight, Plus, Minus, MapPin,
  Phone, Mail, Users, Award, Sparkles, Database, Layers
} from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  const heroRef = useRef(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const popularScrollRef = useRef(null);

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

  const events = [
    { date: "15", month: "MEI", title: "Webinar Literasi Digital", desc: "Strategi mencari referensi ilmiah yang efektif" },
    { date: "22", month: "MEI", title: "Workshop Penulisan Karya Ilmiah", desc: "Teknik menulis dan publikasi untuk mahasiswa" },
    { date: "29", month: "MEI", title: "Pelatihan Sitasi dengan Mendeley", desc: "Kelola referensi dengan mudah dan cepat" },
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



  const scrollPopular = (dir) => {
    if (popularScrollRef.current) {
      popularScrollRef.current.scrollBy({ left: dir * 260, behavior: "smooth" });
    }
  };

  return (
    <div className="landing-page">
      {/* ===== HERO SECTION ===== */}
      <section className="hero" ref={heroRef}>
        <div className="hero-content">
          <div className="hero-center" style={{ width: '100%', maxWidth: 1280, paddingTop: 80, paddingBottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="hero-text-content" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
              <div className="hero-badge">
                RUANG AKSARA
              </div>
              <div style={{ width: "100%", maxWidth: 896, position: 'relative' }}>
                <h1 className="hero-title" style={{ textAlign: "center", width: "100%" }}>
                  Perpustakaan Cerdas dengan{" "}
                  <span className="hero-title-highlight">AI & Knowledge Management</span>
                </h1>
              </div>
              
              <p className="hero-subtitle" style={{ textAlign: "center" }}>
                RuangAksara mengintegrasikan pencarian semantik berbasis AI
                dan knowledge management system untuk pengalaman perpustakaan yang lebih cerdas dan efisien.
              </p>

              <div style={{ paddingBottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Link href="/search" style={{ padding: '12px 24px', background: 'black', borderRadius: 12, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <span style={{ color: 'white', fontSize: 11, fontFamily: 'Inter', fontWeight: '400', textTransform: 'uppercase', letterSpacing: 1.10 }}>
                    Mulai Pencarian
                  </span>
                </Link>
              </div>

              <div className="hero-image-shadow">
                <img src="/library-hero.png" alt="Ilustrasi Perpustakaan Cerdas RuangAksara" />
              </div>
            </div>
          </div>
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
              <div className="layanan-showcase">
                <div className="layanan-showcase-watermark"></div>
                <div className="layanan-badge">INOVASI DIGITAL</div>
                <div className="layanan-showcase-title">
                  Melihat Bagaimana Kami Bekerja <ArrowRight size={24} />
                </div>
              </div>
              

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

      {/* ===== PALING BANYAK DIBACA ===== */}
      <AnimatedSection>
        <section className="section">
          <div className="container">
            <div className="lp-section-header-row" style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
              <h2 className="section-title" style={{ marginBottom: "0", textAlign: "center" }}>Paling Banyak Dibaca</h2>
              <Link href="/search" className="lp-link-arrow">Lihat semua <ArrowRight size={16} /></Link>
            </div>
            <div className="lp-scroll-wrapper">
              <button className="lp-scroll-btn lp-scroll-left" onClick={() => scrollPopular(-1)}><ChevronLeft size={20} /></button>
              <div className="lp-scroll-container" ref={popularScrollRef}>
                {popularBooks.map((book) => (
                  <div key={book.rank} className="lp-book-card">
                    <div className="lp-book-cover">
                      <div className="lp-popular-rank">{book.rank}</div>
                      {book.cover && book.cover.startsWith("http") ? (
                        <img src={book.cover} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <Book size={48} className="text-primary" />
                      )}
                    </div>
                    <div className="lp-book-info">
                      <h4 className="lp-book-title">{book.title}</h4>
                      <p className="lp-book-author">{book.author}</p>
                      <p className="lp-book-year">{book.year}</p>
                    </div>
                  </div>
                ))}
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
                <h3 className="lp-card-heading">Event & Pengumuman</h3>
                <div className="lp-event-list">
                  {events.map((ev, i) => (
                    <div key={i} className="lp-event-item">
                      <div className="lp-event-date">
                        <span className="lp-event-day">{ev.date}</span>
                        <span className="lp-event-month">{ev.month}</span>
                      </div>
                      <div className="lp-event-info">
                        <h4>{ev.title}</h4>
                        <p>{ev.desc}</p>
                      </div>
                      <ChevronRight size={18} className="lp-event-arrow" />
                    </div>
                  ))}
                </div>
                <Link href="#" className="lp-link-arrow" style={{ marginTop: "16px" }}>Lihat semua event <ArrowRight size={16} /></Link>
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


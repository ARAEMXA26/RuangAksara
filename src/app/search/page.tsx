"use client";

import { useState, useEffect, useRef } from "react";
import BookCard from "@/components/BookCard";
import AnimatedSection from "@/components/AnimatedSection";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Loader2, Lightbulb, Brain, Inbox, Book, Library, GraduationCap, Users, HeartPulse, Scale, SlidersHorizontal, ChevronLeft, ChevronRight, MessageSquare, Monitor, Briefcase, Globe, ChevronDown, LayoutGrid } from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<any>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const resultsRef = useRef<HTMLDivElement>(null);

  // ===== Filter States =====
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedMinYear, setSelectedMinYear] = useState<number>(1990);
  const [selectedCategoryPill, setSelectedCategoryPill] = useState<string | null>(null);

  // Heuristics to classify dynamic fields
  const getBookType = (book: any) => {
    const titleLower = book.title?.toLowerCase() || "";
    const catLower = book.category?.toLowerCase() || "";
    const descLower = book.description?.toLowerCase() || "";
    
    if (catLower.includes("skripsi") || titleLower.includes("skripsi") || descLower.includes("skripsi")) return "Skripsi";
    if (catLower.includes("tesis") || titleLower.includes("tesis") || descLower.includes("tesis")) return "Tesis";
    if (catLower.includes("jurnal") || titleLower.includes("jurnal") || descLower.includes("jurnal")) return "Jurnal";
    if (catLower.includes("e-book") || catLower.includes("ebook") || descLower.includes("pdf") || descLower.includes("e-book")) return "E-Book";
    return "Buku";
  };

  const getBookLanguage = (book: any) => {
    const desc = book.description || "";
    if (desc.includes("Bahasa: Inggris")) return "Inggris";
    if (desc.includes("Bahasa: Indonesia")) return "Indonesia";
    
    const text = (book.title + " " + desc).toLowerCase();
    const englishWords = ["the", "of", "and", "in", "to", "for", "with", "on", "a", "an", "is", "are", "by"];
    const hasEnglish = englishWords.some(word => new RegExp(`\\b${word}\\b`).test(text));
    return hasEnglish ? "Inggris" : "Indonesia";
  };

  const matchesCategoryPill = (book: any, pill: string) => {
    const cat = book.category?.toLowerCase() || "";
    const title = book.title?.toLowerCase() || "";
    const desc = book.description?.toLowerCase() || "";
    const pillLower = pill.toLowerCase();

    if (pillLower === "teknologi") {
      return cat.includes("teknologi") || cat.includes("information") || cat.includes("ai") || cat.includes("algoritma") || cat.includes("database") || cat.includes("software") || cat.includes("jaringan") || cat.includes("computer");
    }
    if (pillLower === "repository") {
      return cat.includes("umum") || cat.includes("repository") || cat.includes("skripsi") || cat.includes("tesis") || cat.includes("jurnal");
    }
    return cat.includes(pillLower) || title.includes(pillLower) || desc.includes(pillLower);
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleLanguageToggle = (lang: string) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const toggleCategoryPill = (name: string) => {
    setSelectedCategoryPill(prev => prev === name ? null : name);
  };

  const handleResetFilters = async () => {
    setSelectedTypes([]);
    setSelectedLanguages([]);
    setSelectedMinYear(1990);
    setSelectedCategoryPill(null);
    setQuery("");
    
    setLoading(true);
    try {
      const res = await fetch("/api/books");
      const data = await res.json();
      setResults(data.books || []);
    } catch (error) {
      console.error("Failed to reset results:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtered Results
  const filteredResults = results.filter(book => {
    const type = getBookType(book);
    const lang = getBookLanguage(book);
    
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(type);
    const matchesLanguage = selectedLanguages.length === 0 || selectedLanguages.includes(lang);
    const matchesYear = book.year >= selectedMinYear;
    const matchesPill = !selectedCategoryPill || matchesCategoryPill(book, selectedCategoryPill);
    
    return matchesType && matchesLanguage && matchesYear && matchesPill;
  });

  // Calculate dynamic counts based on current results list
  const typeCounts = {
    "Buku": results.filter(b => getBookType(b) === "Buku").length,
    "E-Book": results.filter(b => getBookType(b) === "E-Book").length,
    "Jurnal": results.filter(b => getBookType(b) === "Jurnal").length,
    "Skripsi": results.filter(b => getBookType(b) === "Skripsi").length,
    "Tesis": results.filter(b => getBookType(b) === "Tesis").length,
  };

  const languageCounts = {
    "Indonesia": results.filter(b => getBookLanguage(b) === "Indonesia").length,
    "Inggris": results.filter(b => getBookLanguage(b) === "Inggris").length,
  };

  // Initial load
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/books");
        const data = await res.json();
        setResults(data.books || []);
        setSearched(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (user?.id) {
      const fetchBookmarks = async () => {
        try {
          const res = await fetch(`/api/bookmarks?userId=${user.id}`);
          if (res.ok) {
            const data = await res.json();
            const ids = new Set(data.bookmarks.map((b: any) => b.bookId));
            setBookmarkedIds(ids as any);
          }
        } catch (error) {
          console.error("Failed to load bookmarks", error);
        }
      };
      fetchBookmarks();
    }
  }, [user]);

  const showToast = (message: string, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSearch = async (e?: any) => {
    e?.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      if (!query.trim()) {
        const res = await fetch("/api/books");
        const data = await res.json();
        setResults(data.books || []);
      } else {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    }

    setLoading(false);

    // Animate results
    const loadGSAP = async () => {
      const gsapModule = await import("gsap");
      const gsap = gsapModule.default;

      if (resultsRef.current) {
        const cards = resultsRef.current.querySelectorAll(".book-card-horizontal");
        gsap.from(cards, {
          y: 30,
          opacity: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out",
        });
      }
    };
    loadGSAP();
  };

  const handleBorrow = async (book: any) => {
    if (!user) {
      showToast("Silakan login terlebih dahulu untuk meminjam buku", "error");
      return;
    }

    try {
      const res = await fetch("/api/circulation/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          bookId: book.id,
        }),
      });

      if (res.ok) {
        showToast(`Buku "${book.title}" berhasil dipinjam!`, "success");
      } else {
        const data = await res.json();
        showToast(data.error || "Gagal meminjam buku", "error");
      }
    } catch (error) {
      showToast(`Buku "${book.title}" berhasil dipinjam!`, "success");
    }
  };

  const handleBookmark = async (book: any) => {
    if (!user) {
      showToast("Silakan login terlebih dahulu", "error");
      return;
    }
    
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, bookId: book.id })
      });
      if (res.ok) {
        const data = await res.json();
        setBookmarkedIds(prev => {
          const next = new Set(prev);
          if (data.bookmarked) next.add(book.id);
          else next.delete(book.id);
          return next;
        });
        showToast(data.message, "success");
      }
    } catch (error) {
      showToast("Gagal menyimpan bookmark", "error");
    }
  };

  const handleReserve = async (book: any) => {
    if (!user) {
      showToast("Silakan login terlebih dahulu", "error");
      return;
    }
    
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, bookId: book.id })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message, "success");
      } else {
        showToast(data.error || "Gagal mengantre buku", "error");
      }
    } catch (error) {
      showToast("Gagal mengantre buku", "error");
    }
  };

  return (
    <>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

      <div className="page" style={{ padding: "100px 24px 40px", maxWidth: "1400px", margin: "0 auto" }}>
        
        {/* Header Banner */}
        <AnimatedSection animation="fade-down">
          <div className="repo-header-banner">
            <div className="repo-header-left">
              <div className="repo-header-icon">
                <Brain size={40} />
              </div>
              <div>
                <h1 style={{ fontSize: "1.8rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "4px" }}>
                  Pencarian <span style={{ color: "var(--primary)" }}>Semantik</span>
                </h1>
                <p style={{ fontSize: "0.95rem", color: "var(--gray-500)", maxWidth: "400px" }}>
                  Cari buku, jurnal, skripsi, atau topik menggunakan bahasa alami.
                </p>
              </div>
            </div>
            
            <div className="repo-header-right">
              <form onSubmit={handleSearch} className="repo-search-form">
                <Search size={20} className="repo-search-icon" />
                <input
                  type="text"
                  className="repo-search-input"
                  placeholder="Ketik kueri pencarian berupa kalimat lengkap..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="repo-search-btn" disabled={loading}>
                  {loading ? <Loader2 size={18} className="animate-spin" /> : "Cari"}
                </button>
              </form>
            </div>
          </div>
        </AnimatedSection>

        {/* Stats Row */}
        <AnimatedSection animation="fade-up" delay={0.1}>
          <div className="katalog-stats-grid">
            <div className="katalog-stat-card">
              <div className="katalog-stat-icon blue"><Library size={24} /></div>
              <div className="katalog-stat-info">
                <h3>120.000+</h3>
                <p>Total Koleksi</p>
              </div>
            </div>
            <div className="katalog-stat-card">
              <div className="katalog-stat-icon blue"><Book size={24} /></div>
              <div className="katalog-stat-info">
                <h3>25.000+</h3>
                <p>E-Book</p>
              </div>
            </div>
            <div className="katalog-stat-card">
              <div className="katalog-stat-icon blue"><Book size={24} /></div>
              <div className="katalog-stat-info">
                <h3>15.000+</h3>
                <p>Jurnal</p>
              </div>
            </div>
            <div className="katalog-stat-card">
              <div className="katalog-stat-icon blue"><GraduationCap size={24} /></div>
              <div className="katalog-stat-info">
                <h3>10.000+</h3>
                <p>Skripsi & Tesis</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Categories Row */}
        <AnimatedSection animation="fade-up" delay={0.2}>
          <div className="katalog-category-row">
            <div className="katalog-category-label">Kategori</div>
            {[
              { name: "Teknologi", icon: <Monitor size={16} /> },
              { name: "Bisnis", icon: <Briefcase size={16} /> },
              { name: "Pendidikan", icon: <GraduationCap size={16} /> },
              { name: "Kesehatan", icon: <HeartPulse size={16} /> },
              { name: "Hukum", icon: <Scale size={16} /> },
              { name: "Sosial", label: "Sosial & Humaniora", icon: <Globe size={16} /> },
              { name: "Repository", icon: <Library size={16} /> }
            ].map(pill => {
              const pillName = pill.label || pill.name;
              const isActive = selectedCategoryPill === pill.name;
              return (
                <div
                  key={pill.name}
                  className="repo-category-pill"
                  onClick={() => toggleCategoryPill(pill.name)}
                  style={{
                    background: isActive ? "black" : "white",
                    color: isActive ? "white" : "var(--gray-700)",
                    borderColor: isActive ? "black" : "var(--gray-200)",
                  }}
                >
                  {pill.icon} {pillName}
                </div>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Main 3-Column Layout */}
        <AnimatedSection animation="fade-up" delay={0.3}>
          <div className="katalog-layout">
            
            {/* Sidebar Left: Filters */}
            <aside className="katalog-filter-sidebar">
              <div className="katalog-filter-header">
                <h3>Filter Pencarian</h3>
                <button className="katalog-filter-reset" onClick={handleResetFilters}>Reset</button>
              </div>

              <div className="katalog-filter-section">
                <div className="katalog-filter-title">Jenis Koleksi</div>
                <div className="katalog-checkbox-group">
                  {[
                    { key: "Buku", label: "Buku" },
                    { key: "E-Book", label: "E-Book" },
                    { key: "Jurnal", label: "Jurnal" },
                    { key: "Skripsi", label: "Skripsi" },
                    { key: "Tesis", label: "Tesis" }
                  ].map(t => (
                    <label key={t.key} className="katalog-checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(t.key)}
                        onChange={() => handleTypeToggle(t.key)}
                      />
                      {" "}{t.label}
                      <span className="katalog-checkbox-count">({typeCounts[t.key as keyof typeof typeCounts] || 0})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="katalog-filter-section">
                <div className="katalog-filter-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Tahun Terbit</span>
                  <span style={{ fontSize: "0.8rem", fontWeight: "600", background: "var(--gray-900)", color: "white", padding: "2px 8px", borderRadius: "12px" }}>
                    &ge; {selectedMinYear}
                  </span>
                </div>
                <input
                  type="range"
                  min="1990"
                  max="2026"
                  value={selectedMinYear}
                  onChange={(e) => setSelectedMinYear(parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--primary)", marginTop: "8px", cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--gray-500)", marginTop: "8px" }}>
                  <span>1990</span>
                  <span>2026</span>
                </div>
              </div>

              <div className="katalog-filter-section">
                <div className="katalog-filter-title">Bahasa</div>
                <div className="katalog-checkbox-group">
                  {[
                    { key: "Indonesia", label: "Indonesia" },
                    { key: "Inggris", label: "Inggris" }
                  ].map(l => (
                    <label key={l.key} className="katalog-checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedLanguages.includes(l.key)}
                        onChange={() => handleLanguageToggle(l.key)}
                      />
                      {" "}{l.label}
                      <span className="katalog-checkbox-count">({languageCounts[l.key as keyof typeof languageCounts] || 0})</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Center Content: Results */}
            <main>
              {searched && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <div>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "4px" }}>Hasil Pencarian</h2>
                    <p style={{ fontSize: "0.9rem", color: "var(--gray-600)" }}>
                      Menampilkan {filteredResults.length} koleksi {query ? <span>untuk <span style={{ color: "var(--primary)", fontWeight: "600" }}>"{query}"</span></span> : "terbaru"}
                    </p>
                  </div>
                  <div className="repo-content-actions">
                    <div className="repo-sort-dropdown">
                      <span>Urutkan: Relevansi</span>
                      <ChevronDown size={16} />
                    </div>
                    <div className="repo-view-toggles">
                      <button className="repo-view-btn active">
                        <SlidersHorizontal size={18} />
                      </button>
                      <button className="repo-view-btn">
                        <LayoutGrid size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {loading ? (
                <div style={{ padding: "60px", textAlign: "center" }}>
                  <Loader2 size={40} className="animate-spin" style={{ color: "var(--primary)", margin: "0 auto 16px" }} />
                  <p style={{ color: "var(--gray-600)" }}>Mencari koleksi yang paling relevan...</p>
                </div>
              ) : searched ? (
                filteredResults.length > 0 ? (
                  <div ref={resultsRef}>
                    {filteredResults.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        showBorrow={true}
                        onBorrow={handleBorrow}
                        onBookmark={handleBookmark}
                        onReserve={handleReserve}
                        isBookmarked={bookmarkedIds.has(book.id)}
                        layout="horizontal"
                      />
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "12px", border: "1px solid var(--gray-200)" }}>
                    <Inbox size={48} style={{ color: "var(--gray-400)", margin: "0 auto 16px" }} />
                    <h3 style={{ fontSize: "1.2rem", color: "var(--gray-800)", marginBottom: "8px" }}>Tidak ada hasil ditemukan</h3>
                    <p style={{ color: "var(--gray-500)" }}>Coba gunakan kata kunci yang berbeda atau lebih spesifik dengan filter Anda</p>
                  </div>
                )
              ) : (
                <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "12px", border: "1px dashed var(--gray-300)" }}>
                  <Search size={48} style={{ color: "var(--gray-300)", margin: "0 auto 16px" }} />
                  <h3 style={{ fontSize: "1.2rem", color: "var(--gray-500)" }}>Mulai Pencarian Semantik</h3>
                  <p style={{ color: "var(--gray-400)" }}>Ketik query Anda di atas untuk mencari koleksi</p>
                </div>
              )}

              {/* Repository Banner */}
              <div style={{ background: "linear-gradient(to right, #f8fafc, #eff6ff)", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "24px", marginTop: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ background: "white", padding: "12px", borderRadius: "50%", boxShadow: "var(--shadow-sm)" }}>
                    <GraduationCap size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: "700", color: "var(--gray-900)", marginBottom: "4px" }}>Mencari Skripsi, Tesis, atau Artikel Ilmiah?</h4>
                    <p style={{ fontSize: "0.9rem", color: "var(--gray-600)" }}>Telusuri ribuan karya ilmiah dari civitas akademika.</p>
                  </div>
                </div>
                <Link 
                  href="/repository" 
                  style={{ 
                    background: "var(--gray-900)", 
                    color: "white", 
                    padding: "10px 24px", 
                    borderRadius: "8px", 
                    textDecoration: "none", 
                    fontSize: "0.85rem", 
                    fontWeight: "600", 
                    letterSpacing: "0.5px",
                    display: "inline-block"
                  }}
                >
                  TELUSURI REPOSITORY →
                </Link>
              </div>
            </main>
            
          </div>
        </AnimatedSection>
      </div>
    </>
  );
}

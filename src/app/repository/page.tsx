"use client";

import { useState, useEffect, useRef } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { 
  FileText, Search, SlidersHorizontal, GraduationCap, 
  Folder, User, BookOpen, Calendar, 
  Unlock, Eye, Book, Download, ChevronDown, LayoutGrid, List,
  Loader2, Scale, Library, Inbox
} from "lucide-react";
import Link from "next/link";

export default function RepositoryPage() {
  const [query, setQuery] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortOption, setSortOption] = useState("terbaru");

  // Filter states
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAccess, setSelectedAccess] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState(2026);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/knowledge/externalize");
        if (res.ok) {
          const data = await res.json();
          setDocuments(data.items || []);
        }
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const getDocType = (doc: any) => {
    return doc.category || "SOP & Panduan";
  };

  const handleResetFilters = () => {
    setSelectedCategory("Semua");
    setSelectedTypes([]);
    setSelectedAccess([]);
    setYearRange(2026);
    setQuery("");
  };

  const filteredDocs = documents.filter((doc) => {
    // 1. Search Query
    const matchesQuery = 
      doc.title.toLowerCase().includes(query.toLowerCase()) ||
      doc.content.toLowerCase().includes(query.toLowerCase());

    // 2. Category Pill
    const docType = getDocType(doc);
    const matchesCategory = selectedCategory === "Semua" || docType === selectedCategory;

    // 3. Sidebar Types Filter
    const matchesTypeFilter = selectedTypes.length === 0 || selectedTypes.includes(docType);

    // 4. Sidebar Access Filter
    const docAccess = doc.access || "Terbuka"; 
    const matchesAccessFilter = selectedAccess.length === 0 || selectedAccess.includes(docAccess);

    // 5. Year Filter
    const docYear = parseInt(doc.createdAt.split("-")[0]) || 2026;
    const matchesYearFilter = docYear <= yearRange;

    return matchesQuery && matchesCategory && matchesTypeFilter && matchesAccessFilter && matchesYearFilter;
  });

  const sortedDocs = [...filteredDocs].sort((a, b) => {
    if (sortOption === "terbaru") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortOption === "az") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Animate transition on search
  useEffect(() => {
    const animateList = async () => {
      const gsapModule = await import("gsap");
      const gsap = gsapModule.default;
      if (resultsRef.current) {
        const cards = resultsRef.current.querySelectorAll(".repo-document-card, .book-card");
        gsap.from(cards, {
          y: 20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out"
        });
      }
    };
    if (!loading) animateList();
  }, [loading, selectedCategory, selectedTypes, selectedAccess, yearRange, query, sortOption, viewMode]);

  return (
    <div className="page" style={{ padding: "100px 24px 40px", maxWidth: "1400px", margin: "0 auto" }}>
      
      {/* Header Banner */}
      <AnimatedSection animation="fade-down">
        <div className="repo-header-banner">
          <div className="repo-header-left">
            <div className="repo-header-icon">
              <FileText size={40} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.8rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "4px" }}>
                Repository <span style={{ color: "var(--primary)" }}>Digital</span>
              </h1>
              <p style={{ fontSize: "0.95rem", color: "var(--gray-500)", maxWidth: "400px" }}>
                Telusuri panduan, SOP, kebijakan, laporan, dan dokumen resmi perpustakaan.
              </p>
            </div>
          </div>
          
          <div className="repo-header-right">
            <form onSubmit={(e) => e.preventDefault()} className="repo-search-form">
              <Search size={20} className="repo-search-icon" />
              <input
                type="text"
                className="repo-search-input"
                placeholder="Cari judul dokumen, konten, atau topik..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="button" className="repo-search-btn" style={{ background: "var(--primary)" }}>
                Cari
              </button>
            </form>
          </div>
        </div>
      </AnimatedSection>

      {/* Stats Row */}
      <AnimatedSection animation="fade-up" delay={0.1}>
        <div className="katalog-stats-grid">
          <div className="katalog-stat-card">
            <div className="katalog-stat-icon blue"><Folder size={24} /></div>
            <div className="katalog-stat-info">
              <h3>{documents.length}</h3>
              <p>Dokumen Digital</p>
            </div>
          </div>
          <div className="katalog-stat-card">
            <div className="katalog-stat-icon blue"><FileText size={24} /></div>
            <div className="katalog-stat-info">
              <h3>{documents.filter(d => getDocType(d) === "SOP & Panduan").length}</h3>
              <p>SOP & Panduan</p>
            </div>
          </div>
          <div className="katalog-stat-card">
            <div className="katalog-stat-icon blue"><GraduationCap size={24} /></div>
            <div className="katalog-stat-info">
              <h3>{documents.filter(d => getDocType(d) === "Riset & Jurnal").length}</h3>
              <p>Riset & Jurnal</p>
            </div>
          </div>
          <div className="katalog-stat-card">
            <div className="katalog-stat-icon blue"><Scale size={24} /></div>
            <div className="katalog-stat-info">
              <h3>{documents.filter(d => getDocType(d) === "Kebijakan").length}</h3>
              <p>Kebijakan & Regulasi</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Categories Row */}
      <AnimatedSection animation="fade-up" delay={0.2}>
        <div className="katalog-category-row">
          <div className="katalog-category-label">Kategori</div>
          <button 
            onClick={() => setSelectedCategory("Semua")}
            className="repo-category-pill"
            style={{ 
              background: selectedCategory === "Semua" ? "var(--primary)" : "white", 
              color: selectedCategory === "Semua" ? "white" : "var(--gray-700)", 
              border: "1px solid " + (selectedCategory === "Semua" ? "var(--primary)" : "var(--gray-200)"),
              display: "flex", alignItems: "center", gap: "8px"
            }}
          >
            <Library size={16} /> Semua
          </button>
          <button 
            onClick={() => setSelectedCategory("SOP & Panduan")}
            className="repo-category-pill"
            style={{ 
              background: selectedCategory === "SOP & Panduan" ? "var(--primary)" : "white", 
              color: selectedCategory === "SOP & Panduan" ? "white" : "var(--gray-700)", 
              border: "1px solid " + (selectedCategory === "SOP & Panduan" ? "var(--primary)" : "var(--gray-200)"),
              display: "flex", alignItems: "center", gap: "8px"
            }}
          >
            <FileText size={16} /> SOP & Panduan
          </button>
          <button 
            onClick={() => setSelectedCategory("Riset & Jurnal")}
            className="repo-category-pill"
            style={{ 
              background: selectedCategory === "Riset & Jurnal" ? "var(--primary)" : "white", 
              color: selectedCategory === "Riset & Jurnal" ? "white" : "var(--gray-700)", 
              border: "1px solid " + (selectedCategory === "Riset & Jurnal" ? "var(--primary)" : "var(--gray-200)"),
              display: "flex", alignItems: "center", gap: "8px"
            }}
          >
            <GraduationCap size={16} /> Riset & Jurnal
          </button>
          <button 
            onClick={() => setSelectedCategory("Kebijakan")}
            className="repo-category-pill"
            style={{ 
              background: selectedCategory === "Kebijakan" ? "var(--primary)" : "white", 
              color: selectedCategory === "Kebijakan" ? "white" : "var(--gray-700)", 
              border: "1px solid " + (selectedCategory === "Kebijakan" ? "var(--primary)" : "var(--gray-200)"),
              display: "flex", alignItems: "center", gap: "8px"
            }}
          >
            <Scale size={16} /> Kebijakan
          </button>
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

            {/* Jenis Dokumen */}
            <div className="katalog-filter-section">
              <div className="katalog-filter-title">Jenis Dokumen</div>
              <div className="katalog-checkbox-group">
                {["SOP & Panduan", "Riset & Jurnal", "Kebijakan"].map((type) => (
                  <label key={type} className="katalog-checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={selectedTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTypes([...selectedTypes, type]);
                        } else {
                          setSelectedTypes(selectedTypes.filter((t) => t !== type));
                        }
                      }}
                    /> {type}
                    <span className="katalog-checkbox-count">
                      ({documents.filter((d) => getDocType(d) === type).length})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status Akses */}
            <div className="katalog-filter-section">
              <div className="katalog-filter-title">Status Akses</div>
              <div className="katalog-checkbox-group">
                {["Terbuka", "Terbatas"].map((access) => (
                  <label key={access} className="katalog-checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={selectedAccess.includes(access)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAccess([...selectedAccess, access]);
                        } else {
                          setSelectedAccess(selectedAccess.filter((a) => a !== access));
                        }
                      }}
                    /> {access}
                    <span className="katalog-checkbox-count">
                      ({documents.filter((d) => (d.access || "Terbuka") === access).length})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tahun Rilis */}
            <div className="katalog-filter-section">
              <div className="katalog-filter-title">Tahun Rilis (Maksimal)</div>
              <input 
                type="range" 
                min="2020" 
                max="2026" 
                value={yearRange}
                onChange={(e) => setYearRange(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "var(--primary)", marginTop: "8px" }} 
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--gray-500)", marginTop: "8px" }}>
                <span>2020</span>
                <span>{yearRange}</span>
              </div>
            </div>
          </aside>

          {/* Center Content: Results */}
          <main style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "4px" }}>Hasil Pencarian</h2>
                <p style={{ fontSize: "0.9rem", color: "var(--gray-600)" }}>
                  Menampilkan {sortedDocs.length} dokumen {query ? <span>untuk <span style={{ color: "var(--primary)", fontWeight: "600" }}>"{query}"</span></span> : "terbaru"}
                </p>
              </div>
              <div className="repo-content-actions" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div className="repo-sort-dropdown" style={{ display: "flex", alignItems: "center", gap: "4px", background: "white", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--gray-200)" }}>
                  <select 
                    value={sortOption} 
                    onChange={(e) => setSortOption(e.target.value)}
                    style={{ border: "none", background: "none", outline: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: "500", color: "var(--gray-700)" }}
                  >
                    <option value="terbaru">Urutkan: Terbaru</option>
                    <option value="az">Urutkan: A-Z</option>
                  </select>
                </div>
                <div className="repo-view-toggles">
                  <button 
                    className={`repo-view-btn ${viewMode === "list" ? "active" : ""}`} 
                    onClick={() => setViewMode("list")}
                  >
                    <List size={18} />
                  </button>
                  <button 
                    className={`repo-view-btn ${viewMode === "grid" ? "active" : ""}`} 
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid size={18} />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: "60px", textAlign: "center" }}>
                <Loader2 size={40} className="animate-spin" style={{ color: "var(--primary)", margin: "0 auto 16px" }} />
                <p style={{ color: "var(--gray-600)" }}>Memuat dokumen repository...</p>
              </div>
            ) : sortedDocs.length > 0 ? (
              <div ref={resultsRef}>
                {viewMode === "list" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {sortedDocs.map((doc) => {
                      const docType = getDocType(doc);
                      return (
                        <div key={doc.id} className="repo-document-card" style={{ display: "flex", gap: "24px", padding: "24px", background: "white", border: "1px solid var(--gray-200)", borderRadius: "var(--radius-lg)" }}>
                          <div className="repo-doc-icon-wrapper" style={{ width: "100px", height: "120px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--gray-50)", borderRadius: "var(--radius-md)" }}>
                            <FileText size={48} color="var(--primary)" strokeWidth={1.5} />
                          </div>
                          <div className="repo-doc-details" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                            <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "8px" }}>{doc.title}</h3>
                            <div className="repo-doc-meta" style={{ display: "flex", gap: "12px", fontSize: "0.8rem", color: "var(--gray-500)", marginBottom: "12px" }}>
                              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><User size={14} /> {doc.authorName}</span>
                              <span>•</span>
                              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><BookOpen size={14} /> {docType}</span>
                              <span>•</span>
                              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Calendar size={14} /> {doc.createdAt}</span>
                              <span>•</span>
                              <span style={{ display: "flex", alignItems: "center", gap: "4px", color: (doc.access || "Terbuka") === "Terbatas" ? "var(--warning)" : "var(--success)" }}><Unlock size={14} /> {doc.access || "Terbuka"}</span>
                            </div>
                            <p style={{ fontSize: "0.9rem", color: "var(--gray-600)", lineHeight: "1.5", marginBottom: "16px" }}>{doc.content}</p>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button className="btn btn-sm" style={{ border: "1px solid var(--gray-300)", background: "white", color: "var(--gray-700)" }}>Detail</button>
                              <button className="btn btn-sm btn-primary" style={{ display: "flex", alignItems: "center", gap: "6px" }}><Download size={14} /> Unduh PDF</button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
                    {sortedDocs.map((doc) => {
                      const docType = getDocType(doc);
                      return (
                        <div key={doc.id} className="book-card" style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", background: "white", border: "1px solid var(--gray-200)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
                          <div>
                            <div className="book-card-cover" style={{ height: "160px", background: "linear-gradient(135deg, #eff6ff, #dbeafe)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                              <FileText size={64} color="var(--primary)" strokeWidth={1} />
                              <div style={{ position: "absolute", bottom: "12px", right: "12px", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(4px)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem", color: "var(--primary)", fontWeight: "600" }}>
                                PDF
                              </div>
                            </div>
                            <div className="book-card-body" style={{ padding: "16px" }}>
                              <span className="badge badge-primary" style={{ fontSize: "0.7rem", marginBottom: "8px", display: "inline-block", background: "var(--primary-light)", color: "var(--primary)" }}>{docType}</span>
                              <h3 className="book-card-title" style={{ fontSize: "1rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "4px", minHeight: "40px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{doc.title}</h3>
                              <p className="book-card-author" style={{ fontSize: "0.8rem", color: "var(--gray-500)", marginBottom: "12px" }}>Oleh: {doc.authorName}</p>
                              <p style={{ fontSize: "0.85rem", color: "var(--gray-600)", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: "16px" }}>{doc.content}</p>
                            </div>
                          </div>
                          <div style={{ padding: "0 16px 16px 16px", display: "flex", gap: "8px" }}>
                            <button className="btn btn-sm" style={{ flex: 1, border: "1px solid var(--gray-300)", background: "white", color: "var(--gray-700)" }}>Detail</button>
                            <button className="btn btn-primary btn-sm" style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "center", width: "40px" }}><Download size={14} /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "12px", border: "1px solid var(--gray-200)" }}>
                <Inbox size={48} style={{ color: "var(--gray-400)", margin: "0 auto 16px" }} />
                <h3 style={{ fontSize: "1.2rem", color: "var(--gray-800)", marginBottom: "8px" }}>Tidak ada dokumen ditemukan</h3>
                <p style={{ color: "var(--gray-500)" }}>Coba gunakan kata kunci lain atau reset filter</p>
              </div>
            )}
          </main>

        </div>
      </AnimatedSection>
    </div>
  );
}

"use client";

import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { 
  FileText, Search, SlidersHorizontal, GraduationCap, 
  BarChart2, Folder, User, BookOpen, Info, Calendar, 
  Unlock, Eye, Book, Download, ChevronDown, LayoutGrid, List
} from "lucide-react";
import Link from "next/link";

export default function RepositoryPage() {
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState("list"); // list or grid

  const mockDocuments = [
    {
      id: 1,
      title: "Implementasi Knowledge Management pada Perpustakaan Berbasis Web",
      author: "Rina Anindita",
      type: "Artikel Ilmiah",
      year: "2023",
      access: "Terbuka",
      description: "Artikel ini membahas penerapan konsep knowledge management dalam sistem perpustakaan berbasis web untuk meningkatkan efisiensi pengelolaan pengetahuan dan layanan informasi.",
      tags: ["Knowledge Management", "Perpustakaan Digital", "Sistem Informasi", "Web"]
    },
    {
      id: 2,
      title: "Strategi Pengelolaan Koleksi Digital Perpustakaan Perguruan Tinggi",
      author: "Dewi Lestari",
      type: "Laporan Penelitian",
      year: "2022",
      access: "Terbuka",
      description: "Laporan penelitian ini mengkaji strategi pengelolaan koleksi digital di perpustakaan perguruan tinggi untuk mendukung akses informasi yang efektif dan berkelanjutan.",
      tags: ["Koleksi Digital", "Pengelolaan Koleksi", "Perpustakaan Perguruan Tinggi", "Strategi"]
    },
    {
      id: 3,
      title: "Panduan Penelusuran Informasi Digital untuk Mahasiswa",
      author: "Unit Layanan Referensi",
      type: "Panduan",
      year: "2024",
      access: "Terbuka",
      description: "Panduan praktis untuk mahasiswa dalam menelusur informasi digital melalui berbagai sumber terpercaya yang tersedia di perpustakaan.",
      tags: ["Literasi Informasi", "Penelusuran", "Mahasiswa", "Panduan Pengguna"]
    }
  ];

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
              <h1>Repository Perpustakaan</h1>
              <p>Telusuri koleksi dokumen digital, karya ilmiah, laporan penelitian, dan arsip perpustakaan dalam satu tempat.</p>
            </div>
          </div>
          
          <div className="repo-header-right">
            <form onSubmit={(e) => e.preventDefault()} className="repo-search-form">
              <Search size={20} className="repo-search-icon" />
              <input
                type="text"
                className="repo-search-input"
                placeholder="Cari judul dokumen, penulis, kata kunci, atau topik..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="repo-search-btn">
                Cari
              </button>
            </form>
            <button className="repo-advanced-search-btn">
              <SlidersHorizontal size={16} /> Pencarian Lanjutan
            </button>
          </div>
        </div>
      </AnimatedSection>

      {/* Stats Row */}
      <AnimatedSection animation="fade-up" delay={0.1}>
        <div className="katalog-stats-grid">
          <div className="katalog-stat-card">
            <div className="katalog-stat-icon" style={{ background: "var(--gray-100)", color: "var(--gray-900)" }}><FileText size={24} /></div>
            <div className="katalog-stat-info">
              <h3>15.000+</h3>
              <p>Dokumen Digital</p>
            </div>
          </div>
          <div className="katalog-stat-card">
            <div className="katalog-stat-icon" style={{ background: "var(--gray-100)", color: "var(--gray-900)" }}><GraduationCap size={24} /></div>
            <div className="katalog-stat-info">
              <h3>8.500+</h3>
              <p>Karya Akademik</p>
            </div>
          </div>
          <div className="katalog-stat-card">
            <div className="katalog-stat-icon" style={{ background: "var(--gray-100)", color: "var(--gray-900)" }}><BarChart2 size={24} /></div>
            <div className="katalog-stat-info">
              <h3>3.200+</h3>
              <p>Laporan Penelitian</p>
            </div>
          </div>
          <div className="katalog-stat-card">
            <div className="katalog-stat-icon" style={{ background: "var(--gray-100)", color: "var(--gray-900)" }}><Folder size={24} /></div>
            <div className="katalog-stat-info">
              <h3>1.000+</h3>
              <p>Dokumen Layanan</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Categories Row */}
      <AnimatedSection animation="fade-up" delay={0.2}>
        <div className="katalog-category-row">
          <div className="repo-category-pill"><User size={16} /> Karya Ilmiah Mahasiswa</div>
          <div className="repo-category-pill"><GraduationCap size={16} /> Skripsi & Tesis</div>
          <div className="repo-category-pill"><BarChart2 size={16} /> Laporan Penelitian</div>
          <div className="repo-category-pill"><FileText size={16} /> Artikel Ilmiah</div>
          <div className="repo-category-pill"><BookOpen size={16} /> Modul Pembelajaran</div>
          <div className="repo-category-pill"><Folder size={16} /> Dokumen Perpustakaan</div>
          <div className="repo-category-pill"><Info size={16} /> Panduan Layanan</div>
          <div className="repo-category-pill"><Calendar size={16} /> Arsip Kegiatan</div>
        </div>
      </AnimatedSection>

      {/* Main 2-Column Layout */}
      <AnimatedSection animation="fade-up" delay={0.3}>
        <div className="katalog-layout">
          
          {/* Sidebar Left: Filters */}
          <aside className="katalog-filter-sidebar">
            <div className="katalog-filter-header">
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Filter</h3>
              <button className="katalog-filter-reset" style={{ fontSize: "0.85rem", color: "var(--gray-500)", background: "none", border: "none", cursor: "pointer" }}>Reset Semua</button>
            </div>

            <div className="katalog-filter-section">
              <div className="repo-filter-title">
                <span>Jenis Dokumen</span>
                <ChevronDown size={16} />
              </div>
              <div className="katalog-checkbox-group">
                <label className="katalog-checkbox-label">
                  <input type="checkbox" /> Skripsi
                  <span className="katalog-checkbox-count">1.245</span>
                </label>
                <label className="katalog-checkbox-label">
                  <input type="checkbox" /> Tesis
                  <span className="katalog-checkbox-count">856</span>
                </label>
                <label className="katalog-checkbox-label">
                  <input type="checkbox" /> Makalah
                  <span className="katalog-checkbox-count">1.102</span>
                </label>
                <label className="katalog-checkbox-label">
                  <input type="checkbox" /> Artikel Ilmiah
                  <span className="katalog-checkbox-count">2.345</span>
                </label>
                <label className="katalog-checkbox-label">
                  <input type="checkbox" /> Laporan Penelitian
                  <span className="katalog-checkbox-count">1.897</span>
                </label>
                <label className="katalog-checkbox-label">
                  <input type="checkbox" /> Modul
                  <span className="katalog-checkbox-count">745</span>
                </label>
                <label className="katalog-checkbox-label">
                  <input type="checkbox" /> Panduan
                  <span className="katalog-checkbox-count">310</span>
                </label>
              </div>
            </div>

            <div className="katalog-filter-section">
              <div className="repo-filter-title">
                <span>Tahun Publikasi</span>
                <ChevronDown size={16} />
              </div>
            </div>

            <div className="katalog-filter-section">
              <div className="repo-filter-title">
                <span>Program Studi / Unit</span>
                <ChevronDown size={16} />
              </div>
            </div>

            <div className="katalog-filter-section">
              <div className="repo-filter-title">
                <span>Status Akses</span>
                <ChevronDown size={16} />
              </div>
              <div className="katalog-checkbox-group">
                <label className="katalog-checkbox-label">
                  <input type="checkbox" /> Terbuka
                  <span className="katalog-checkbox-count">10.452</span>
                </label>
                <label className="katalog-checkbox-label">
                  <input type="checkbox" /> Terbatas
                  <span className="katalog-checkbox-count">2.143</span>
                </label>
                <label className="katalog-checkbox-label">
                  <input type="checkbox" /> Internal
                  <span className="katalog-checkbox-count">1.210</span>
                </label>
                <label className="katalog-checkbox-label">
                  <input type="checkbox" /> Hanya Metadata
                  <span className="katalog-checkbox-count">1.195</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main Content: Documents List */}
          <div className="repo-main-content">
            
            {/* Header Content */}
            <div className="repo-content-header">
              <div>
                <h2>Dokumen Repository</h2>
                <p>Menampilkan dokumen digital terbaru</p>
              </div>
              <div className="repo-content-actions">
                <div className="repo-sort-dropdown">
                  <span>Urutkan: Relevansi</span>
                  <ChevronDown size={16} />
                </div>
                <div className="repo-view-toggles">
                  <button className={`repo-view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                    <SlidersHorizontal size={18} />
                  </button>
                  <button className={`repo-view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                    <LayoutGrid size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Document List */}
            <div className="repo-document-list">
              {mockDocuments.map((doc) => (
                <div key={doc.id} className="repo-document-card">
                  <div className="repo-doc-icon-wrapper">
                    <FileText size={64} color="var(--gray-400)" strokeWidth={1} />
                  </div>
                  <div className="repo-doc-details">
                    <h3>{doc.title}</h3>
                    <div className="repo-doc-meta">
                      <span><User size={14} /> {doc.author}</span>
                      <span>•</span>
                      <span><BookOpen size={14} /> {doc.type}</span>
                      <span>•</span>
                      <span><Calendar size={14} /> {doc.year}</span>
                      <span>•</span>
                      <span><Unlock size={14} /> {doc.access}</span>
                    </div>
                    <p className="repo-doc-desc">{doc.description}</p>
                    <div className="repo-doc-footer">
                      <div className="repo-doc-tags">
                        {doc.tags.map((tag, idx) => (
                          <span key={idx} className="repo-tag">{tag}</span>
                        ))}
                      </div>
                      <div className="repo-doc-actions">
                        <button className="repo-action-btn outline"><Eye size={16} /> Detail</button>
                        <button className="repo-action-btn outline"><Book size={16} /> Baca</button>
                        <button className="repo-action-btn dark"><Download size={16} /> Unduh</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

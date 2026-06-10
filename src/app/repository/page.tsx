"use client";

import { useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { 
  FileText, Search, SlidersHorizontal, GraduationCap, 
  BarChart2, Folder, User, BookOpen, Info, Calendar, 
  Unlock, Eye, Book, Download, ChevronDown, LayoutGrid, List
} from "lucide-react";
import Link from "next/link";

export default function RepositoryPage() {
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
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

  const filteredDocs = documents.filter((doc) => 
    doc.title.toLowerCase().includes(query.toLowerCase()) ||
    doc.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page" style={{ padding: "100px 24px 40px", maxWidth: "1400px", margin: "0 auto" }}>
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
                placeholder="Cari judul dokumen, konten, atau topik..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="repo-search-btn">
                Cari
              </button>
            </form>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={0.1}>
        <div className="katalog-stats-grid">
          <div className="katalog-stat-card">
            <div className="katalog-stat-icon" style={{ background: "var(--gray-100)", color: "var(--gray-900)" }}><FileText size={24} /></div>
            <div className="katalog-stat-info">
              <h3>{documents.length}</h3>
              <p>Dokumen Digital</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={0.3}>
        <div className="katalog-layout">
          <aside className="katalog-filter-sidebar">
            <div className="katalog-filter-header">
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Filter</h3>
            </div>
            <div className="katalog-filter-section">
              <div className="repo-filter-title">
                <span>Status Akses</span>
                <ChevronDown size={16} />
              </div>
              <div className="katalog-checkbox-group">
                <label className="katalog-checkbox-label">
                  <input type="checkbox" checked readOnly /> Terbuka
                  <span className="katalog-checkbox-count">{documents.length}</span>
                </label>
              </div>
            </div>
          </aside>

          <div className="repo-main-content">
            <div className="repo-content-header">
              <div>
                <h2>Dokumen Repository</h2>
                <p>Menampilkan dokumen digital terbaru</p>
              </div>
              <div className="repo-content-actions">
                <div className="repo-view-toggles">
                  <button className={`repo-view-btn ${viewMode === 'list' ? 'active' : 'active'}`} onClick={() => setViewMode('list')}>
                    <SlidersHorizontal size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="repo-document-list">
              {loading ? (
                <div style={{ textAlign: "center", padding: "40px" }}>Memuat dokumen...</div>
              ) : filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <div key={doc.id} className="repo-document-card">
                    <div className="repo-doc-icon-wrapper">
                      <FileText size={64} color="var(--gray-400)" strokeWidth={1} />
                    </div>
                    <div className="repo-doc-details">
                      <h3>{doc.title || "Tanpa Judul"}</h3>
                      <div className="repo-doc-meta">
                        <span><User size={14} /> {doc.authorName}</span>
                        <span>•</span>
                        <span><BookOpen size={14} /> Knowledge Base</span>
                        <span>•</span>
                        <span><Calendar size={14} /> {doc.createdAt}</span>
                        <span>•</span>
                        <span><Unlock size={14} /> Terbuka</span>
                      </div>
                      <p className="repo-doc-desc">{doc.content}</p>
                      <div className="repo-doc-footer">
                        <div className="repo-doc-actions">
                          <button className="repo-action-btn outline"><Eye size={16} /> Detail</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <Folder size={48} style={{ margin: "0 auto", color: "#ccc" }} />
                  <p>Belum ada dokumen di repository.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

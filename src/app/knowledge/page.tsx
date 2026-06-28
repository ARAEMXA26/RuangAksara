"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import { useAuth } from "@/contexts/AuthContext";
import {
  Brain, FileEdit, CheckCircle2, Lock, Lightbulb,
  Library, User, Calendar, LayoutDashboard, Search, Settings,
  History, Bookmark, Clock, X, Eye
} from "lucide-react";

export default function KnowledgePage() {
  const { user, loading: authLoading } = useAuth();
  const [knowledgeItems, setKnowledgeItems] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("SOP & Panduan");
  const [access, setAccess] = useState("Terbuka");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const router = useRouter();
  const formRef = useRef(null);

  // Edit and View states
  const [editId, setEditId] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  // States for user sidebar modals (used if a student/lecturer views the page)
  const [showBookmarksModal, setShowBookmarksModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }

    if (user && formRef.current) {
      const loadGSAP = async () => {
        const gsapModule = await import("gsap");
        const gsap = gsapModule.default;
        gsap.from(formRef.current, {
          x: -40,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        });
      };
      loadGSAP();
    }
  }, [user, authLoading, router]);

  // Fetch knowledge items from API
  const fetchKnowledge = async () => {
    setDataLoading(true);
    try {
      const res = await fetch("/api/knowledge/externalize");
      if (res.ok) {
        const data = await res.json();
        setKnowledgeItems(data.items || []);
      }
    } catch (error) {
      console.error("Failed to fetch knowledge:", error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, []);

  // Fetch bookmarks if user is not a librarian
  useEffect(() => {
    if (!user || user.role === "pustakawan") return;
    
    const fetchBookmarks = async () => {
      try {
        const res = await fetch(`/api/bookmarks?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setBookmarks(data.bookmarks || []);
        }
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      }
    };
    fetchBookmarks();
  }, [user]);

  if (authLoading || dataLoading) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <span className="loading-dots"><span></span><span></span><span></span></span>
      </div>
    );
  }

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStartEdit = (item) => {
    setEditId(item.id);
    setTitle(item.title);
    setContent(item.content);
    setCategory(item.category || "SOP & Panduan");
    setAccess(item.access || "Terbuka");
    
    // Smooth scroll to form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pengetahuan ini?")) return;
    try {
      const res = await fetch(`/api/knowledge/externalize?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setKnowledgeItems((prev) => prev.filter((item) => item.id !== id));
        showToast("Pengetahuan berhasil dihapus!", "success");
        if (editId === id) {
          setEditId(null);
          setTitle("");
          setContent("");
          setCategory("SOP & Panduan");
          setAccess("Terbuka");
        }
      } else {
        showToast("Gagal menghapus pengetahuan", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Terjadi kesalahan saat menghapus", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return;

    if (user.role !== "pustakawan") {
      showToast("Akses ditolak! Hanya Pustakawan yang dapat memodifikasi knowledge. (403 Forbidden)", "error");
      return;
    }

    setLoading(true);

    if (editId) {
      // Edit / Update mode
      try {
        const res = await fetch("/api/knowledge/externalize", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editId,
            title,
            content,
            category,
            access,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setKnowledgeItems((prev) =>
            prev.map((item) => (item.id === editId ? data.item : item))
          );
          setTitle("");
          setContent("");
          setCategory("SOP & Panduan");
          setAccess("Terbuka");
          setEditId(null);
          showToast("Pengetahuan berhasil diperbarui!", "success");
        } else {
          showToast("Gagal memperbarui pengetahuan", "error");
        }
      } catch (error) {
        console.error("Update failed:", error);
        showToast("Terjadi kesalahan saat memperbarui", "error");
      } finally {
        setLoading(false);
      }
    } else {
      // Create mode
      try {
        const res = await fetch("/api/knowledge/externalize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content,
            userId: user.id,
            category,
            access,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setKnowledgeItems((prev) => [data.item, ...prev]);
          setTitle("");
          setContent("");
          setCategory("SOP & Panduan");
          setAccess("Terbuka");
          showToast("Pengetahuan berhasil disimpan! (201 Created) — Vector embedding telah dibuat", "success");

          // Animate new item
          const loadGSAP = async () => {
            const gsapModule = await import("gsap");
            const gsap = gsapModule.default;
            const newItem = document.querySelector(".knowledge-item:first-child");
            if (newItem) {
              gsap.from(newItem, {
                y: -20,
                opacity: 0,
                scale: 0.95,
                duration: 0.5,
                ease: "back.out(1.7)",
              });
            }
          };
          loadGSAP();
        } else {
          showToast("Gagal menyimpan pengetahuan", "error");
        }
      } catch (error) {
        console.error("Submit failed:", error);
        showToast("Terjadi kesalahan saat menyimpan", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  if (!user) return null;

  const isPustakawan = user.role === "pustakawan";

  const renderCover = (cover: string, title: string) => {
    if (cover && (cover.startsWith("http") || cover.startsWith("/"))) {
      return <img src={cover} alt={title} className="book-table-cover" />;
    }
    return (
      <div className="book-table-cover-placeholder">
        {cover || "📘"}
      </div>
    );
  };

  return (
    <>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

      <div className="page">
        <div className="dashboard-layout">
          {/* Sidebar */}
          {isPustakawan ? (
            <aside className="sidebar">
              <div className="user-profile-section">
                <div className="avatar-container">
                  <User size={36} />
                </div>
                <h3 className="user-profile-name">{user.name}</h3>
                <span className="user-profile-role" style={{ textTransform: "capitalize" }}>
                  {user.role}
                </span>
              </div>

              <div className="sidebar-section">
                <div className="sidebar-label">MENU UTAMA</div>
                <Link href="/dashboard" className="sidebar-link">
                  <span className="sidebar-icon"><LayoutDashboard size={18} /></span>
                  Dashboard Saya
                </Link>
                <Link href="/search" className="sidebar-link">
                  <span className="sidebar-icon"><Search size={18} /></span>
                  Pencarian Koleksi
                </Link>
              </div>

              <div className="sidebar-section">
                <div className="sidebar-label">ADMIN</div>
                <Link href="/dashboard" className="sidebar-link">
                  <span className="sidebar-icon"><LayoutDashboard size={18} /></span>
                  Admin Overview
                </Link>
                <Link href="/dashboard/admin/books" className="sidebar-link">
                  <span className="sidebar-icon"><Library size={18} /></span>
                  Kelola Buku
                </Link>
                <Link href="/knowledge" className="sidebar-link sidebar-link-active">
                  <span className="sidebar-icon"><Brain size={18} /></span>
                  Knowledge Base
                </Link>
                <Link href="/settings" className="sidebar-link">
                  <span className="sidebar-icon"><Settings size={18} /></span>
                  Pengaturan
                </Link>
              </div>
            </aside>
          ) : (
            <aside className="sidebar">
              <div className="user-profile-section">
                <div className="avatar-container">
                  <User size={36} />
                </div>
                <h3 className="user-profile-name">{user.name}</h3>
                <span className="user-profile-role">{user.role}</span>
              </div>

              <div className="sidebar-section">
                <div className="sidebar-label">MENU UTAMA</div>
                <Link href="/dashboard" className="sidebar-link">
                  <span className="sidebar-icon"><LayoutDashboard size={18} /></span>
                  Dashboard Saya
                </Link>
                <Link href="/search" className="sidebar-link">
                  <span className="sidebar-icon"><Search size={18} /></span>
                  Pencarian Koleksi
                </Link>
                <Link href="/circulation" className="sidebar-link">
                  <span className="sidebar-icon"><History size={18} /></span>
                  Riwayat Sirkulasi
                </Link>
                <button onClick={() => setShowBookmarksModal(true)} className="sidebar-link-btn">
                  <span className="sidebar-icon"><Bookmark size={18} /></span>
                  Koleksi Tersimpan
                </button>
                <Link href="/dashboard#antrean-buku-section" className="sidebar-link">
                  <span className="sidebar-icon"><Clock size={18} /></span>
                  Antrean Buku
                </Link>
              </div>

              <div className="sidebar-section">
                <div className="sidebar-label">AKUN</div>
                <button onClick={() => setShowProfileModal(true)} className="sidebar-link-btn">
                  <span className="sidebar-icon"><User size={18} /></span>
                  Profil Saya
                </button>
                <Link href="/settings" className="sidebar-link">
                  <span className="sidebar-icon"><Settings size={18} /></span>
                  Pengaturan
                </Link>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className="dashboard-main">
            {/* Header */}
            <div className="dashboard-welcome-header" style={{ marginBottom: 24 }}>
              <div>
                <h1 className="admin-welcome-title" style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "1.5rem" }}>
                  <Brain size={28} /> Knowledge Externalization
                </h1>
                <p className="admin-welcome-sub">
                  {isPustakawan
                    ? "Dokumentasikan tacit knowledge menjadi explicit knowledge untuk perpustakaan"
                    : "Lihat panduan dan SOP perpustakaan yang telah didokumentasikan"}
                </p>
              </div>
            </div>

            {/* Layout content grid */}
            <div className="knowledge-layout">
              {/* Form Section */}
              <div ref={formRef}>
                <div className="knowledge-form-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "8px" }}>
                      <FileEdit size={20} /> {editId ? "Edit Pengetahuan" : "Tambah Pengetahuan Baru"}
                    </h3>
                    {isPustakawan ? (
                      <span className="badge badge-success" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><CheckCircle2 size={14} /> Akses Diberikan</span>
                    ) : (
                      <span className="badge badge-danger" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><Lock size={14} /> Pustakawan Only</span>
                    )}
                  </div>

                  {!isPustakawan && (
                    <div
                      style={{
                        padding: "24px",
                        background: "var(--danger-light)",
                        borderRadius: "var(--radius-md)",
                        textAlign: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <span style={{ fontSize: "2rem", display: "flex", justifyContent: "center", marginBottom: "12px" }}><Lock size={48} className="text-danger" /></span>
                      <h4 style={{ margin: "8px 0 4px", color: "var(--danger)" }}>
                        Error 403 Forbidden
                      </h4>
                      <p style={{ fontSize: "0.88rem", color: "var(--gray-600)" }}>
                        Hanya Pustakawan yang dapat menambah pengetahuan baru.
                        <br />
                        Login sebagai Pustakawan untuk mengakses fitur ini.
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="input-group" style={{ marginBottom: "16px" }}>
                      <label className="input-label" htmlFor="kb-title">
                        Judul SOP / Strategi <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        id="kb-title"
                        type="text"
                        className="input"
                        placeholder="Contoh: Panduan Perpanjangan Pinjaman"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        disabled={!isPustakawan}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                      <div className="input-group">
                        <label className="input-label" htmlFor="kb-category">
                          Kategori
                        </label>
                        <select
                          id="kb-category"
                          className="input"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          disabled={!isPustakawan}
                          style={{ appearance: "auto" }}
                        >
                          <option value="SOP & Panduan">SOP & Panduan</option>
                          <option value="Riset & Jurnal">Riset & Jurnal</option>
                          <option value="Kebijakan">Kebijakan</option>
                        </select>
                      </div>

                      <div className="input-group">
                        <label className="input-label" htmlFor="kb-access">
                          Status Akses
                        </label>
                        <select
                          id="kb-access"
                          className="input"
                          value={access}
                          onChange={(e) => setAccess(e.target.value)}
                          disabled={!isPustakawan}
                          style={{ appearance: "auto" }}
                        >
                          <option value="Terbuka">Terbuka</option>
                          <option value="Terbatas">Terbatas</option>
                        </select>
                      </div>
                    </div>

                    <div className="input-group" style={{ marginBottom: "20px" }}>
                      <label className="input-label" htmlFor="kb-content">
                        Konten Pengetahuan <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <textarea
                        id="kb-content"
                        className="input"
                        placeholder="Tuliskan strategi penelusuran, SOP, atau panduan yang ingin didokumentasikan..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        disabled={!isPustakawan}
                        style={{ minHeight: "180px" }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "12px" }}>
                      {editId && (
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={() => {
                            setEditId(null);
                            setTitle("");
                            setContent("");
                            setCategory("SOP & Panduan");
                            setAccess("Terbuka");
                          }}
                          style={{ flex: 1 }}
                        >
                          Batal
                        </button>
                      )}
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!isPustakawan || loading}
                        style={{ flex: editId ? 2 : 1 }}
                      >
                        {loading ? (
                          <span style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                            <span className="loading-dots">
                              <span></span>
                              <span></span>
                              <span></span>
                            </span>
                            Menyimpan...
                          </span>
                        ) : (
                          <span style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                            <Lightbulb size={18} /> {editId ? "Perbarui Pengetahuan" : "Simpan & Externalize Knowledge"}
                          </span>
                        )}
                      </button>
                    </div>
                  </form>

                  <div
                    style={{
                      marginTop: "20px",
                      padding: "16px",
                      background: "var(--primary-lighter)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.82rem",
                      color: "var(--gray-600)",
                      lineHeight: "1.6",
                    }}
                  >
                    <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}><Lightbulb size={16} /> Proses Externalization (SECI Model):</strong>
                    <br />
                    1. Teks dipotong menjadi chunks
                    <br />
                    2. Setiap chunk diubah menjadi vector embedding
                    <br />
                    3. Disimpan ke tabel knowledge_base (PostgreSQL + pgvector)
                    <br />
                    4. Data ini digunakan oleh Chatbot RAG untuk menjawab pertanyaan
                  </div>
                </div>
              </div>

              {/* Knowledge List */}
              <AnimatedSection animation="fade-right" delay={0.2}>
                <div className="knowledge-list-card">
                  <h3 style={{ fontSize: "1.2rem", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Library size={24} /> Knowledge Base ({knowledgeItems.length} entries)
                  </h3>

                  {knowledgeItems.map((item) => (
                    <div key={item.id} className="knowledge-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", background: "white" }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--gray-900)", marginBottom: "6px" }}>{item.title}</h4>
                        <p className="knowledge-item-content" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: "8px", fontSize: "0.85rem" }}>
                          {item.content}
                        </p>
                        <div className="knowledge-item-meta" style={{ flexWrap: "wrap", gap: "8px" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><User size={14} /> {item.authorName || "Pustakawan"}</span>
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Calendar size={14} /> {new Date(item.createdAt).toLocaleDateString("id-ID")}</span>
                          <span className="badge badge-primary" style={{ fontSize: "0.7rem", background: "var(--primary-light)", color: "var(--primary)" }}>{item.category || "SOP & Panduan"}</span>
                          <span className={`badge ${item.access === "Terbatas" ? "badge-warning" : "badge-success"}`} style={{ fontSize: "0.7rem" }}>{item.access || "Terbuka"}</span>
                          <span className="badge badge-success" style={{ fontSize: "0.7rem", background: "var(--success-light)", color: "var(--success)", border: "none" }}>Vectorized</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                        <button 
                          onClick={() => setViewItem(item)}
                          className="btn btn-sm" 
                          style={{ padding: "6px", minWidth: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--gray-100)", border: "1px solid var(--gray-200)", color: "var(--gray-600)" }}
                          title="Lihat Detail"
                        >
                          <Eye size={16} />
                        </button>
                        {isPustakawan && (
                          <>
                            <button 
                              onClick={() => handleStartEdit(item)}
                              className="btn btn-sm" 
                              style={{ padding: "6px", minWidth: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--gray-100)", border: "1px solid var(--gray-200)", color: "var(--primary)" }}
                              title="Edit"
                            >
                              <FileEdit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="btn btn-sm" 
                              style={{ padding: "6px", minWidth: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--danger-light)", border: "1px solid var(--danger-light)", color: "var(--danger)" }}
                              title="Hapus"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </main>
        </div>
      </div>

      {/* Bookmarks (Koleksi Tersimpan) Modal */}
      {showBookmarksModal && (
        <div className="custom-modal-overlay" onClick={() => setShowBookmarksModal(false)}>
          <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Koleksi Tersimpan (Wishlist)</h3>
              <button onClick={() => setShowBookmarksModal(false)} className="close-modal-btn">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {bookmarks.length > 0 ? (
                <div className="table-wrapper">
                  <table className="user-dashboard-table">
                    <thead>
                      <tr>
                        <th>Buku</th>
                        <th>Ditambahkan Pada</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookmarks.map((bm: any) => (
                        <tr key={bm.id}>
                          <td>
                            <div className="book-cell">
                              {renderCover(bm.book?.cover || "📘", bm.book?.title || "Buku")}
                              <div className="book-meta">
                                <div className="book-title">{bm.book?.title}</div>
                                <div className="book-author">{bm.book?.author || "Unknown Author"}</div>
                              </div>
                            </div>
                          </td>
                          <td>{new Date(bm.createdAt).toLocaleDateString("id-ID")}</td>
                          <td>
                            <Link href={`/search?q=${encodeURIComponent(bm.book?.title || '')}`} onClick={() => setShowBookmarksModal(false)} className="btn btn-sm btn-outline">
                              Lihat Detail
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-panel-state">
                  <Bookmark size={48} style={{ color: "var(--gray-300)", margin: "0 auto 16px" }} />
                  <p>Belum ada koleksi yang disimpan.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="custom-modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="custom-modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Profil Saya</h3>
              <button onClick={() => setShowProfileModal(false)} className="close-modal-btn">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body profile-modal-body">
              <div className="profile-modal-avatar">
                <User size={48} />
              </div>
              <h4 className="profile-name">{user.name}</h4>
              <p className="profile-role" style={{ textTransform: 'capitalize' }}>{user.role}</p>
              
              <div className="profile-info-list">
                <div className="profile-info-item">
                  <span className="info-label">Email</span>
                  <span className="info-val">{user.email}</span>
                </div>
                <div className="profile-info-item">
                  <span className="info-label">Username</span>
                  <span className="info-val">{user.username || user.email.split('@')[0]}</span>
                </div>
                <div className="profile-info-item">
                  <span className="info-label">Limit Peminjaman</span>
                  <span className="info-val">{user.borrowLimit} Buku</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Knowledge Item Modal */}
      {viewItem && (
        <div className="custom-modal-overlay" onClick={() => setViewItem(null)}>
          <div className="custom-modal-content max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detail Pengetahuan</h3>
              <button onClick={() => setViewItem(null)} className="close-modal-btn">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <h2 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "12px", color: "var(--gray-900)", lineHeight: "1.4" }}>{viewItem.title}</h2>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
                <span className="badge badge-primary" style={{ background: "var(--primary-light)", color: "var(--primary)", border: "none" }}>{viewItem.category}</span>
                <span className={`badge ${viewItem.access === "Terbatas" ? "badge-warning" : "badge-success"}`} style={{ border: "none" }}>{viewItem.access}</span>
                <span className="badge badge-gray" style={{ background: "var(--gray-100)", color: "var(--gray-600)", border: "none" }}>Oleh: {viewItem.authorName}</span>
                <span className="badge badge-gray" style={{ background: "var(--gray-100)", color: "var(--gray-600)", border: "none" }}>{new Date(viewItem.createdAt).toLocaleDateString("id-ID")}</span>
              </div>
              <div style={{ 
                background: "var(--gray-50)", 
                padding: "20px", 
                borderRadius: "8px", 
                border: "1px solid var(--gray-200)", 
                whiteSpace: "pre-wrap", 
                fontSize: "0.95rem",
                lineHeight: "1.6",
                color: "var(--gray-800)",
                maxHeight: "350px",
                overflowY: "auto"
              }}>
                {viewItem.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

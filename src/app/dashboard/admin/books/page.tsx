"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Plus, Loader2, Save, X, Book, BookOpen,
  ClipboardList, Coins, AlertTriangle, CheckCircle2,
  ArrowUpFromLine, XCircle, CreditCard, PartyPopper,
  Library, LayoutDashboard, Brain, User, Users, Settings,
  Calendar, Eye, RotateCcw, ChevronLeft, ChevronRight,
  Download, Filter, Bell
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function AdminBooksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Main tab
  const [mainTab, setMainTab] = useState("tambah");

  // ===== Tambah Buku State =====
  const [isbn, setIsbn] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bookData, setBookData] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ===== Sirkulasi State =====
  const [circulationTab, setCirculationTab] = useState("active");
  const [stats, setStats] = useState<any>(null);
  const [tabCounts, setTabCounts] = useState({ active: 0, history: 0, fines: 0 });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [finesList, setFinesList] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  // Search & filter
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter dropdowns
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  // Live clock
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "pustakawan")) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch sirkulasi data
  const fetchSirkulasi = useCallback(async () => {
    if (!user || user.role !== "pustakawan") return;
    setDataLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("tab", circulationTab);
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (searchQuery) params.set("search", searchQuery);
      if (statusFilter) params.set("status", statusFilter);
      if (categoryFilter) params.set("category", categoryFilter);

      const res = await fetch(`/api/dashboard/sirkulasi?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setTabCounts(data.tabCounts);
        setTransactions(data.transactions || []);
        setFinesList(data.finesList || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Failed to fetch sirkulasi:", err);
    } finally {
      setDataLoading(false);
    }
  }, [user, circulationTab, page, limit, searchQuery, statusFilter, categoryFilter]);

  useEffect(() => {
    if (mainTab === "sirkulasi") {
      fetchSirkulasi();
    }
  }, [mainTab, fetchSirkulasi]);

  // Auto refresh every 30s
  useEffect(() => {
    if (mainTab !== "sirkulasi") return;
    const interval = setInterval(fetchSirkulasi, 30000);
    return () => clearInterval(interval);
  }, [mainTab, fetchSirkulasi]);

  if (authLoading) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <span className="loading-dots"><span></span><span></span><span></span></span>
      </div>
    );
  }

  if (!user || user.role !== "pustakawan") return null;

  const showToast = (message: string, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ===== Tambah Buku Handlers =====
  const fetchFromGoogleBooks = async (e: any) => {
    e.preventDefault();
    if (!isbn.trim()) return;
    setLoading(true);
    setError("");
    setBookData(null);
    setSuccess("");
    try {
      const res = await fetch(`/api/books/fetch?isbn=${isbn.replace(/-/g, "")}`);
      const data = await res.json();
      if (res.ok && data.book) {
        setBookData(data.book);
      } else {
        setError(data.error || "Buku tidak ditemukan di Google Books");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const saveToDatabase = async () => {
    if (!bookData) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Buku berhasil ditambahkan ke perpustakaan!");
        setBookData(null);
        setIsbn("");
      } else {
        setError(data.error || "Gagal menyimpan buku ke database");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  // ===== Sirkulasi Handlers =====
  const handleReturn = async (transactionId: string) => {
    try {
      const res = await fetch("/api/circulation/transaction", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message, data.fineAmount > 0 ? "info" : "success");
        fetchSirkulasi();
      } else {
        showToast(data.error || "Gagal mengembalikan buku", "error");
      }
    } catch {
      showToast("Gagal mengembalikan buku", "error");
    }
  };

  const handlePayFine = async (fineId: string) => {
    try {
      const res = await fetch("/api/circulation/fines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fineId }),
      });
      if (res.ok) {
        showToast("Pembayaran denda berhasil!", "success");
        fetchSirkulasi();
      }
    } catch {
      showToast("Gagal membayar denda", "error");
    }
  };

  const formatDay = (date: Date) => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" });
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const getStatusBadge = (status: string, daysLate: number) => {
    switch (status) {
      case "overdue":
        return <span className="badge badge-danger" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.75rem" }}><AlertTriangle size={12} /> Terlambat ({daysLate} hari)</span>;
      case "dueToday":
        return <span className="badge badge-warning" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.75rem" }}>Jatuh Tempo Hari Ini</span>;
      case "returned":
        return <span className="badge badge-success" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.75rem" }}><CheckCircle2 size={12} /> Dikembalikan</span>;
      default:
        return <span className="badge badge-success" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.75rem" }}>Dipinjam</span>;
    }
  };

  const startIdx = (page - 1) * limit + 1;
  const endIdx = Math.min(page * limit, total);

  const s = stats || { activeBorrows: 0, activeMembers: 0, dueTodayCount: 0, overdueCount: 0, normalCount: 0, totalDenda: 0, dueIn3Days: 0 };

  return (
    <>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

      <div className="page">
        <div className="dashboard-layout">
          {/* Sidebar */}
          {/* Sidebar */}
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
              <Link href="/dashboard/admin/books" className="sidebar-link sidebar-link-active">
                <span className="sidebar-icon"><Library size={18} /></span>
                Kelola Buku
              </Link>
              <Link href="/knowledge" className="sidebar-link">
                <span className="sidebar-icon"><Brain size={18} /></span>
                Knowledge Base
              </Link>
              <Link href="/settings" className="sidebar-link">
                <span className="sidebar-icon"><Settings size={18} /></span>
                Pengaturan
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="dashboard-main">
            {/* Header */}
            <div className="admin-welcome-row" style={{ marginBottom: 20 }}>
              <div>
                <h1 className="admin-welcome-title" style={{ fontSize: "1.5rem" }}>Kelola Buku & Sirkulasi</h1>
                <p className="admin-welcome-sub">Kelola peminjaman, pengembalian, dan denda buku perpustakaan</p>
              </div>
              <div className="admin-live-clock">
                <Calendar size={16} />
                <div>
                  <div className="admin-clock-date">{formatDay(currentTime)}</div>
                  <div className="admin-clock-time">{formatTime(currentTime)}</div>
                </div>
              </div>
            </div>

            {/* Main Tabs */}
            <div className="tabs" style={{ marginBottom: 28 }}>
              <button
                className={`tab ${mainTab === "tambah" ? "tab-active" : ""}`}
                onClick={() => setMainTab("tambah")}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <Plus size={16} /> Tambah Buku
              </button>
              <button
                className={`tab ${mainTab === "sirkulasi" ? "tab-active" : ""}`}
                onClick={() => setMainTab("sirkulasi")}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <BookOpen size={16} /> Sirkulasi & Denda
              </button>
            </div>

            {/* ===== TAMBAH BUKU TAB ===== */}
            {mainTab === "tambah" && (
              <AnimatedSection animation="fade-up">
                <div className="card" style={{ padding: "30px", marginBottom: "30px", background: "white", borderRadius: "12px" }}>
                  <p style={{ color: "var(--gray-600)", marginBottom: "20px" }}>
                    Masukkan ISBN buku untuk mengambil data (Judul, Penulis, Sinopsis, dan Cover) secara otomatis dari database Google Books.
                  </p>
                  <form onSubmit={fetchFromGoogleBooks} style={{ display: "flex", gap: "16px" }}>
                    <input type="text" placeholder="Masukkan ISBN (Contoh: 9780132350884)" value={isbn} onChange={(e) => setIsbn(e.target.value)} className="input-field" style={{ flex: 1, padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--gray-300)" }} required />
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 24px" }}>
                      {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                      Cari Buku
                    </button>
                  </form>
                  {error && <div style={{ marginTop: "16px", color: "red", padding: "12px", background: "#fee2e2", borderRadius: "8px" }}>{error}</div>}
                  {success && <div style={{ marginTop: "16px", color: "green", padding: "12px", background: "#dcfce7", borderRadius: "8px" }}>{success}</div>}
                </div>

                {bookData && (
                  <div className="card" style={{ padding: "30px", background: "white", borderRadius: "12px" }}>
                    <h3 style={{ marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid var(--gray-200)" }}>Preview Data Buku</h3>
                    <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
                      <div style={{ flexShrink: 0 }}>
                        {bookData.cover.startsWith("http") ? (
                          <img src={bookData.cover} alt="Cover" style={{ width: "160px", height: "230px", objectFit: "cover", borderRadius: "8px", boxShadow: "var(--shadow-md)" }} />
                        ) : (
                          <div style={{ width: "160px", height: "230px", background: "var(--gray-100)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", fontSize: "4rem" }}>{bookData.cover}</div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: "300px" }}>
                        <div style={{ marginBottom: "16px" }}>
                          <label style={{ display: "block", fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: "4px" }}>Judul Buku</label>
                          <div style={{ fontWeight: "700", fontSize: "1.2rem", color: "var(--gray-900)" }}>{bookData.title}</div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                          <div><label style={{ display: "block", fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: "4px" }}>Penulis</label><div style={{ fontWeight: "600", color: "var(--gray-800)" }}>{bookData.author}</div></div>
                          <div><label style={{ display: "block", fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: "4px" }}>Tahun Terbit</label><div style={{ fontWeight: "600", color: "var(--gray-800)" }}>{bookData.year}</div></div>
                          <div><label style={{ display: "block", fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: "4px" }}>ISBN</label><div style={{ fontWeight: "600", color: "var(--gray-800)" }}>{bookData.isbn}</div></div>
                          <div><label style={{ display: "block", fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: "4px" }}>Halaman</label><div style={{ fontWeight: "600", color: "var(--gray-800)" }}>{bookData.pageCount || "-"}</div></div>
                        </div>
                        <div style={{ marginBottom: "24px" }}>
                          <label style={{ display: "block", fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: "4px" }}>Sinopsis Singkat</label>
                          <div style={{ fontSize: "0.9rem", color: "var(--gray-700)", lineHeight: "1.5", maxHeight: "100px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" }}>{bookData.description || "Tidak ada deskripsi tersedia."}</div>
                        </div>
                        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                          <button className="btn btn-primary" onClick={saveToDatabase} disabled={saving} style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "center" }}>
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Simpan ke Perpustakaan
                          </button>
                          <button className="btn" onClick={() => setBookData(null)} disabled={saving} style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--gray-100)", color: "var(--gray-700)" }}>
                            <X size={18} /> Batal
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </AnimatedSection>
            )}

            {/* ===== SIRKULASI & DENDA TAB ===== */}
            {mainTab === "sirkulasi" && (
              <AnimatedSection animation="fade-up">
                {/* Sub-tabs */}
                <div className="tabs" style={{ marginBottom: 24 }}>
                  <button className={`tab ${circulationTab === "active" ? "tab-active" : ""}`} onClick={() => { setCirculationTab("active"); setPage(1); setStatusFilter(""); }} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <BookOpen size={16} /> Aktif ({tabCounts.active})
                  </button>
                  <button className={`tab ${circulationTab === "history" ? "tab-active" : ""}`} onClick={() => { setCirculationTab("history"); setPage(1); setStatusFilter(""); }} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <ClipboardList size={16} /> Riwayat ({tabCounts.history})
                  </button>
                  <button className={`tab ${circulationTab === "fines" ? "tab-active" : ""}`} onClick={() => { setCirculationTab("fines"); setPage(1); setStatusFilter(""); }} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Coins size={16} /> Denda ({tabCounts.fines})
                  </button>
                </div>

                {/* Stats + Sidebar Layout */}
                <div className="sirkulasi-layout">
                  {/* Left: Stats + Table */}
                  <div className="sirkulasi-main">
                    {/* 4 Stat Cards */}
                    <div className="sirkulasi-stats-row">
                      <div className="sirkulasi-stat-card">
                        <div className="sirkulasi-stat-icon" style={{ background: "rgba(30,41,59,0.08)", color: "#1e293b" }}><BookOpen size={20} /></div>
                        <div className="sirkulasi-stat-info">
                          <span className="sirkulasi-stat-label">Peminjaman Aktif</span>
                          <span className="sirkulasi-stat-value">{s.activeBorrows}</span>
                          <span className="sirkulasi-stat-unit">Buku</span>
                        </div>
                        <span className="sirkulasi-stat-sub">Sedang dipinjam</span>
                      </div>
                      <div className="sirkulasi-stat-card">
                        <div className="sirkulasi-stat-icon" style={{ background: "rgba(30,41,59,0.08)", color: "#1e293b" }}><Users size={20} /></div>
                        <div className="sirkulasi-stat-info">
                          <span className="sirkulasi-stat-label">Anggota Aktif</span>
                          <span className="sirkulasi-stat-value">{s.activeMembers}</span>
                          <span className="sirkulasi-stat-unit">Orang</span>
                        </div>
                        <span className="sirkulasi-stat-sub">Meminjam buku</span>
                      </div>
                      <div className="sirkulasi-stat-card">
                        <div className="sirkulasi-stat-icon" style={{ background: "rgba(30,41,59,0.08)", color: "#1e293b" }}><Calendar size={20} /></div>
                        <div className="sirkulasi-stat-info">
                          <span className="sirkulasi-stat-label">Jatuh Tempo Hari Ini</span>
                          <span className="sirkulasi-stat-value">{s.dueTodayCount}</span>
                          <span className="sirkulasi-stat-unit">Buku</span>
                        </div>
                        <span className="sirkulasi-stat-sub">Perlu perhatian</span>
                      </div>
                      <div className="sirkulasi-stat-card">
                        <div className="sirkulasi-stat-icon" style={{ background: "rgba(30,41,59,0.08)", color: "#1e293b" }}><AlertTriangle size={20} /></div>
                        <div className="sirkulasi-stat-info">
                          <span className="sirkulasi-stat-label">Terlambat</span>
                          <span className="sirkulasi-stat-value">{s.overdueCount}</span>
                          <span className="sirkulasi-stat-unit">Buku</span>
                        </div>
                        <span className="sirkulasi-stat-sub">Denda berlaku</span>
                      </div>
                    </div>

                    {/* Search + Filter Bar */}
                    <div className="sirkulasi-toolbar">
                      <div className="user-search-box">
                        <Search size={16} className="user-search-icon" />
                        <input type="text" placeholder="Cari anggota, judul buku, atau kode..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="user-search-input" />
                      </div>
                      <div className="sirkulasi-filters">
                        {circulationTab === "active" && (
                          <div style={{ position: "relative" }}>
                            <button className="btn btn-sm btn-outline" onClick={() => { setShowStatusFilter(!showStatusFilter); setShowCategoryFilter(false); }} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem" }}>
                              {statusFilter === "overdue" ? "Terlambat" : statusFilter === "dueToday" ? "Jatuh Tempo" : statusFilter === "normal" ? "Normal" : "Semua Status"} <ChevronLeft size={14} style={{ transform: "rotate(-90deg)" }} />
                            </button>
                            {showStatusFilter && (
                              <div className="user-filter-dropdown">
                                {[{ v: "", l: "Semua Status" }, { v: "normal", l: "Normal" }, { v: "dueToday", l: "Jatuh Tempo Hari Ini" }, { v: "overdue", l: "Terlambat" }].map(o => (
                                  <button key={o.v} className={`user-filter-option ${statusFilter === o.v ? "active" : ""}`} onClick={() => { setStatusFilter(o.v); setShowStatusFilter(false); setPage(1); }}>{o.l}</button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        <div style={{ position: "relative" }}>
                          <button className="btn btn-sm btn-outline" onClick={() => { setShowCategoryFilter(!showCategoryFilter); setShowStatusFilter(false); }} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem" }}>
                            {categoryFilter || "Semua Kategori"} <ChevronLeft size={14} style={{ transform: "rotate(-90deg)" }} />
                          </button>
                          {showCategoryFilter && (
                            <div className="user-filter-dropdown">
                              <button className={`user-filter-option ${!categoryFilter ? "active" : ""}`} onClick={() => { setCategoryFilter(""); setShowCategoryFilter(false); setPage(1); }}>Semua Kategori</button>
                              {categories.map(c => (
                                <button key={c} className={`user-filter-option ${categoryFilter === c ? "active" : ""}`} onClick={() => { setCategoryFilter(c); setShowCategoryFilter(false); setPage(1); }}>{c}</button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Table */}
                    {dataLoading ? (
                      <div style={{ textAlign: "center", padding: 60 }}>
                        <span className="loading-dots"><span></span><span></span><span></span></span>
                      </div>
                    ) : circulationTab === "fines" ? (
                      /* FINES TABLE */
                      finesList.length > 0 ? (
                        <>
                          <div className="table-wrapper" style={{ borderRadius: "var(--radius-lg) var(--radius-lg) 0 0" }}>
                            <table className="table">
                              <thead>
                                <tr>
                                  <th>Peminjam</th>
                                  <th>Buku</th>
                                  <th>Jumlah Denda</th>
                                  <th>Status</th>
                                  <th>Aksi</th>
                                </tr>
                              </thead>
                              <tbody>
                                {finesList.map((fine: any) => (
                                  <tr key={fine.id}>
                                    <td>
                                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div className="sirkulasi-avatar">{getInitials(fine.userName)}</div>
                                        <div>
                                          <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{fine.userName}</div>
                                          <div style={{ fontSize: "0.78rem", color: "var(--gray-400)" }}>{fine.userEmail}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div className="sirkulasi-book-thumb">
                                          {fine.bookCover?.startsWith("http") ? <img src={fine.bookCover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Book size={16} />}
                                        </div>
                                        <div>
                                          <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{fine.bookTitle}</div>
                                          <div style={{ fontSize: "0.78rem", color: "var(--gray-400)" }}>{fine.bookAuthor}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td><span style={{ fontWeight: 700, color: "var(--danger)" }}>Rp {fine.amount.toLocaleString("id-ID")}</span></td>
                                    <td><span className="badge badge-danger" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.75rem" }}><XCircle size={12} /> Belum Bayar</span></td>
                                    <td>
                                      <button className="btn btn-sm btn-success" onClick={() => handlePayFine(fine.id)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <CreditCard size={14} /> Bayar
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {/* Pagination */}
                          <div className="user-pagination">
                            <span className="user-pagination-info">Menampilkan {startIdx} - {endIdx} dari {total} data</span>
                            <div className="user-pagination-controls">
                              <button className="user-page-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft size={16} /></button>
                              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                                <button key={p} className={`user-page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                              ))}
                              <button className="user-page-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight size={16} /></button>
                              <span style={{ fontSize: "0.82rem", color: "var(--gray-500)", marginLeft: 12 }}>Rows per page:</span>
                              <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="user-page-select">
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                              </select>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div style={{ padding: "50px 20px", textAlign: "center", background: "var(--white)", borderRadius: "var(--radius-lg)", border: "1px solid var(--gray-200)" }}>
                          <PartyPopper size={48} style={{ color: "var(--gray-300)", margin: "0 auto 16px" }} />
                          <h4 style={{ color: "var(--gray-700)", marginBottom: "8px" }}>Tidak ada denda!</h4>
                          <p style={{ color: "var(--gray-500)", fontSize: "0.9rem" }}>Tidak ada denda keterlambatan saat ini</p>
                        </div>
                      )
                    ) : (
                      /* ACTIVE / HISTORY TABLE */
                      transactions.length > 0 ? (
                        <>
                          <div className="table-wrapper" style={{ borderRadius: "var(--radius-lg) var(--radius-lg) 0 0" }}>
                            <table className="table">
                              <thead>
                                <tr>
                                  <th>Peminjam</th>
                                  <th>Buku</th>
                                  <th>Tgl Pinjam</th>
                                  <th>Tgl Jatuh Tempo</th>
                                  <th>Status</th>
                                  <th>Denda</th>
                                  <th>Aksi</th>
                                </tr>
                              </thead>
                              <tbody>
                                {transactions.map((tx: any) => (
                                  <tr key={tx.id}>
                                    <td>
                                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div className="sirkulasi-avatar">{getInitials(tx.userName)}</div>
                                        <div>
                                          <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{tx.userName}</div>
                                          <div style={{ fontSize: "0.78rem", color: "var(--gray-400)" }}>{tx.userEmail}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div className="sirkulasi-book-thumb">
                                          {tx.bookCover?.startsWith("http") ? <img src={tx.bookCover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Book size={16} />}
                                        </div>
                                        <div>
                                          <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{tx.bookTitle}</div>
                                          <div style={{ fontSize: "0.78rem", color: "var(--gray-400)" }}>{tx.bookAuthor}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td style={{ fontSize: "0.85rem" }}>{new Date(tx.borrowDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                                    <td style={{ fontSize: "0.85rem" }}>{new Date(tx.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                                    <td>{getStatusBadge(tx.status, tx.daysLate)}</td>
                                    <td>
                                      {tx.fineAmount > 0 ? (
                                        <span style={{ fontWeight: 600, color: "var(--danger)" }}>Rp {tx.fineAmount.toLocaleString("id-ID")}</span>
                                      ) : (
                                        <span style={{ color: "var(--gray-400)" }}>Rp 0</span>
                                      )}
                                    </td>
                                    <td>
                                      <div style={{ display: "flex", gap: 6 }}>
                                        {circulationTab === "active" && (
                                          <button className="user-action-btn" title="Kembalikan" onClick={() => handleReturn(tx.id)} style={{ color: "#3b82f6", borderColor: "#3b82f6" }}>
                                            <RotateCcw size={14} />
                                          </button>
                                        )}
                                        <button className="user-action-btn" title="Detail">
                                          <Eye size={14} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {/* Pagination */}
                          <div className="user-pagination">
                            <span className="user-pagination-info">Menampilkan {startIdx} - {endIdx} dari {total} data</span>
                            <div className="user-pagination-controls">
                              <button className="user-page-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft size={16} /></button>
                              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                                <button key={p} className={`user-page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                              ))}
                              <button className="user-page-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight size={16} /></button>
                              <span style={{ fontSize: "0.82rem", color: "var(--gray-500)", marginLeft: 12 }}>Rows per page:</span>
                              <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="user-page-select">
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                              </select>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div style={{ padding: "50px 20px", textAlign: "center", background: "var(--white)", borderRadius: "var(--radius-lg)", border: "1px solid var(--gray-200)" }}>
                          {circulationTab === "active" ? <Book size={48} style={{ color: "var(--gray-300)", margin: "0 auto 16px" }} /> : <ClipboardList size={48} style={{ color: "var(--gray-300)", margin: "0 auto 16px" }} />}
                          <h4 style={{ color: "var(--gray-700)", marginBottom: "8px" }}>{circulationTab === "active" ? "Tidak ada peminjaman aktif" : "Belum ada riwayat"}</h4>
                          <p style={{ color: "var(--gray-500)", fontSize: "0.9rem" }}>{circulationTab === "active" ? "Semua buku sudah dikembalikan" : "Riwayat peminjaman akan muncul di sini"}</p>
                        </div>
                      )
                    )}
                  </div>

                  {/* Right Sidebar: Ringkasan Denda + Pengingat */}
                  <div className="sirkulasi-sidebar">
                    {/* Ringkasan Denda */}
                    <div className="sirkulasi-sidebar-card">
                      <h4 className="sirkulasi-sidebar-title">Ringkasan Denda</h4>
                      <div className="sirkulasi-donut-wrapper">
                        <svg viewBox="0 0 120 120" className="sirkulasi-donut">
                          {(() => {
                            const total = s.overdueCount + s.dueTodayCount + s.normalCount || 1;
                            const overdueAngle = (s.overdueCount / total) * 360;
                            const dueTodayAngle = (s.dueTodayCount / total) * 360;
                            const normalAngle = (s.normalCount / total) * 360;

                            const toArc = (startAngle: number, angle: number, color: string) => {
                              if (angle === 0) return null;
                              const r = 45;
                              const cx = 60, cy = 60;
                              const startRad = (startAngle - 90) * Math.PI / 180;
                              const endRad = (startAngle + angle - 90) * Math.PI / 180;
                              const x1 = cx + r * Math.cos(startRad);
                              const y1 = cy + r * Math.sin(startRad);
                              const x2 = cx + r * Math.cos(endRad);
                              const y2 = cy + r * Math.sin(endRad);
                              const largeArc = angle > 180 ? 1 : 0;
                              return <path key={color} d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`} fill={color} />;
                            };

                            return (
                              <>
                                {toArc(0, overdueAngle, "#ef4444")}
                                {toArc(overdueAngle, dueTodayAngle, "#f59e0b")}
                                {toArc(overdueAngle + dueTodayAngle, normalAngle, "#10b981")}
                                <circle cx="60" cy="60" r="28" fill="white" />
                              </>
                            );
                          })()}
                        </svg>
                      </div>
                      <div className="sirkulasi-legend">
                        <div className="sirkulasi-legend-item">
                          <span className="sirkulasi-legend-dot" style={{ background: "#ef4444" }}></span>
                          <span className="sirkulasi-legend-label">Terlambat</span>
                          <span className="sirkulasi-legend-count">{s.overdueCount} buku</span>
                        </div>
                        <div className="sirkulasi-legend-item">
                          <span className="sirkulasi-legend-dot" style={{ background: "#f59e0b" }}></span>
                          <span className="sirkulasi-legend-label">Jatuh Tempo Hari Ini</span>
                          <span className="sirkulasi-legend-count">{s.dueTodayCount} buku</span>
                        </div>
                        <div className="sirkulasi-legend-item">
                          <span className="sirkulasi-legend-dot" style={{ background: "#10b981" }}></span>
                          <span className="sirkulasi-legend-label">Normal</span>
                          <span className="sirkulasi-legend-count">{s.normalCount} buku</span>
                        </div>
                      </div>
                      <div className="sirkulasi-total-denda">
                        <span>Total Denda</span>
                        <span className="sirkulasi-total-denda-amount">Rp {s.totalDenda.toLocaleString("id-ID")}</span>
                      </div>
                      <button className="btn btn-sm btn-outline" style={{ width: "100%", marginTop: 12 }} onClick={() => { setCirculationTab("fines"); setMainTab("sirkulasi"); }}>
                        Lihat Semua Denda
                      </button>
                    </div>

                    {/* Pengingat */}
                    <div className="sirkulasi-sidebar-card">
                      <h4 className="sirkulasi-sidebar-title">Pengingat</h4>
                      <div className="sirkulasi-reminder-list">
                        {s.dueTodayCount > 0 && (
                          <div className="sirkulasi-reminder-item">
                            <div className="sirkulasi-reminder-icon" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}><Bell size={16} /></div>
                            <div className="sirkulasi-reminder-info">
                              <div className="sirkulasi-reminder-title">{s.dueTodayCount} buku akan jatuh tempo hari ini</div>
                              <div className="sirkulasi-reminder-desc">Segera informasikan ke peminjam</div>
                            </div>
                            <ChevronRight size={16} style={{ color: "var(--gray-400)", flexShrink: 0 }} />
                          </div>
                        )}
                        {s.overdueCount > 0 && (
                          <div className="sirkulasi-reminder-item">
                            <div className="sirkulasi-reminder-icon" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}><AlertTriangle size={16} /></div>
                            <div className="sirkulasi-reminder-info">
                              <div className="sirkulasi-reminder-title">{s.overdueCount} buku terlambat dikembalikan</div>
                              <div className="sirkulasi-reminder-desc">Denda sudah berlaku</div>
                            </div>
                            <ChevronRight size={16} style={{ color: "var(--gray-400)", flexShrink: 0 }} />
                          </div>
                        )}
                        {s.dueIn3Days > 0 && (
                          <div className="sirkulasi-reminder-item">
                            <div className="sirkulasi-reminder-icon" style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}><Calendar size={16} /></div>
                            <div className="sirkulasi-reminder-info">
                              <div className="sirkulasi-reminder-title">{s.dueIn3Days} buku akan jatuh tempo 3 hari lagi</div>
                              <div className="sirkulasi-reminder-desc">Pastikan pengembalian tepat waktu</div>
                            </div>
                            <ChevronRight size={16} style={{ color: "var(--gray-400)", flexShrink: 0 }} />
                          </div>
                        )}
                        {s.dueTodayCount === 0 && s.overdueCount === 0 && s.dueIn3Days === 0 && (
                          <div style={{ textAlign: "center", padding: "20px 10px", color: "var(--gray-400)", fontSize: "0.85rem" }}>
                            Tidak ada pengingat saat ini
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

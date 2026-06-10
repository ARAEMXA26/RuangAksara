"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatsCard from "@/components/StatsCard";
import AnimatedSection from "@/components/AnimatedSection";
import DashboardAdmin from "@/components/Dashboard/DashboardAdmin";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Search, BookOpen, Bot, Brain,
  AlertTriangle, Coins, Library, User, Bookmark, Clock,
  Users, Settings, ChevronRight, X, RefreshCw, History, Calendar
} from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [fines, setFines] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showBookmarksModal, setShowBookmarksModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch data from API (for mahasiswa/dosen dashboard)
  useEffect(() => {
    if (!user) return;
    // Skip fetch for pustakawan since they use DashboardAdmin
    if (user.role === "pustakawan") {
      setDataLoading(false);
      return;
    }

    const fetchData = async () => {
      setDataLoading(true);
      try {
        const [txRes, fineRes, bkRes, rsvRes, booksRes] = await Promise.all([
          fetch(`/api/circulation/transaction?userId=${user.id}`),
          fetch(`/api/circulation/fines?userId=${user.id}`),
          fetch(`/api/bookmarks?userId=${user.id}`),
          fetch(`/api/reservations?userId=${user.id}`),
          fetch(`/api/books`),
        ]);

        if (txRes.ok) {
          const txData = await txRes.json();
          setTransactions(txData.transactions || []);
        }
        if (fineRes.ok) {
          const fineData = await fineRes.json();
          setFines(fineData.fines || []);
        }
        if (bkRes.ok) {
          const bkData = await bkRes.json();
          setBookmarks(bkData.bookmarks || []);
        }
        if (rsvRes.ok) {
          const rsvData = await rsvRes.json();
          setReservations(rsvData.reservations || []);
        }
        if (booksRes.ok) {
          const booksData = await booksRes.json();
          setRecommendations(booksData.books || []);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (authLoading || dataLoading) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <span className="loading-dots"><span></span><span></span><span></span></span>
      </div>
    );
  }

  if (!user) return null;

  // ============================================================
  // PUSTAKAWAN → Admin Dashboard (wireframe layout)
  // ============================================================
  if (user.role === "pustakawan") {
    return (
      <div className="page">
        <div className="dashboard-layout">
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
              <Link href="/dashboard" className="sidebar-link sidebar-link-active">
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
              <Link href="/dashboard" className="sidebar-link sidebar-link-active">
                <span className="sidebar-icon"><LayoutDashboard size={18} /></span>
                Admin Overview
              </Link>
              <Link href="/dashboard/admin/books" className="sidebar-link">
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

          {/* Main Content — Admin Dashboard */}
          <main className="dashboard-main">
            <DashboardAdmin userName={user.name?.split(" ")[0] || "Admin"} />
          </main>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAHASISWA / DOSEN → User Dashboard (Redesigned)
  // ============================================================
  const activeLoans = transactions.filter((t: any) => t.status === "active" || t.status === "overdue");

  const formatIndonesianDate = (date: Date) => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember",
    ];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatIndonesianTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes} WIB`;
  };

  const formatDateWIB = (dateInput: any) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes} WIB`;
  };

  const getRemainingTime = (dueDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dueDateStr);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return { text: "Terlambat", isOverdue: true };
    } else if (diffDays === 0) {
      return { text: "Hari ini", isOverdue: false, daysLeft: 0 };
    } else {
      return { text: `${diffDays} hari lagi`, isOverdue: false, daysLeft: diffDays };
    }
  };

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

  const recentActivities = [];
  
  // 1. Transactions
  transactions.forEach((tx: any) => {
    if (tx.borrowDate) {
      recentActivities.push({
        type: "borrow",
        title: `Peminjaman buku "${tx.bookTitle}"`,
        date: new Date(tx.borrowDate),
      });
    }
    if (tx.returnDate) {
      recentActivities.push({
        type: "return",
        title: `Pengembalian buku "${tx.bookTitle}"`,
        date: new Date(tx.returnDate),
      });
    }
  });

  // 2. Bookmarks
  bookmarks.forEach((bm: any) => {
    if (bm.createdAt) {
      recentActivities.push({
        type: "bookmark",
        title: `Menyimpan buku "${bm.book?.title || 'Buku'}"`,
        date: new Date(bm.createdAt),
      });
    }
  });

  // 3. Reservations
  reservations.forEach((rsv: any) => {
    if (rsv.createdAt) {
      recentActivities.push({
        type: "reservation",
        title: `Bergabung antrean "${rsv.book?.title || 'Buku'}"`,
        date: new Date(rsv.createdAt),
      });
    }
  });

  // Sort activities by date descending
  recentActivities.sort((a, b) => b.date.getTime() - a.date.getTime());
  const displayActivities = recentActivities.slice(0, 4);

  return (
    <>
      <div className="page">
        <div className="dashboard-layout">
          {/* Sidebar */}
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
              <Link href="/dashboard" className="sidebar-link sidebar-link-active">
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
              <a href="#antrean-buku-section" className="sidebar-link">
                <span className="sidebar-icon"><Clock size={18} /></span>
                Antrean Buku
              </a>
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

            {/* Account Summary Widget (Ringkasan Akun) */}
            <div className="sidebar-summary-card">
              <div className="sidebar-summary-title">Ringkasan Akun</div>
              <div className="sidebar-summary-item">
                <span className="sidebar-summary-icon summary-blue"><BookOpen size={16} /></span>
                <div className="sidebar-summary-info">
                  <span className="summary-label">Sedang Dipinjam</span>
                  <span className="summary-value">{activeLoans.length} buku</span>
                </div>
              </div>
              <div className="sidebar-summary-item">
                <span className="sidebar-summary-icon summary-green"><Bookmark size={16} /></span>
                <div className="sidebar-summary-info">
                  <span className="summary-label">Koleksi Tersimpan</span>
                  <span className="summary-value">{bookmarks.length} buku</span>
                </div>
              </div>
              <div className="sidebar-summary-item">
                <span className="sidebar-summary-icon summary-yellow"><Clock size={16} /></span>
                <div className="sidebar-summary-info">
                  <span className="summary-label">Antrean Aktif</span>
                  <span className="summary-value">{reservations.length} buku</span>
                </div>
              </div>
            </div>

            {/* Bottom mini avatar 'N' / logo */}
            <div className="sidebar-footer">
              <div className="mini-avatar">N</div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="dashboard-main">
            <div className="dashboard-welcome-header">
              <div>
                <h1>Selamat Datang, {user.name}! 👋</h1>
                <p className="welcome-subtitle">Kelola peminjaman, temukan koleksi, dan tingkatkan pengetahuanmu.</p>
              </div>
              <div className="dashboard-calendar-card">
                <div className="calendar-icon-wrapper">
                  <Calendar size={20} />
                </div>
                <div className="calendar-content">
                  <div className="calendar-date">{formatIndonesianDate(currentTime)}</div>
                  <div className="calendar-time">{formatIndonesianTime(currentTime)}</div>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="user-stats-row">
              <Link href="/circulation" className="user-stat-card card-blue">
                <div className="stat-card-icon-container">
                  <BookOpen size={20} />
                </div>
                <div className="stat-card-info">
                  <span className="stat-card-label">Sedang Dipinjam</span>
                  <span className="stat-card-value">{activeLoans.length} <span className="stat-unit">buku</span></span>
                  <span className="stat-card-action">Lihat detail <ChevronRight size={14} /></span>
                </div>
              </Link>

              <button onClick={() => setShowBookmarksModal(true)} className="user-stat-card card-green">
                <div className="stat-card-icon-container">
                  <Bookmark size={20} />
                </div>
                <div className="stat-card-info">
                  <span className="stat-card-label">Koleksi Tersimpan</span>
                  <span className="stat-card-value">{bookmarks.length} <span className="stat-unit">buku</span></span>
                  <span className="stat-card-action">Lihat koleksi <ChevronRight size={14} /></span>
                </div>
              </button>

              <a href="#antrean-buku-section" className="user-stat-card card-yellow">
                <div className="stat-card-icon-container">
                  <Clock size={20} />
                </div>
                <div className="stat-card-info">
                  <span className="stat-card-label">Antrean Aktif</span>
                  <span className="stat-card-value">{reservations.length} <span className="stat-unit">buku</span></span>
                  <span className="stat-card-action">Lihat antrean <ChevronRight size={14} /></span>
                </div>
              </a>

              <Link href="/circulation" className="user-stat-card card-purple">
                <div className="stat-card-icon-container">
                  <RefreshCw size={20} />
                </div>
                <div className="stat-card-info">
                  <span className="stat-card-label">Riwayat Sirkulasi</span>
                  <span className="stat-card-value">{transactions.length} <span className="stat-unit">transaksi</span></span>
                  <span className="stat-card-action">Lihat riwayat <ChevronRight size={14} /></span>
                </div>
              </Link>
            </div>

            {/* Middle Grid */}
            <div className="dashboard-middle-grid">
              {/* Left Column: Peminjaman Aktif */}
              <div className="dashboard-card-panel list-span-2">
                <div className="panel-header">
                  <h3>Peminjaman Aktif</h3>
                  <Link href="/circulation" className="panel-link">Lihat Semua</Link>
                </div>
                <div className="table-wrapper">
                  {activeLoans.length > 0 ? (
                    <table className="user-dashboard-table">
                      <thead>
                        <tr>
                          <th>Buku</th>
                          <th>Tgl Pinjam</th>
                          <th>Tgl Kembali</th>
                          <th>Sisa Waktu</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeLoans.slice(0, 3).map((loan: any) => {
                          const rem = getRemainingTime(loan.dueDate);
                          let statusBadgeClass = "badge-blue";
                          let statusText = "Dipinjam";
                          if (loan.status === "overdue" || rem.isOverdue) {
                            statusBadgeClass = "badge-danger";
                            statusText = "Terlambat";
                          } else if (rem.daysLeft !== undefined && rem.daysLeft <= 3) {
                            statusBadgeClass = "badge-warning";
                            statusText = "Jatuh Tempo";
                          }
                          
                          return (
                            <tr key={loan.id}>
                              <td>
                                <div className="book-cell">
                                  {renderCover(loan.bookCover, loan.bookTitle)}
                                  <div className="book-meta">
                                    <div className="book-title">{loan.bookTitle}</div>
                                    <div className="book-author">{loan.bookAuthor || "Unknown Author"}</div>
                                  </div>
                                </div>
                              </td>
                              <td>{new Date(loan.borrowDate).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                              <td>{new Date(loan.dueDate).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                              <td>
                                <span className={`rem-time-text ${rem.isOverdue ? "text-danger" : rem.daysLeft !== undefined && rem.daysLeft <= 3 ? "text-warning" : "text-success"}`}>
                                  {rem.text}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${statusBadgeClass}`}>{statusText}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="empty-panel-state">
                      <BookOpen size={36} />
                      <p>Tidak ada peminjaman aktif saat ini.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Antrean Buku */}
              <div id="antrean-buku-section" className="dashboard-card-panel">
                <div className="panel-header">
                  <h3>Antrean Buku</h3>
                  <Link href="/circulation" className="panel-link">Lihat Semua</Link>
                </div>
                <div className="table-wrapper">
                  {reservations.length > 0 ? (
                    <table className="user-dashboard-table">
                      <thead>
                        <tr>
                          <th>Buku</th>
                          <th>Tgl Antre</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations.slice(0, 3).map((rsv: any) => (
                          <tr key={rsv.id}>
                            <td>
                              <div className="book-cell">
                                {renderCover(rsv.book?.cover || "📘", rsv.book?.title || "Buku")}
                                <div className="book-meta">
                                  <div className="book-title">{rsv.book?.title}</div>
                                  <div className="book-author">{rsv.book?.author || "Unknown Author"}</div>
                                </div>
                              </div>
                            </td>
                            <td>{new Date(rsv.createdAt).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                            <td>
                              <span className={`badge ${rsv.status === 'pending' ? 'badge-warning' : 'badge-success'}`}>
                                {rsv.status === 'pending' ? 'Menunggu' : rsv.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="empty-panel-state">
                      <Clock size={36} />
                      <p>Belum ada antrean buku saat ini.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Grid */}
            <div className="dashboard-bottom-grid">
              {/* Left Column: Rekomendasi Untukmu */}
              <div className="dashboard-card-panel list-span-2">
                <div className="panel-header">
                  <h3>Rekomendasi Untukmu</h3>
                  <Link href="/search" className="panel-link">Lihat Semua</Link>
                </div>
                <div className="recommendations-row">
                  {recommendations.slice(0, 4).map((book: any) => (
                    <div key={book.id} className="recommendation-card">
                      <div className="rec-cover-wrapper">
                        {renderCover(book.cover, book.title)}
                      </div>
                      <div className="rec-info">
                        <div className="rec-title">{book.title}</div>
                        <div className="rec-author">{book.author}</div>
                      </div>
                      <Link href={`/search?q=${encodeURIComponent(book.title)}`} className="rec-action-btn">
                        Lihat Detail
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Aktivitas Terbaru */}
              <div className="dashboard-card-panel">
                <div className="panel-header">
                  <h3>Aktivitas Terbaru</h3>
                  <Link href="/circulation" className="panel-link">Lihat Semua</Link>
                </div>
                <div className="activity-timeline">
                  {displayActivities.length > 0 ? (
                    displayActivities.map((act: any, idx: number) => {
                      let iconColorClass = "summary-blue";
                      let actIcon = <BookOpen size={16} />;
                      if (act.type === "return") {
                        iconColorClass = "summary-green";
                        actIcon = <RefreshCw size={16} />;
                      } else if (act.type === "bookmark") {
                        iconColorClass = "summary-green";
                        actIcon = <Bookmark size={16} />;
                      } else if (act.type === "reservation") {
                        iconColorClass = "summary-purple";
                        actIcon = <Clock size={16} />;
                      }
                      
                      return (
                        <div key={idx} className="timeline-item">
                          <span className={`timeline-icon ${iconColorClass}`}>
                            {actIcon}
                          </span>
                          <div className="timeline-content">
                            <div className="timeline-title">{act.title}</div>
                            <div className="timeline-time">{formatDateWIB(act.date)}</div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="empty-panel-state">
                      <History size={36} />
                      <p>Belum ada aktivitas sirkulasi.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Floating Action Button */}
            <div className="floating-chat-btn">
              <Bot size={24} />
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
    </>
  );
}

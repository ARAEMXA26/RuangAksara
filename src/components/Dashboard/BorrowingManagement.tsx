import React, { useState, useEffect, useCallback } from "react";
import { Search, Filter, RefreshCw, X, ChevronLeft, ChevronRight, User } from "lucide-react";

interface BorrowingData {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  bookCategory: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: string;
  daysLate: number;
  fineAmount: number;
}

export default function BorrowingManagement() {
  const [borrowings, setBorrowings] = useState<BorrowingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [tab, setTab] = useState<"active" | "history">("active");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchBorrowings = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      params.set("tab", tab);
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/dashboard/sirkulasi?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBorrowings(data.transactions || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch borrowings data:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, statusFilter, tab]);

  useEffect(() => {
    fetchBorrowings();
  }, [fetchBorrowings]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleTabChange = (newTab: "active" | "history") => {
    setTab(newTab);
    setStatusFilter("");
    setPage(1);
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Intl.DateTimeFormat("id-ID", options).format(date) + " WIB";
    } catch {
      return dateStr;
    }
  };

  const roleColor = (role: string) => {
    switch (role) {
      case "pustakawan": return "badge-primary";
      case "dosen": return "badge-warning";
      case "mahasiswa": return "badge-success";
      default: return "badge-primary";
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "overdue":
        return (
          <span className="badge badge-danger" style={{ fontSize: "0.75rem" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", display: "inline-block", marginRight: 4 }}></span>
            Terlambat
          </span>
        );
      case "dueToday":
        return (
          <span className="badge badge-warning" style={{ fontSize: "0.75rem" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", display: "inline-block", marginRight: 4 }}></span>
            Jatuh Tempo Hari Ini
          </span>
        );
      case "returned":
        return (
          <span className="badge badge-success" style={{ fontSize: "0.75rem" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", marginRight: 4 }}></span>
            Dikembalikan
          </span>
        );
      case "active":
      default:
        return (
          <span className="badge" style={{ fontSize: "0.75rem", background: "rgba(59, 130, 246, 0.1)", color: "#2563eb" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", display: "inline-block", marginRight: 4 }}></span>
            Aktif
          </span>
        );
    }
  };

  const totalPages = Math.ceil(total / limit);
  const startIndex = total === 0 ? 0 : (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);

  return (
    <div className="user-mgmt" style={{ marginTop: 24 }}>
      {/* Header */}
      <div className="user-mgmt-header">
        <div>
          <h3 className="user-mgmt-title">Manajemen Peminjaman Buku</h3>
          <p className="user-mgmt-subtitle">Kelola dan pantau aktivitas sirkulasi buku perpustakaan</p>
        </div>
        <div className="user-mgmt-actions">
          {/* Segarkan Button */}
          <button className="btn btn-sm btn-outline" onClick={() => fetchBorrowings(false)} title="Segarkan Data" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <RefreshCw size={14} /> Segarkan
          </button>
          
          {/* Search Box */}
          <div className="user-search-box">
            <Search size={16} className="user-search-icon" />
            <input
              type="text"
              placeholder="Cari buku atau nama..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="user-search-input"
            />
            {searchInput && (
              <button onClick={() => setSearchInput("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", padding: 2 }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Dropdown */}
          {tab === "active" && (
            <div style={{ position: "relative" }}>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setShowFilter(!showFilter)}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <Filter size={14} /> Filter
              </button>
              {showFilter && (
                <div className="user-filter-dropdown">
                  <button
                    className={`user-filter-option ${statusFilter === "" ? "active" : ""}`}
                    onClick={() => { setStatusFilter(""); setShowFilter(false); setPage(1); }}
                  >
                    Semua Status
                  </button>
                  <button
                    className={`user-filter-option ${statusFilter === "normal" ? "active" : ""}`}
                    onClick={() => { setStatusFilter("normal"); setShowFilter(false); setPage(1); }}
                  >
                    Status Aktif
                  </button>
                  <button
                    className={`user-filter-option ${statusFilter === "dueToday" ? "active" : ""}`}
                    onClick={() => { setStatusFilter("dueToday"); setShowFilter(false); setPage(1); }}
                  >
                    Jatuh Tempo Hari Ini
                  </button>
                  <button
                    className={`user-filter-option ${statusFilter === "overdue" ? "active" : ""}`}
                    onClick={() => { setStatusFilter("overdue"); setShowFilter(false); setPage(1); }}
                  >
                    Terlambat
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 16, borderBottom: "1px solid var(--gray-100)", marginBottom: 20 }}>
        <button
          onClick={() => handleTabChange("active")}
          style={{
            padding: "10px 16px",
            background: "none",
            border: "none",
            borderBottom: tab === "active" ? "2px solid var(--black)" : "2px solid transparent",
            color: tab === "active" ? "var(--black)" : "var(--gray-500)",
            fontWeight: tab === "active" ? "600" : "500",
            cursor: "pointer",
            fontSize: "0.9rem",
            transition: "all var(--transition-fast)"
          }}
        >
          Peminjaman Aktif
        </button>
        <button
          onClick={() => handleTabChange("history")}
          style={{
            padding: "10px 16px",
            background: "none",
            border: "none",
            borderBottom: tab === "history" ? "2px solid var(--black)" : "2px solid transparent",
            color: tab === "history" ? "var(--black)" : "var(--gray-500)",
            fontWeight: tab === "history" ? "600" : "500",
            cursor: "pointer",
            fontSize: "0.9rem",
            transition: "all var(--transition-fast)"
          }}
        >
          Riwayat Pengembalian
        </button>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Buku</th>
              <th>Peminjam</th>
              <th>Waktu Pinjam</th>
              <th>{tab === "active" ? "Batas Pengembalian" : "Waktu Kembali"}</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Denda</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "40px" }}>
                  <span className="loading-dots"><span></span><span></span><span></span></span>
                </td>
              </tr>
            ) : borrowings.length > 0 ? (
              borrowings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 36,
                          height: 48,
                          borderRadius: "var(--radius-sm)",
                          background: "linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.2rem",
                          border: "1px solid var(--gray-200)",
                          flexShrink: 0
                        }}
                      >
                        {b.bookCover || "📘"}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: "var(--black)", fontSize: "0.92rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={b.bookTitle}>
                          {b.bookTitle}
                        </div>
                        <div style={{ fontSize: "0.80rem", color: "var(--gray-450)", marginTop: 2 }}>
                          {b.bookAuthor} • <span style={{ color: "var(--gray-400)" }}>{b.bookCategory}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="user-avatar-sm">
                        <User size={16} />
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 600, fontSize: "0.92rem" }}>{b.userName}</span>
                          <span className={`badge ${roleColor(b.userRole)}`} style={{ fontSize: "0.68rem", padding: "2px 6px" }}>
                            {b.userRole === "pustakawan" ? "Pustakawan" : b.userRole === "dosen" ? "Dosen" : "Mahasiswa"}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--gray-400)" }}>{b.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: "0.85rem", color: "var(--gray-700)", lineHeight: 1.5 }} suppressHydrationWarning>
                      {formatDateTime(b.borrowDate)}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: "0.85rem", color: "var(--gray-700)", lineHeight: 1.5 }} suppressHydrationWarning>
                      {tab === "active" ? formatDateTime(b.dueDate) : formatDateTime(b.returnDate)}
                    </div>
                  </td>
                  <td>
                    {statusBadge(b.status)}
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 600, fontSize: "0.85rem", color: b.fineAmount > 0 ? "#ef4444" : "var(--gray-500)" }}>
                    {b.fineAmount > 0 ? `Rp ${b.fineAmount.toLocaleString("id-ID")}` : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "var(--gray-400)" }}>
                  Tidak ada data peminjaman ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="user-pagination">
        <span className="user-pagination-info">
          Menampilkan {startIndex} - {endIndex} dari {total} peminjaman
        </span>
        <div className="user-pagination-controls">
          <button
            className="user-page-btn"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`user-page-btn ${p === page ? "active" : ""}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="user-page-btn"
            disabled={page >= totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight size={16} />
          </button>
          <span style={{ fontSize: "0.82rem", color: "var(--gray-500)", marginLeft: 12 }}>Rows per page:</span>
          <select
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            className="user-page-select"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
      </div>
    </div>
  );
}

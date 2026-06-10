"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, Filter, Plus, Eye, Pencil, Trash2,
  ChevronLeft, ChevronRight, X, User
} from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  transactionCount: number;
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  // Edit modal
  const [editUser, setEditUser] = useState<UserData | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");

  // Delete confirmation
  const [deleteUser, setDeleteUser] = useState<UserData | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (search) params.set("search", search);
      if (filterRole) params.set("role", filterRole);

      const res = await fetch(`/api/dashboard/users?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, filterRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounced search
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleEdit = async () => {
    if (!editUser) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/dashboard/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editUser.id, name: editName, role: editRole }),
      });
      if (res.ok) {
        setEditUser(null);
        fetchUsers();
      }
    } catch (err) {
      console.error("Failed to update user:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/dashboard/users?id=${deleteUser.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteUser(null);
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus user");
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
    } finally {
      setActionLoading(false);
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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) + "\n" + d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);

  return (
    <div className="user-mgmt">
      {/* Header */}
      <div className="user-mgmt-header">
        <div>
          <h3 className="user-mgmt-title">Manajemen User</h3>
          <p className="user-mgmt-subtitle">Kelola semua akun user sistem</p>
        </div>
        <div className="user-mgmt-actions">
          <div className="user-search-box">
            <Search size={16} className="user-search-icon" />
            <input
              type="text"
              placeholder="Cari user..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="user-search-input"
            />
          </div>
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
                  className={`user-filter-option ${filterRole === "" ? "active" : ""}`}
                  onClick={() => { setFilterRole(""); setShowFilter(false); setPage(1); }}
                >
                  Semua
                </button>
                <button
                  className={`user-filter-option ${filterRole === "pustakawan" ? "active" : ""}`}
                  onClick={() => { setFilterRole("pustakawan"); setShowFilter(false); setPage(1); }}
                >
                  Pustakawan
                </button>
                <button
                  className={`user-filter-option ${filterRole === "dosen" ? "active" : ""}`}
                  onClick={() => { setFilterRole("dosen"); setShowFilter(false); setPage(1); }}
                >
                  Dosen
                </button>
                <button
                  className={`user-filter-option ${filterRole === "mahasiswa" ? "active" : ""}`}
                  onClick={() => { setFilterRole("mahasiswa"); setShowFilter(false); setPage(1); }}
                >
                  Mahasiswa
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Terdaftar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "40px" }}>
                  <span className="loading-dots"><span></span><span></span><span></span></span>
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="user-avatar-sm">
                        <User size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>{u.name}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--gray-400)" }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: "var(--gray-500)", fontSize: "0.88rem" }}>{u.email}</td>
                  <td>
                    <span className={`badge ${roleColor(u.role)}`} style={{ textTransform: "capitalize" }}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-success" style={{ fontSize: "0.75rem" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", marginRight: 4 }}></span>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: "0.85rem", lineHeight: 1.5, whiteSpace: "pre-line" }}>
                      {formatDate(u.createdAt)}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="user-action-btn"
                        title="Edit"
                        onClick={() => {
                          setEditUser(u);
                          setEditName(u.name);
                          setEditRole(u.role);
                        }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="user-action-btn user-action-danger"
                        title="Hapus"
                        onClick={() => setDeleteUser(u)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "var(--gray-400)" }}>
                  Tidak ada user ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="user-pagination">
        <span className="user-pagination-info">
          Menampilkan {startIndex} - {endIndex} dari {total} user
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
            disabled={page >= totalPages}
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

      {/* Edit Modal */}
      {editUser && (
        <div className="modal-overlay" onClick={() => setEditUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit User</h3>
              <button className="modal-close" onClick={() => setEditUser(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <label className="input-label">Nama</label>
                <input
                  className="input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div className="input-group" style={{ marginTop: 16 }}>
                <label className="input-label">Role</label>
                <select
                  className="input"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                >
                  <option value="mahasiswa">Mahasiswa</option>
                  <option value="dosen">Dosen</option>
                  <option value="pustakawan">Pustakawan</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-sm btn-outline" onClick={() => setEditUser(null)}>
                Batal
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={handleEdit}
                disabled={actionLoading}
              >
                {actionLoading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteUser && (
        <div className="modal-overlay" onClick={() => setDeleteUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Hapus User</h3>
              <button className="modal-close" onClick={() => setDeleteUser(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: "var(--gray-600)", lineHeight: 1.6 }}>
                Apakah Anda yakin ingin menghapus user <strong>{deleteUser.name}</strong>?
                Semua data terkait user ini akan dihapus secara permanen.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-sm btn-outline" onClick={() => setDeleteUser(null)}>
                Batal
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={handleDelete}
                disabled={actionLoading}
              >
                {actionLoading ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

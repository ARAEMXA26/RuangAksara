"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AnimatedSection from "@/components/AnimatedSection";
import { useAuth } from "@/contexts/AuthContext";
import {
  BookOpen, ClipboardList, Coins, Book, AlertTriangle,
  CheckCircle2, ArrowUpFromLine, XCircle, CreditCard,
  PartyPopper, BarChart
} from "lucide-react";

export default function CirculationPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [toast, setToast] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [fines, setFines] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Fetch data from API
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setDataLoading(true);
      try {
        const isPustakawan = user.role === "pustakawan";
        const userParam = isPustakawan ? "" : `?userId=${user.id}`;

        const [txRes, fineRes] = await Promise.all([
          fetch(`/api/circulation/transaction${userParam}`),
          fetch(`/api/circulation/fines${userParam}`),
        ]);

        if (txRes.ok) {
          const txData = await txRes.json();
          setTransactions(txData.transactions || []);
        }
        if (fineRes.ok) {
          const fineData = await fineRes.json();
          setFines(fineData.fines || []);
        }
      } catch (error) {
        console.error("Failed to fetch circulation data:", error);
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

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (!user) return null;

  const activeLoans = transactions.filter(
    (t) => t.status === "active" || t.status === "overdue"
  );
  const history = transactions.filter((t) => t.status === "returned");

  const calculateDaysLate = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.floor((today - due) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const handleReturn = async (transaction) => {
    try {
      const res = await fetch("/api/circulation/transaction", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: transaction.id }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast(data.message, data.fineAmount > 0 ? "info" : "success");
        // Refresh data
        setTransactions((prev) =>
          prev.map((t) =>
            t.id === transaction.id
              ? { ...t, status: "returned", returnDate: new Date().toISOString().split("T")[0] }
              : t
          )
        );
        if (data.fineAmount > 0) {
          setFines((prev) => [...prev, {
            id: "new_" + Date.now(),
            transactionId: transaction.id,
            amount: data.fineAmount,
            status: "unpaid",
            bookTitle: transaction.bookTitle,
          }]);
        }
      } else {
        showToast(data.error || "Gagal mengembalikan buku", "error");
      }
    } catch (error) {
      console.error("Return failed:", error);
      showToast("Buku berhasil dikembalikan!", "success");
    }
  };

  const handlePayFine = async (fine) => {
    try {
      const res = await fetch("/api/circulation/fines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fineId: fine.id }),
      });

      if (res.ok) {
        showToast("Pembayaran denda berhasil!", "success");
        setFines((prev) =>
          prev.map((f) => (f.id === fine.id ? { ...f, status: "paid" } : f))
        );
      }
    } catch (error) {
      showToast("Pembayaran denda berhasil!", "success");
    }
  };

  const tabs = [
    { id: "active", label: <><BookOpen size={16} /> Aktif</>, count: activeLoans.length },
    { id: "history", label: <><ClipboardList size={16} /> Riwayat</>, count: history.length },
    { id: "fines", label: <><Coins size={16} /> Denda</>, count: fines.length },
  ];

  return (
    <>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

      <div className="page">
        <div className="page-header">
          <AnimatedSection animation="fade-up">
            <h1 className="page-header-title" style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center" }}><BookOpen size={32} /> Sirkulasi & Denda</h1>
            <p className="page-header-subtitle">
              Kelola peminjaman, pengembalian, dan denda buku perpustakaan
            </p>
          </AnimatedSection>
        </div>

        <div className="page-content">
          {/* Tabs */}
          <AnimatedSection animation="fade-up" delay={0.1}>
            <div className="tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab ${activeTab === tab.id ? "tab-active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Active Loans Tab */}
          {activeTab === "active" && (
            <AnimatedSection animation="fade-up" delay={0.2}>
              {activeLoans.length > 0 ? (
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Buku</th>
                        <th>Tgl Pinjam</th>
                        <th>Jatuh Tempo</th>
                        <th>Status</th>
                        <th>Denda</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeLoans.map((loan) => {
                        const daysLate = calculateDaysLate(loan.dueDate || loan.due_date);
                        const fine = daysLate * 1000;
                        return (
                          <tr key={loan.id}>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <span style={{ fontSize: "1.5rem" }}>
                                  <Book size={32} className="text-primary" />
                                </span>
                                <div>
                                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                                    {loan.bookTitle || "Buku"}
                                  </div>
                                  <div style={{ fontSize: "0.78rem", color: "var(--gray-400)" }}>
                                    {loan.id.substring(0, 12).toUpperCase()}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>{new Date(loan.borrowDate || loan.borrow_date).toLocaleDateString("id-ID")}</td>
                            <td>{new Date(loan.dueDate || loan.due_date).toLocaleDateString("id-ID")}</td>
                            <td>
                              <span
                                className={`badge ${loan.status === "overdue" ? "badge-danger" : "badge-success"}`}
                                style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                              >
                                {loan.status === "overdue" ? (
                                  <><AlertTriangle size={14} /> Terlambat {daysLate} hari</>
                                ) : (
                                  <><CheckCircle2 size={14} /> Aktif</>
                                )}
                              </span>
                            </td>
                            <td>
                              {fine > 0 ? (
                                <span style={{ color: "var(--danger)", fontWeight: 600 }}>
                                  Rp {fine.toLocaleString("id-ID")}
                                </span>
                              ) : (
                                <span style={{ color: "var(--gray-400)" }}>-</span>
                              )}
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleReturn(loan)}
                                style={{ display: "flex", alignItems: "center", gap: "6px" }}
                              >
                                <ArrowUpFromLine size={14} /> Kembalikan
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon"><Book size={48} className="text-gray-400" /></div>
                  <div className="empty-state-title">Tidak ada peminjaman aktif</div>
                  <div className="empty-state-desc">
                    Kunjungi halaman Pencarian untuk menemukan dan meminjam buku
                  </div>
                </div>
              )}
            </AnimatedSection>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <AnimatedSection animation="fade-up" delay={0.2}>
              {history.length > 0 ? (
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Buku</th>
                        <th>Tgl Pinjam</th>
                        <th>Tgl Kembali</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((loan) => (
                        <tr key={loan.id}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span style={{ fontSize: "1.5rem" }}>
                                <Book size={32} className="text-primary" />
                              </span>
                              <span style={{ fontWeight: 600 }}>
                                {loan.bookTitle || "Buku"}
                              </span>
                            </div>
                          </td>
                          <td>{new Date(loan.borrowDate || loan.borrow_date).toLocaleDateString("id-ID")}</td>
                          <td>
                            {(loan.returnDate || loan.return_date)
                              ? new Date(loan.returnDate || loan.return_date).toLocaleDateString("id-ID")
                              : "-"}
                          </td>
                          <td>
                            <span className="badge badge-success" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><CheckCircle2 size={14} /> Dikembalikan</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon"><ClipboardList size={48} className="text-gray-400" /></div>
                  <div className="empty-state-title">Belum ada riwayat</div>
                  <div className="empty-state-desc">
                    Riwayat peminjaman yang sudah dikembalikan akan muncul di sini
                  </div>
                </div>
              )}
            </AnimatedSection>
          )}

          {/* Fines Tab */}
          {activeTab === "fines" && (
            <AnimatedSection animation="fade-up" delay={0.2}>
              {fines.length > 0 ? (
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Buku / Transaksi</th>
                        <th>Jumlah Denda</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fines.map((fine) => (
                        <tr key={fine.id}>
                          <td style={{ fontWeight: 600 }}>{fine.bookTitle || fine.transactionId?.substring(0, 12).toUpperCase()}</td>
                          <td>
                            <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--danger)" }}>
                              Rp {fine.amount.toLocaleString("id-ID")}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge ${fine.status === "unpaid" ? "badge-danger" : "badge-success"}`}
                              style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                            >
                              {fine.status === "unpaid" ? <><XCircle size={14} /> Belum Bayar</> : <><CheckCircle2 size={14} /> Lunas</>}
                            </span>
                          </td>
                          <td>
                            {fine.status === "unpaid" && (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handlePayFine(fine)}
                                style={{ display: "flex", alignItems: "center", gap: "6px" }}
                              >
                                <CreditCard size={14} /> Bayar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon"><PartyPopper size={48} className="text-gray-400" /></div>
                  <div className="empty-state-title">Tidak ada denda!</div>
                  <div className="empty-state-desc">
                    Anda tidak memiliki denda keterlambatan
                  </div>
                </div>
              )}
            </AnimatedSection>
          )}

          {/* Info Section */}
          <AnimatedSection animation="fade-up" delay={0.3}>
            <div
              className="glass-card"
              style={{ marginTop: "40px", display: "flex", gap: "24px", flexWrap: "wrap" }}
            >
              <div style={{ flex: "1 1 200px" }}>
                <h4 style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}><ClipboardList size={18} /> Aturan Peminjaman</h4>
                <ul style={{ fontSize: "0.88rem", color: "var(--gray-600)", lineHeight: "1.8", paddingLeft: "16px" }}>
                  <li>Durasi pinjam standar: <strong>14 hari</strong></li>
                  <li>Perpanjangan: <strong>1x selama 7 hari</strong></li>
                  <li>Denda keterlambatan: <strong>Rp 1.000/hari</strong></li>
                  <li>Denda maksimal: <strong>Rp 50.000/buku</strong></li>
                </ul>
              </div>
              <div style={{ flex: "1 1 200px" }}>
                <h4 style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}><BarChart size={18} /> Limit Peminjaman</h4>
                <ul style={{ fontSize: "0.88rem", color: "var(--gray-600)", lineHeight: "1.8", paddingLeft: "16px" }}>
                  <li>Mahasiswa: <strong>3 buku</strong></li>
                  <li>Dosen: <strong>5 buku</strong></li>
                  <li>Pustakawan: <strong>10 buku</strong></li>
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </>
  );
}

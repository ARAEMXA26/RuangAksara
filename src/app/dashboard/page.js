"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatsCard from "@/components/StatsCard";
import AnimatedSection from "@/components/AnimatedSection";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Search, BookOpen, Bot, Brain,
  AlertTriangle, Coins, Library, User
} from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [fines, setFines] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

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
        const [txRes, fineRes] = await Promise.all([
          fetch(`/api/circulation/transaction?userId=${user.id}`),
          fetch(`/api/circulation/fines?userId=${user.id}`),
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

  const activeLoans = transactions.filter((t) => t.status === "active" || t.status === "overdue");
  const overdueCount = transactions.filter((t) => t.status === "overdue").length;
  const totalFines = fines
    .filter((f) => f.status === "unpaid")
    .reduce((sum, f) => sum + f.amount, 0);

  const quickActions = [
    { icon: <Search size={24} />, title: "Pencarian Semantik", desc: "Cari buku dengan AI", href: "/search" },
    { icon: <BookOpen size={24} />, title: "Sirkulasi", desc: "Pinjam & kembalikan", href: "/circulation" },
  ];

  if (user.role === "pustakawan") {
    quickActions.push({
      icon: <Brain size={24} />,
      title: "Knowledge Base",
      desc: "Kelola pengetahuan",
      href: "/knowledge",
    });
  }

  return (
    <>
      <div className="page">
        <div className="dashboard-layout">
          {/* Sidebar */}
          <aside className="sidebar">
            <div style={{ marginBottom: "24px", textAlign: "center" }}>
              <div
                className="navbar-avatar"
                style={{ width: "64px", height: "64px", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <User size={32} />
              </div>
              <h4 style={{ fontSize: "1rem", marginBottom: "2px" }}>{user.name}</h4>
              <span className="badge badge-primary" style={{ textTransform: "capitalize" }}>
                {user.role}
              </span>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-label">Menu Utama</div>
              <Link href="/dashboard" className="sidebar-link sidebar-link-active">
                <span className="sidebar-icon"><LayoutDashboard size={18} /></span>
                Dashboard
              </Link>
              <Link href="/search" className="sidebar-link">
                <span className="sidebar-icon"><Search size={18} /></span>
                Pencarian
              </Link>
              <Link href="/circulation" className="sidebar-link">
                <span className="sidebar-icon"><BookOpen size={18} /></span>
                Sirkulasi
              </Link>
            </div>

            {user.role === "pustakawan" && (
              <div className="sidebar-section">
                <div className="sidebar-label">Admin</div>
                <Link href="/dashboard/admin/books" className="sidebar-link">
                  <span className="sidebar-icon"><Library size={18} /></span>
                  Kelola Buku
                </Link>
                <Link href="/knowledge" className="sidebar-link">
                  <span className="sidebar-icon"><Brain size={18} /></span>
                  Knowledge Base
                </Link>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <main className="dashboard-main">
            <AnimatedSection animation="fade-up" className="dashboard-welcome">
              <h1>Selamat Datang, {user.name?.split(" ")[0]}!</h1>
              <p>Berikut ringkasan aktivitas perpustakaan Anda</p>
            </AnimatedSection>

            {/* Stats Grid */}
            <div className="stats-grid">
              <StatsCard
                icon={<BookOpen size={24} />}
                label="Peminjaman Aktif"
                value={String(activeLoans.length)}
                color="blue"
                delay={0}
              />
              <StatsCard
                icon={<AlertTriangle size={24} />}
                label="Terlambat"
                value={String(overdueCount)}
                color={overdueCount > 0 ? "red" : "green"}
                delay={0.1}
              />
              <StatsCard
                icon={<Coins size={24} />}
                label="Denda Belum Bayar"
                value={`Rp ${totalFines.toLocaleString("id-ID")}`}
                color={totalFines > 0 ? "orange" : "green"}
                delay={0.2}
              />
              <StatsCard
                icon={<Library size={24} />}
                label="Limit Pinjam"
                value={`${activeLoans.length}/${user.borrowLimit || user.borrow_limit || 3}`}
                color="purple"
                delay={0.3}
              />
            </div>

            {/* Quick Actions */}
            <AnimatedSection animation="fade-up" delay={0.2}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "16px" }}>⚡ Aksi Cepat</h3>
              <div className="quick-actions-grid">
                {quickActions.map((action, i) => (
                  <Link key={i} href={action.href} className="quick-action-card">
                    <div className="quick-action-icon">{action.icon}</div>
                    <div className="quick-action-title">{action.title}</div>
                    <div className="quick-action-desc">{action.desc}</div>
                  </Link>
                ))}
              </div>
            </AnimatedSection>

            {/* Active Loans Summary */}
            {activeLoans.length > 0 && (
              <AnimatedSection animation="fade-up" delay={0.3}>
                <h3 style={{ fontSize: "1.2rem", marginTop: "32px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <BookOpen size={20} className="text-primary" /> Peminjaman Aktif
                </h3>
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Buku</th>
                        <th>Tanggal Pinjam</th>
                        <th>Jatuh Tempo</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeLoans.map((loan) => (
                        <tr key={loan.id}>
                          <td style={{ fontWeight: 600 }}>{loan.bookTitle || loan.id.toUpperCase()}</td>
                          <td>{new Date(loan.borrowDate || loan.borrow_date).toLocaleDateString("id-ID")}</td>
                          <td>{new Date(loan.dueDate || loan.due_date).toLocaleDateString("id-ID")}</td>
                          <td>
                            <span
                              className={`badge ${loan.status === "overdue" ? "badge-danger" : "badge-success"}`}
                              style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                            >
                              {loan.status === "overdue" ? (
                                <><AlertTriangle size={14} /> Terlambat</>
                              ) : (
                                "Aktif"
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AnimatedSection>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

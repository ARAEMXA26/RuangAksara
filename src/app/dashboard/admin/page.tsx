"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatsCard from "@/components/StatsCard";
import AnimatedSection from "@/components/AnimatedSection";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Search, BookOpen, Bot, Brain,
  AlertTriangle, Coins, Library, User, Clock, Users, Settings
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalBooks: 0, overdueCount: 0 });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "pustakawan")) {
      router.push("/dashboard"); // Redirect non-admins to user dashboard
    }
  }, [user, authLoading, router]);

  // Fetch admin data
  useEffect(() => {
    if (!user || user.role !== "pustakawan") return;

    const fetchData = async () => {
      setDataLoading(true);
      try {
        const res = await fetch(`/api/reservations`);
        if (res.ok) {
          const data = await res.json();
          setReservations(data.reservations || []);
        }

        const resStats = await fetch(`/api/stats`);
        if (resStats.ok) {
          const statsData = await resStats.json();
          setStats({
            totalUsers: statsData.totalUsers || 0,
            totalBooks: statsData.totalBooks || 0,
            overdueCount: statsData.overdueCount || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleApproveReservation = async (id: string) => {
    try {
      const res = await fetch('/api/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'approved' })
      });
      
      if (res.ok) {
        setReservations(prev => 
          prev.map(r => r.id === id ? { ...r, status: 'approved' } : r)
        );
      }
    } catch (error) {
      console.error("Error approving reservation", error);
    }
  };

  if (authLoading || dataLoading) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <span className="loading-dots"><span></span><span></span><span></span></span>
      </div>
    );
  }

  if (!user || user.role !== "pustakawan") return null;

  const pendingReservations = reservations.filter(r => r.status === 'pending');

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

          {/* Main Content */}
          <main className="dashboard-main">
            <AnimatedSection animation="fade-up" className="dashboard-welcome">
              <h1>Admin Panel</h1>
              <p>Kelola sistem perpustakaan RuangAksara dari sini.</p>
            </AnimatedSection>

            {/* Stats Grid */}
            <div className="stats-grid">
              <StatsCard
                icon={<Users size={24} />}
                label="Total Pengguna"
                value={String(stats.totalUsers)}
                color="blue"
                delay={0}
              />
              <StatsCard
                icon={<Library size={24} />}
                label="Total Koleksi"
                value={String(stats.totalBooks)}
                color="purple"
                delay={0.1}
              />
              <StatsCard
                icon={<Clock size={24} />}
                label="Antrean Pending"
                value={String(pendingReservations.length)}
                color="orange"
                delay={0.2}
              />
              <StatsCard
                icon={<AlertTriangle size={24} />}
                label="Peminjaman Terlambat"
                value={String(stats.overdueCount)}
                color="red"
                delay={0.3}
              />
            </div>

            {/* Pending Reservations List */}
            <AnimatedSection animation="fade-up" delay={0.3}>
              <h3 style={{ fontSize: "1.2rem", marginTop: "32px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Clock size={20} className="text-warning" /> Persetujuan Antrean (Reservations)
              </h3>
              <div className="table-wrapper">
                {pendingReservations.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Pengguna</th>
                        <th>Buku yang Diantre</th>
                        <th>Tanggal Request</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingReservations.map((rsv) => (
                        <tr key={rsv.id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{rsv.user?.name || "Unknown"}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>{rsv.user?.email}</div>
                          </td>
                          <td style={{ fontWeight: 600 }}>{rsv.book?.title || "Unknown Book"}</td>
                          <td>{new Date(rsv.createdAt).toLocaleDateString("id-ID")}</td>
                          <td>
                            <button 
                              onClick={() => handleApproveReservation(rsv.id)}
                              className="btn btn-sm btn-primary"
                            >
                              Approve (Buku Tersedia)
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ padding: "40px 20px", textAlign: "center", background: "var(--gray-50)", borderRadius: "var(--radius-lg)" }}>
                    <Clock size={48} style={{ color: "var(--gray-300)", margin: "0 auto 16px" }} />
                    <h4 style={{ color: "var(--gray-700)", marginBottom: "8px" }}>Tidak ada antrean pending</h4>
                    <p style={{ color: "var(--gray-500)", fontSize: "0.9rem" }}>Semua request booking sudah disetujui atau diproses.</p>
                  </div>
                )}
              </div>
            </AnimatedSection>

          </main>
        </div>
      </div>
    </>
  );
}

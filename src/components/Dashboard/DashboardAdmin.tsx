"use client";

import { useEffect, useState } from "react";
import {
  Library, BookOpen, CheckCircle, Users, Brain, TrendingUp, TrendingDown, Calendar
} from "lucide-react";
import BorrowChart from "./BorrowChart";
import PopularBooks from "./PopularBooks";
import CategoryChart from "./CategoryChart";
import UserManagement from "./UserManagement";
import BorrowingManagement from "./BorrowingManagement";

interface DashboardStats {
  totalBooks: number;
  totalInventory: number;
  activeBorrows: number;
  completedBorrows: number;
  totalUsers: number;
  totalKnowledge: number;
  overdueCount: number;
  changes: {
    books: number;
    borrows: number;
    completed: number;
    users: number;
    knowledge: number;
  };
}

interface ChartData {
  borrowActivity: { month: string; count: number }[];
  popularBooks: { title: string; author: string; count: number }[];
  categoryDistribution: { name: string; value: number; percentage: number }[];
}

interface DashboardAdminProps {
  userName: string;
}

export default function DashboardAdmin({ userName }: DashboardAdminProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch stats and chart data
  useEffect(() => {
    const fetchData = async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const [statsRes, chartRes] = await Promise.all([
          fetch("/api/dashboard"),
          fetch("/api/dashboard/charts"),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        if (chartRes.ok) {
          const chartData = await chartRes.json();
          setChartData(chartData);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(false);
  }, []);

  const formatDay = (date: Date) => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember",
    ];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  const renderChange = (change: number, suffix: string = "dari bulan lalu") => {
    if (change > 0) {
      return (
        <span className="stat-change stat-change-up">
          <TrendingUp size={12} /> {change} {suffix}
        </span>
      );
    } else if (change < 0) {
      return (
        <span className="stat-change stat-change-down">
          <TrendingDown size={12} /> {Math.abs(change)} {suffix}
        </span>
      );
    }
    return <span className="stat-change">Tidak ada perubahan</span>;
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <span className="loading-dots"><span></span><span></span><span></span></span>
      </div>
    );
  }

  const s = stats || {
    totalBooks: 0, totalInventory: 0, activeBorrows: 0,
    completedBorrows: 0, totalUsers: 0, totalKnowledge: 0, overdueCount: 0,
    changes: { books: 0, borrows: 0, completed: 0, users: 0, knowledge: 0 },
  };

  return (
    <div className="admin-dashboard">
      {/* Welcome Header */}
      <div className="admin-welcome-row">
        <div>
          <h1 className="admin-welcome-title">Selamat Datang, {userName}!</h1>
          <p className="admin-welcome-sub">Ini adalah Ruang Pribadi Anda di RuangAksara.</p>
        </div>
        <div className="admin-live-clock">
          <Calendar size={16} />
          <div>
            <div className="admin-clock-date">{formatDay(currentTime)}</div>
            <div className="admin-clock-time">{formatTime(currentTime)}</div>
          </div>
        </div>
      </div>

      {/* 5 Stat Cards */}
      <div className="admin-stats-row">
        <div className="admin-stat-card" style={{ "--stat-accent": "#1e293b" } as React.CSSProperties}>
          <div className="admin-stat-icon" style={{ background: "rgba(30,41,59,0.08)", color: "#1e293b" }}>
            <Library size={22} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">Total Koleksi</span>
            <span className="admin-stat-value">{s.totalBooks.toLocaleString("id-ID")}</span>
            <span className="admin-stat-unit">Buku</span>
          </div>
          {renderChange(s.changes.books)}
        </div>

        <div className="admin-stat-card" style={{ "--stat-accent": "#1e293b" } as React.CSSProperties}>
          <div className="admin-stat-icon" style={{ background: "rgba(30,41,59,0.08)", color: "#1e293b" }}>
            <BookOpen size={22} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">Peminjaman Aktif</span>
            <span className="admin-stat-value">{s.activeBorrows.toLocaleString("id-ID")}</span>
            <span className="admin-stat-unit">Buku</span>
          </div>
          {renderChange(s.changes.borrows)}
        </div>

        <div className="admin-stat-card" style={{ "--stat-accent": "#1e293b" } as React.CSSProperties}>
          <div className="admin-stat-icon" style={{ background: "rgba(30,41,59,0.08)", color: "#1e293b" }}>
            <CheckCircle size={22} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">Riwayat Selesai</span>
            <span className="admin-stat-value">{s.completedBorrows.toLocaleString("id-ID")}</span>
            <span className="admin-stat-unit">Buku</span>
          </div>
          {renderChange(s.changes.completed)}
        </div>

        <div className="admin-stat-card" style={{ "--stat-accent": "#1e293b" } as React.CSSProperties}>
          <div className="admin-stat-icon" style={{ background: "rgba(30,41,59,0.08)", color: "#1e293b" }}>
            <Users size={22} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">Anggota Aktif</span>
            <span className="admin-stat-value">{s.totalUsers.toLocaleString("id-ID")}</span>
            <span className="admin-stat-unit">Orang</span>
          </div>
          {renderChange(s.changes.users)}
        </div>

        <div className="admin-stat-card" style={{ "--stat-accent": "#1e293b" } as React.CSSProperties}>
          <div className="admin-stat-icon" style={{ background: "rgba(30,41,59,0.08)", color: "#1e293b" }}>
            <Brain size={22} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">Knowledge Artikel</span>
            <span className="admin-stat-value">{s.totalKnowledge.toLocaleString("id-ID")}</span>
            <span className="admin-stat-unit">Artikel</span>
          </div>
          {renderChange(s.changes.knowledge)}
        </div>
      </div>

      {/* Middle Row: Charts */}
      <div className="admin-middle-row">
        <BorrowChart data={chartData?.borrowActivity || []} />
        <PopularBooks data={chartData?.popularBooks || []} />
        <CategoryChart data={chartData?.categoryDistribution || []} />
      </div>

      {/* User Management */}
      <UserManagement />

      {/* Borrowing/Circulation Management */}
      <BorrowingManagement />
    </div>
  );
}

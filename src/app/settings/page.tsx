"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AnimatedSection from "@/components/AnimatedSection";
import { Settings, User, Bell, Shield, Key } from "lucide-react";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <span className="loading-dots"><span></span><span></span><span></span></span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="page" style={{ padding: "100px 24px 40px", maxWidth: "1000px", margin: "0 auto" }}>
      <AnimatedSection animation="fade-down">
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "12px" }}>
            <Settings size={32} className="text-primary" /> Pengaturan Akun
          </h1>
          <p style={{ color: "var(--gray-500)", marginTop: "8px" }}>
            Kelola profil, keamanan, dan preferensi akun Anda di sini.
          </p>
        </div>
      </AnimatedSection>

      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "32px" }}>
        <aside>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button className="btn" style={{ background: "var(--primary)", color: "white", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}>
              <User size={18} /> Profil
            </button>
            <button className="btn btn-outline" style={{ textAlign: "left", display: "flex", alignItems: "center", gap: "8px", border: "none" }}>
              <Shield size={18} /> Keamanan
            </button>
            <button className="btn btn-outline" style={{ textAlign: "left", display: "flex", alignItems: "center", gap: "8px", border: "none" }}>
              <Bell size={18} /> Notifikasi
            </button>
            <button className="btn btn-outline" style={{ textAlign: "left", display: "flex", alignItems: "center", gap: "8px", border: "none" }}>
              <Key size={18} /> Kata Sandi
            </button>
          </div>
        </aside>

        <main style={{ background: "white", borderRadius: "16px", padding: "32px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--gray-200)" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "24px", borderBottom: "1px solid var(--gray-200)", paddingBottom: "12px" }}>
            Informasi Profil
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", marginBottom: "8px", color: "var(--gray-700)" }}>Nama Lengkap</label>
              <input type="text" defaultValue={user.name} className="input-field" style={{ width: "100%", maxWidth: "400px" }} disabled />
            </div>
            
            <div>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", marginBottom: "8px", color: "var(--gray-700)" }}>Email</label>
              <input type="email" defaultValue={user.email} className="input-field" style={{ width: "100%", maxWidth: "400px" }} disabled />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", marginBottom: "8px", color: "var(--gray-700)" }}>Peran (Role)</label>
              <div className="badge badge-primary" style={{ display: "inline-block", textTransform: "capitalize" }}>{user.role}</div>
            </div>

            <div style={{ marginTop: "16px" }}>
              <button className="btn btn-primary" disabled style={{ opacity: 0.5 }}>Simpan Perubahan</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

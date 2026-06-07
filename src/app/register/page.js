"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Book, Mail, Lock, User, UserPlus, Loader2, ArrowLeft } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("pengguna");
  const [error, setError] = useState("");
  const { register, loading } = useAuth();
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(email, password, name, role);
      router.push("/dashboard");
    } catch (err) {
      if (err.message === "Network Error") {
        setError("Firebase belum dikonfigurasi. Anda mendaftar menggunakan Demo Mode (Local Storage).");
      } else {
        setError("Gagal mendaftar. Pastikan email belum terdaftar dan password minimal 6 karakter.");
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)", padding: "20px" }}>
      <AnimatedSection animation="fade-up" style={{ width: "100%", maxWidth: "440px" }}>
        <div className="auth-card" style={{ background: "white", padding: "40px", borderRadius: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", position: "relative", overflow: "hidden" }}>
          
          {/* Decor element */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "6px", background: "linear-gradient(90deg, var(--primary), var(--secondary))" }} />

          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", background: "var(--primary-lighter)", color: "var(--primary)", borderRadius: "20px", marginBottom: "20px" }}>
              <UserPlus size={32} />
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text)", marginBottom: "8px" }}>Buat Akun Baru</h1>
            <p style={{ color: "var(--gray-500)", fontSize: "0.95rem" }}>Bergabunglah dengan perpustakaan cerdas RuangAksara</p>
          </div>

          {error && (
            <div style={{ background: "var(--danger-light)", color: "var(--danger)", padding: "12px 16px", borderRadius: "12px", fontSize: "0.88rem", marginBottom: "24px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, color: "var(--gray-700)", marginBottom: "8px" }}>Nama Lengkap</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }}>
                  <User size={18} />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  style={{ width: "100%", padding: "12px 16px 12px 42px", border: "1.5px solid var(--gray-200)", borderRadius: "12px", outline: "none", transition: "border-color 0.2s", fontSize: "0.95rem" }}
                  onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--gray-200)"}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, color: "var(--gray-700)", marginBottom: "8px" }}>Email</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }}>
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@kampus.ac.id"
                  style={{ width: "100%", padding: "12px 16px 12px 42px", border: "1.5px solid var(--gray-200)", borderRadius: "12px", outline: "none", transition: "border-color 0.2s", fontSize: "0.95rem" }}
                  onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--gray-200)"}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, color: "var(--gray-700)", marginBottom: "8px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }}>
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  style={{ width: "100%", padding: "12px 16px 12px 42px", border: "1.5px solid var(--gray-200)", borderRadius: "12px", outline: "none", transition: "border-color 0.2s", fontSize: "0.95rem" }}
                  onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--gray-200)"}
                />
              </div>
            </div>



            <button
              type="submit"
              disabled={loading}
              style={{
                background: "var(--primary)",
                color: "white",
                border: "none",
                padding: "14px",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "8px",
                transition: "all 0.2s",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)"
              }}
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Memproses...</>
              ) : (
                <><UserPlus size={18} /> Daftar Akun</>
              )}
            </button>
          </form>

          <div style={{ marginTop: "32px", textAlign: "center", fontSize: "0.9rem", color: "var(--gray-500)" }}>
            <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
              <ArrowLeft size={14} style={{ display: "inline", verticalAlign: "middle" }} /> Kembali ke Login
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

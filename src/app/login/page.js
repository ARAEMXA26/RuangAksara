"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Book, Mail, Lock, LogIn, Loader2, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      if (err.message === "Network Error") {
        setError("Firebase belum dikonfigurasi. Anda login menggunakan Demo Mode (Local Storage).");
      } else {
        setError("Gagal login. Periksa email dan password Anda.");
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
              <Book size={32} />
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text)", marginBottom: "8px" }}>Selamat Datang Kembali</h1>
            <p style={{ color: "var(--gray-500)", fontSize: "0.95rem" }}>Masuk ke akun RuangAksara Anda</p>
          </div>

          {error && (
            <div style={{ background: "var(--danger-light)", color: "var(--danger)", padding: "12px 16px", borderRadius: "12px", fontSize: "0.88rem", marginBottom: "24px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, color: "var(--gray-700)" }}>Password</label>
              </div>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }}>
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                <><LogIn size={18} /> Masuk</>
              )}
            </button>
          </form>

          <div style={{ marginTop: "32px", textAlign: "center", fontSize: "0.9rem", color: "var(--gray-500)" }}>
            Belum punya akun?{" "}
            <Link href="/register" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
              Daftar sekarang <ArrowRight size={14} style={{ display: "inline", verticalAlign: "middle" }} />
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

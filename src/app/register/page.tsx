"use client";

import { useState, useEffect, FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, UserPlus, Loader2, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  // Field States
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI Flow States
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  
  // Loading States
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Message States (Errors/Success)
  const [message, setMessage] = useState({ type: "", text: "" });

  // Helpers
  const isValidUsername = (val: string) => {
    if (val.length < 3 || val.length > 20) return false;
    return /^[a-zA-Z0-9._-]+$/.test(val);
  };

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const isValidPassword = (val: string) => {
    if (val.length < 8) return false;
    if (!/[A-Z]/.test(val)) return false;
    if (!/[a-z]/.test(val)) return false;
    if (!/[0-9]/.test(val)) return false;
    if (!/[^A-Za-z0-9]/.test(val)) return false;
    return true;
  };

  // Derived Disabled States
  const canGetOtp = username.length > 0 && email.length > 0 && !isSendingOtp && !otpVerified;
  const canRegister = otpVerified && password.length > 0 && confirmPassword.length > 0 && !isRegistering;

  // Auto-verify OTP when 6 digits are entered
  useEffect(() => {
    if (otp.length === 6 && !isVerifyingOtp && !otpVerified) {
      handleVerifyOtp();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  // Handlers
  const handleGetOtp = async () => {
    setMessage({ type: "", text: "" });

    if (!isValidUsername(username)) {
      setMessage({ type: "error", text: "Username tidak valid. Gunakan 3–20 karakter tanpa spasi." });
      return;
    }
    if (!isValidEmail(email)) {
      setMessage({ type: "error", text: "Masukkan alamat email yang valid." });
      return;
    }

    setIsSendingOtp(true);
    try {
      // 1. Check availability
      const checkRes = await fetch("/api/auth/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email })
      });
      const checkData = await checkRes.json();

      // Handle server error (e.g. database connection failure)
      if (!checkRes.ok || checkData.error) {
        setMessage({ type: "error", text: checkData.error || "Gagal memeriksa ketersediaan. Silakan coba lagi." });
        setIsSendingOtp(false);
        return;
      }

      if (checkData.usernameAvailable === false) {
        setMessage({ type: "error", text: "Username sudah digunakan. Silakan pilih username lain." });
        setIsSendingOtp(false);
        return;
      }
      if (checkData.emailAvailable === false) {
        setMessage({ type: "error", text: "Email sudah terdaftar. Silakan login atau gunakan email lain." });
        setIsSendingOtp(false);
        return;
      }

      // 2. Send OTP with artificial 2s delay for UX
      const otpResPromise = fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", email })
      });
      const delayPromise = new Promise(r => setTimeout(r, 2000));
      
      const [otpRes] = await Promise.all([otpResPromise, delayPromise]);

      if (otpRes.ok) {
        setOtpSent(true);
        setMessage({ type: "success", text: "Kode OTP telah dikirim ke email Anda." });
      } else {
        const otpError = await otpRes.json().catch(() => ({}));
        setMessage({ type: "error", text: otpError.error || otpError.message || "Gagal mengirim OTP. Pastikan email valid dan coba lagi." });
      }
    } catch (error: any) {
      console.error("Get OTP error:", error);
      if (error?.message?.includes("fetch") || error?.message?.includes("network")) {
        setMessage({ type: "error", text: "Tidak dapat terhubung ke server. Periksa koneksi internet Anda." });
      } else {
        setMessage({ type: "error", text: "Terjadi kesalahan jaringan. Silakan coba lagi." });
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setMessage({ type: "", text: "" });
    setIsVerifyingOtp(true);

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", email, otp })
      });
      const data = await res.json();

      if (res.ok) {
        setOtpVerified(true);
        setMessage({ type: "success", text: "Email berhasil diverifikasi. Silakan buat password Anda." });
      } else {
        setMessage({ type: "error", text: data.message || "Kode OTP salah." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!isValidPassword(password)) {
      setMessage({ type: "error", text: "Password harus minimal 8 karakter dan mengandung huruf besar, kecil, angka, serta simbol." });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Konfirmasi password tidak sesuai." });
      return;
    }

    setIsRegistering(true);
    try {
      await register(username, email, password, "mahasiswa");
      setMessage({ type: "success", text: "Akun berhasil dibuat. Mengalihkan..." });
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      console.error("Registration error:", err);
      let errorMsg = "Gagal mendaftar. Silakan coba lagi.";
      if (err?.message) {
        if (err.message.includes("email-already-in-use")) errorMsg = "Email ini sudah terdaftar di Firebase.";
        else if (err.message.includes("weak-password")) errorMsg = "Password terlalu lemah.";
        else if (err.message.includes("Database sedang")) errorMsg = err.message;
        else if (err.message.includes("Koneksi database")) errorMsg = err.message;
        else if (err.message.includes("Gagal menyimpan")) errorMsg = err.message;
        else if (err.message.includes("network")) errorMsg = "Tidak dapat terhubung ke server. Periksa koneksi internet.";
        else errorMsg = err.message;
      }
      setMessage({ type: "error", text: errorMsg });
      setIsRegistering(false);
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

          {message.text && (
            <div style={{ 
              background: message.type === "error" ? "var(--danger-light)" : "#d1fae5", 
              color: message.type === "error" ? "var(--danger)" : "#059669", 
              padding: "12px 16px", 
              borderRadius: "12px", 
              fontSize: "0.88rem", 
              marginBottom: "24px", 
              border: `1px solid ${message.type === "error" ? "rgba(239, 68, 68, 0.2)" : "rgba(5, 150, 105, 0.2)"}`,
              transition: "all 0.3s ease"
            }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* TAHAP 1: Username & Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, color: "var(--gray-700)", marginBottom: "8px" }}>Username</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }}>
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={otpVerified || otpSent}
                    placeholder="Contoh: ruangaksara"
                    style={{ width: "100%", padding: "12px 16px 12px 42px", border: "1.5px solid var(--gray-200)", borderRadius: "12px", outline: "none", transition: "all 0.3s", fontSize: "0.95rem", opacity: (otpVerified || otpSent) ? 0.6 : 1 }}
                    onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--gray-200)"}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, color: "var(--gray-700)", marginBottom: "8px" }}>Email</label>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ position: "relative", flexGrow: 1 }}>
                    <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }}>
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={otpVerified || otpSent}
                      placeholder="email@kampus.ac.id"
                      style={{ width: "100%", padding: "12px 16px 12px 42px", border: "1.5px solid var(--gray-200)", borderRadius: "12px", outline: "none", transition: "all 0.3s", fontSize: "0.95rem", opacity: (otpVerified || otpSent) ? 0.6 : 1 }}
                      onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                      onBlur={(e) => e.target.style.borderColor = "var(--gray-200)"}
                    />
                  </div>
                  
                  {/* Button Get OTP */}
                  {!otpVerified && (
                    <button
                      type="button"
                      disabled={!canGetOtp}
                      onClick={handleGetOtp}
                      style={{
                        background: canGetOtp ? "var(--primary)" : "var(--gray-200)",
                        color: canGetOtp ? "white" : "var(--gray-500)",
                        border: "none",
                        padding: "0 16px",
                        borderRadius: "12px",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        cursor: canGetOtp ? "pointer" : "not-allowed",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s",
                        minWidth: "100px",
                        opacity: (otpSent && !isSendingOtp) ? 0.6 : 1
                      }}
                    >
                      {isSendingOtp ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : otpSent ? (
                        "Terkirim"
                      ) : (
                        "Get OTP"
                      )}
                    </button>
                  )}
                  {otpVerified && (
                    <div style={{ padding: "0 16px", background: "#d1fae5", color: "#059669", borderRadius: "12px", fontSize: "0.9rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", transition: "all 0.3s" }}>
                      <CheckCircle2 size={16} /> Verified
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* TAHAP 2: OTP Input (Center Aligned, Auto Verify) */}
            {otpSent && (
              <AnimatedSection animation="fade-up">
                <div style={{ 
                  background: otpVerified ? "#ecfdf5" : "var(--background)", 
                  padding: "24px", 
                  borderRadius: "16px", 
                  border: `1px solid ${otpVerified ? "#10b981" : "var(--gray-200)"}`, 
                  textAlign: "center", 
                  transition: "all 0.4s ease" 
                }}>
                  <label style={{ display: "block", fontSize: "0.95rem", fontWeight: 600, color: otpVerified ? "#065f46" : "var(--gray-700)", marginBottom: "16px" }}>
                    {otpVerified ? "OTP Berhasil Diverifikasi" : "Masukkan Kode OTP"}
                  </label>
                  <div style={{ position: "relative", maxWidth: "220px", margin: "0 auto" }}>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        if (!otpVerified) setOtp(e.target.value.replace(/[^0-9]/g, ''));
                      }}
                      placeholder="••••••"
                      readOnly={otpVerified}
                      disabled={isVerifyingOtp}
                      style={{ 
                        width: "100%", 
                        padding: "16px", 
                        border: `2px solid ${otpVerified ? "#34d399" : "var(--gray-200)"}`, 
                        borderRadius: "16px", 
                        outline: "none", 
                        transition: "all 0.3s", 
                        fontSize: "1.75rem", 
                        letterSpacing: "8px", 
                        fontWeight: 700, 
                        textAlign: "center", 
                        background: otpVerified ? "#f0fdf4" : "white", 
                        color: otpVerified ? "#065f46" : "var(--text)" 
                      }}
                      onFocus={(e) => { if (!otpVerified) e.target.style.borderColor = "var(--primary)" }}
                      onBlur={(e) => { if (!otpVerified) e.target.style.borderColor = "var(--gray-200)" }}
                    />
                  </div>
                  {isVerifyingOtp && (
                    <div style={{ marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "var(--gray-500)", fontSize: "0.9rem" }}>
                      <Loader2 size={16} className="animate-spin" /> Memverifikasi...
                    </div>
                  )}
                </div>
              </AnimatedSection>
            )}

            {/* TAHAP 3: Password */}
            {otpVerified && (
              <AnimatedSection animation="fade-up">
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingTop: "8px" }}>
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
                        placeholder="Min. 8 karakter (A-Z, a-z, 0-9, simbol)"
                        style={{ width: "100%", padding: "12px 16px 12px 42px", border: "1.5px solid var(--gray-200)", borderRadius: "12px", outline: "none", transition: "all 0.3s", fontSize: "0.95rem" }}
                        onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                        onBlur={(e) => e.target.style.borderColor = "var(--gray-200)"}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, color: "var(--gray-700)", marginBottom: "8px" }}>Konfirmasi Password</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }}>
                        <Lock size={18} />
                      </span>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Ulangi password"
                        style={{ width: "100%", padding: "12px 16px 12px 42px", border: "1.5px solid var(--gray-200)", borderRadius: "12px", outline: "none", transition: "all 0.3s", fontSize: "0.95rem" }}
                        onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                        onBlur={(e) => e.target.style.borderColor = "var(--gray-200)"}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!canRegister}
                    style={{
                      background: canRegister ? "var(--primary)" : "var(--gray-200)",
                      color: canRegister ? "white" : "var(--gray-500)",
                      border: "none",
                      padding: "14px",
                      borderRadius: "12px",
                      fontWeight: 600,
                      fontSize: "1rem",
                      cursor: canRegister ? "pointer" : "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      marginTop: "12px",
                      transition: "all 0.3s",
                      boxShadow: canRegister ? "0 4px 12px rgba(37, 99, 235, 0.2)" : "none"
                    }}
                  >
                    {isRegistering ? (
                      <><Loader2 size={18} className="animate-spin" /> Mendaftarkan...</>
                    ) : (
                      <><UserPlus size={18} /> Daftar Akun</>
                    )}
                  </button>
                </div>
              </AnimatedSection>
            )}

          </form>

          <div style={{ marginTop: "32px", textAlign: "center", fontSize: "0.9rem", color: "var(--gray-500)" }}>
            <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none", transition: "color 0.2s" }}>
              <ArrowLeft size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} /> Kembali ke Login
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Loader2, Save, X, Book, Image as ImageIcon } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function AdminBooksPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isbn, setIsbn] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bookData, setBookData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Only allow pustakawan
  if (user && user.role !== "pustakawan") {
    return (
      <div className="page" style={{ padding: "40px", textAlign: "center" }}>
        <h2>Akses Ditolak</h2>
        <p>Halaman ini hanya untuk Pustakawan.</p>
        <Link href="/dashboard" className="btn btn-primary" style={{ marginTop: "20px" }}>Kembali</Link>
      </div>
    );
  }

  const fetchFromGoogleBooks = async (e) => {
    e.preventDefault();
    if (!isbn.trim()) return;

    setLoading(true);
    setError("");
    setBookData(null);
    setSuccess("");

    try {
      const res = await fetch(`/api/books/fetch?isbn=${isbn.replace(/-/g, "")}`);
      const data = await res.json();

      if (res.ok && data.book) {
        setBookData(data.book);
      } else {
        setError(data.error || "Buku tidak ditemukan di Google Books");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const saveToDatabase = async () => {
    if (!bookData) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData)
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess("Buku berhasil ditambahkan ke perpustakaan!");
        setBookData(null);
        setIsbn("");
      } else {
        setError(data.error || "Gagal menyimpan buku ke database");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <AnimatedSection animation="fade-up">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <h2>Tambah Buku (Google Books API)</h2>
            <Link href="/dashboard" className="btn" style={{ background: "var(--gray-200)", color: "var(--gray-800)" }}>
              Kembali ke Dashboard
            </Link>
          </div>
          
          <div className="card" style={{ padding: "30px", marginBottom: "30px", background: "white", borderRadius: "12px", boxShadow: "var(--shadow-md)" }}>
            <p style={{ color: "var(--gray-600)", marginBottom: "20px" }}>
              Masukkan ISBN buku untuk mengambil data (Judul, Penulis, Sinopsis, dan Cover) secara otomatis dari database Google Books.
            </p>
            
            <form onSubmit={fetchFromGoogleBooks} style={{ display: "flex", gap: "16px" }}>
              <input
                type="text"
                placeholder="Masukkan ISBN (Contoh: 9780132350884)"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className="input-field"
                style={{ flex: 1, padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--gray-300)" }}
                required
              />
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 24px" }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                Cari Buku
              </button>
            </form>
            
            {error && <div style={{ marginTop: "16px", color: "red", padding: "12px", background: "#fee2e2", borderRadius: "8px" }}>{error}</div>}
            {success && <div style={{ marginTop: "16px", color: "green", padding: "12px", background: "#dcfce7", borderRadius: "8px" }}>{success}</div>}
          </div>

          {bookData && (
            <div className="card" style={{ padding: "30px", background: "white", borderRadius: "12px", boxShadow: "var(--shadow-md)" }}>
              <h3 style={{ marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid var(--gray-200)" }}>
                Preview Data Buku
              </h3>
              
              <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
                <div style={{ flexShrink: 0 }}>
                  {bookData.cover.startsWith("http") ? (
                    <img 
                      src={bookData.cover} 
                      alt="Cover" 
                      style={{ width: "160px", height: "230px", objectFit: "cover", borderRadius: "8px", boxShadow: "var(--shadow-md)" }}
                    />
                  ) : (
                    <div style={{ width: "160px", height: "230px", background: "var(--gray-100)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", fontSize: "4rem" }}>
                      {bookData.cover}
                    </div>
                  )}
                </div>
                
                <div style={{ flex: 1, minWidth: "300px" }}>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: "4px" }}>Judul Buku</label>
                    <div style={{ fontWeight: "700", fontSize: "1.2rem", color: "var(--gray-900)" }}>{bookData.title}</div>
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: "4px" }}>Penulis</label>
                      <div style={{ fontWeight: "600", color: "var(--gray-800)" }}>{bookData.author}</div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: "4px" }}>Tahun Terbit</label>
                      <div style={{ fontWeight: "600", color: "var(--gray-800)" }}>{bookData.year}</div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: "4px" }}>ISBN</label>
                      <div style={{ fontWeight: "600", color: "var(--gray-800)" }}>{bookData.isbn}</div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: "4px" }}>Halaman</label>
                      <div style={{ fontWeight: "600", color: "var(--gray-800)" }}>{bookData.pageCount || "-"}</div>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: "4px" }}>Sinopsis Singkat</label>
                    <div style={{ fontSize: "0.9rem", color: "var(--gray-700)", lineHeight: "1.5", maxHeight: "100px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" }}>
                      {bookData.description || "Tidak ada deskripsi tersedia."}
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                    <button 
                      className="btn btn-primary" 
                      onClick={saveToDatabase}
                      disabled={saving}
                      style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "center" }}
                    >
                      {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      Simpan ke Perpustakaan
                    </button>
                    <button 
                      className="btn" 
                      onClick={() => setBookData(null)}
                      disabled={saving}
                      style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--gray-100)", color: "var(--gray-700)" }}
                    >
                      <X size={18} />
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatedSection>
      </div>
    </div>
  );
}

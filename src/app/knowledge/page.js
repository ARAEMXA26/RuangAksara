"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AnimatedSection from "@/components/AnimatedSection";
import { useAuth } from "@/contexts/AuthContext";
import {
  Brain, FileEdit, CheckCircle2, Lock, Lightbulb,
  Library, User, Calendar
} from "lucide-react";

export default function KnowledgePage() {
  const { user, loading: authLoading } = useAuth();
  const [knowledgeItems, setKnowledgeItems] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const router = useRouter();
  const formRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }

    if (user && formRef.current) {
      const loadGSAP = async () => {
        const gsapModule = await import("gsap");
        const gsap = gsapModule.default;
        gsap.from(formRef.current, {
          x: -40,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        });
      };
      loadGSAP();
    }
  }, [user, authLoading, router]);

  // Fetch knowledge items from API
  useEffect(() => {
    const fetchKnowledge = async () => {
      setDataLoading(true);
      try {
        const res = await fetch("/api/knowledge/externalize");
        if (res.ok) {
          const data = await res.json();
          setKnowledgeItems(data.items || []);
        }
      } catch (error) {
        console.error("Failed to fetch knowledge:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchKnowledge();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return;

    if (user.role !== "pustakawan") {
      showToast("Akses ditolak! Hanya Pustakawan yang dapat menambah knowledge. (403 Forbidden)", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/knowledge/externalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          userId: user.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setKnowledgeItems((prev) => [data.item, ...prev]);
        setTitle("");
        setContent("");
        showToast("Pengetahuan berhasil disimpan! (201 Created) — Vector embedding telah dibuat", "success");

        // Animate new item
        const loadGSAP = async () => {
          const gsapModule = await import("gsap");
          const gsap = gsapModule.default;
          const newItem = document.querySelector(".knowledge-item:first-child");
          if (newItem) {
            gsap.from(newItem, {
              y: -20,
              opacity: 0,
              scale: 0.95,
              duration: 0.5,
              ease: "back.out(1.7)",
            });
          }
        };
        loadGSAP();
      } else {
        showToast("Gagal menyimpan pengetahuan", "error");
      }
    } catch (error) {
      console.error("Submit failed:", error);
      showToast("Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const isPustakawan = user.role === "pustakawan";

  return (
    <>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

      <div className="page">
        <div className="page-header">
          <AnimatedSection animation="fade-up">
            <h1 className="page-header-title" style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center" }}><Brain size={32} /> Knowledge Externalization</h1>
            <p className="page-header-subtitle">
              {isPustakawan
                ? "Dokumentasikan tacit knowledge menjadi explicit knowledge untuk perpustakaan"
                : "Lihat panduan dan SOP perpustakaan yang telah didokumentasikan"}
            </p>
          </AnimatedSection>
        </div>

        <div className="page-content">
          <div className="knowledge-layout">
            {/* Form Section */}
            <div ref={formRef}>
              <div className="knowledge-form-card">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "8px" }}><FileEdit size={20} /> Tambah Pengetahuan Baru</h3>
                  {isPustakawan ? (
                    <span className="badge badge-success" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><CheckCircle2 size={14} /> Akses Diberikan</span>
                  ) : (
                    <span className="badge badge-danger" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><Lock size={14} /> Pustakawan Only</span>
                  )}
                </div>

                {!isPustakawan && (
                  <div
                    style={{
                      padding: "24px",
                      background: "var(--danger-light)",
                      borderRadius: "var(--radius-md)",
                      textAlign: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <span style={{ fontSize: "2rem", display: "flex", justifyContent: "center", marginBottom: "12px" }}><Lock size={48} className="text-danger" /></span>
                    <h4 style={{ margin: "8px 0 4px", color: "var(--danger)" }}>
                      Error 403 Forbidden
                    </h4>
                    <p style={{ fontSize: "0.88rem", color: "var(--gray-600)" }}>
                      Hanya Pustakawan yang dapat menambah pengetahuan baru.
                      <br />
                      Login sebagai Pustakawan untuk mengakses fitur ini.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="input-group" style={{ marginBottom: "16px" }}>
                    <label className="input-label" htmlFor="kb-title">
                      Judul SOP / Strategi
                    </label>
                    <input
                      id="kb-title"
                      type="text"
                      className="input"
                      placeholder="Contoh: Panduan Perpanjangan Pinjaman"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      disabled={!isPustakawan}
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: "16px" }}>
                    <label className="input-label" htmlFor="kb-content">
                      Konten Pengetahuan
                    </label>
                    <textarea
                      id="kb-content"
                      className="input"
                      placeholder="Tuliskan strategi penelusuran, SOP, atau panduan yang ingin didokumentasikan..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                      disabled={!isPustakawan}
                      style={{ minHeight: "180px" }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!isPustakawan || loading}
                    style={{ width: "100%" }}
                  >
                    {loading ? (
                      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="loading-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </span>
                        Chunking & Generating Vectors...
                      </span>
                    ) : (
                      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><Lightbulb size={18} /> Simpan & Externalize Knowledge</span>
                    )}
                  </button>
                </form>

                <div
                  style={{
                    marginTop: "20px",
                    padding: "16px",
                    background: "var(--primary-lighter)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.82rem",
                    color: "var(--gray-600)",
                    lineHeight: "1.6",
                  }}
                >
                  <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}><Lightbulb size={16} /> Proses Externalization (SECI Model):</strong>
                  <br />
                  1. Teks dipotong menjadi chunks
                  <br />
                  2. Setiap chunk diubah menjadi vector embedding
                  <br />
                  3. Disimpan ke tabel knowledge_base (PostgreSQL + pgvector)
                  <br />
                  4. Data ini digunakan oleh Chatbot RAG untuk menjawab pertanyaan
                </div>
              </div>
            </div>

            {/* Knowledge List */}
            <AnimatedSection animation="fade-right" delay={0.2}>
              <div className="knowledge-list-card">
                <h3 style={{ fontSize: "1.2rem", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Library size={24} /> Knowledge Base ({knowledgeItems.length} entries)
                </h3>

                {knowledgeItems.map((item) => (
                  <div key={item.id} className="knowledge-item">
                    <div className="knowledge-item-content">
                      {item.title ? <strong>{item.title}: </strong> : ""}
                      {item.content}
                    </div>
                    <div className="knowledge-item-meta">
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><User size={14} /> {item.authorName || "Pustakawan"}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Calendar size={14} /> {new Date(item.createdAt || item.created_at).toLocaleDateString("id-ID")}</span>
                      <span className="badge badge-primary" style={{ fontSize: "0.7rem" }}>
                        Vectorized
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </>
  );
}

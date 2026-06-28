"use client";

import { Book, MapPin, BookOpen, Bookmark, Clock } from "lucide-react";

// Helper to parse description metadata
const getMetadata = (description: string) => {
  const meta = { penerbit: "", bahasa: "", jenisKoleksi: "" };
  if (!description) return meta;
  description.split("\n").forEach(line => {
    if (line.startsWith("Penerbit:")) meta.penerbit = line.replace("Penerbit:", "").trim();
    if (line.startsWith("Bahasa:")) meta.bahasa = line.replace("Bahasa:", "").trim();
    if (line.startsWith("Jenis Koleksi:")) meta.jenisKoleksi = line.replace("Jenis Koleksi:", "").trim();
  });
  return meta;
};

// Helper to get clean description without metadata lines
const cleanDescription = (description: string) => {
  if (!description) return "";
  return description
    .split("\n")
    .filter(line => !line.startsWith("Penerbit:") && !line.startsWith("Bahasa:") && !line.startsWith("Jenis Koleksi:"))
    .join("\n")
    .trim();
};

export default function BookCard({ book, onBorrow, onBookmark, onReserve, isBookmarked = false, showBorrow = false, layout = "vertical" }) {
  const { penerbit, bahasa, jenisKoleksi } = getMetadata(book.description || "");
  const cleanDesc = cleanDescription(book.description || "");

  const availabilityClass =
    book.available > 0 ? "badge-success" : "badge-danger";
  const availabilityText =
    book.available > 0 ? `${book.available}/${book.total} Tersedia` : "Tidak Tersedia";

  if (layout === "horizontal") {
    return (
      <div className="book-card-horizontal">
        <div className="book-card-horizontal-cover">
          {book.cover && typeof book.cover === "string" && book.cover.startsWith("http") ? (
            <img src={book.cover} alt={book.title} />
          ) : (
            <Book size={32} className="text-primary" />
          )}
        </div>
        <div className="book-card-horizontal-content">
          <h3 className="book-card-horizontal-title">{book.title}</h3>
          <p className="book-card-horizontal-author">{book.author} • {book.year} • {book.category}</p>
          <div className="book-card-horizontal-meta">
            <span className={`badge ${availabilityClass}`} style={{ fontSize: "0.75rem", padding: "2px 8px" }}>
              {availabilityText}
            </span>
            {book.location && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <MapPin size={12} /> {book.location}
              </span>
            )}
          </div>
          <div className="book-card-horizontal-desc">
            {cleanDesc || "Buku ini membahas konsep dan teknik terkait topik tersebut secara komprehensif."}
          </div>
          <div className="book-card-horizontal-tags">
            <span className="book-card-horizontal-tag">{book.category}</span>
            {jenisKoleksi && <span className="book-card-horizontal-tag" style={{ background: "var(--primary-lighter)", color: "var(--primary)" }}>{jenisKoleksi}</span>}
            {bahasa && <span className="book-card-horizontal-tag">{bahasa}</span>}
            {book.title.includes("AI") || book.title.includes("Artificial") ? (
              <><span className="book-card-horizontal-tag">Machine Learning</span><span className="book-card-horizontal-tag">Neural Network</span></>
            ) : null}
          </div>
          <div className="book-card-horizontal-footer" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button className="btn btn-sm" style={{ border: "1px solid var(--gray-300)", background: "white", color: "var(--primary)", fontWeight: "600" }}>Detail</button>
            {showBorrow && book.available > 0 && (
              <button className="btn btn-sm btn-primary" onClick={() => onBorrow && onBorrow(book)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={16} /> Pinjam
              </button>
            )}
            {showBorrow && book.available === 0 && (
              <button className="btn btn-sm" onClick={() => onReserve && onReserve(book)} style={{ background: 'var(--warning)', color: 'white', display: 'flex', alignItems: 'center', gap: '6px', border: 'none' }}>
                <Clock size={16} /> Antre
              </button>
            )}
            <button onClick={() => onBookmark && onBookmark(book)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: isBookmarked ? 'var(--primary)' : 'var(--gray-400)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-card">
      <div className="book-card-cover">
        {book.cover && typeof book.cover === "string" && book.cover.startsWith("http") ? (
          <img src={book.cover} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--radius-md)" }} />
        ) : (
          <div className="book-card-emoji">
            <Book size={48} className="text-primary" />
          </div>
        )}
        {book.similarity !== undefined && (
          <div className="book-card-score">
            {(book.similarity * 100).toFixed(0)}% match
          </div>
        )}
      </div>
      <div className="book-card-body">
        {jenisKoleksi && (
          <span className="badge" style={{ fontSize: "0.7rem", marginBottom: "8px", display: "inline-block", background: "var(--primary-lighter)", color: "var(--primary)", border: "1px solid var(--primary-light)", padding: "2px 6px", borderRadius: "4px", fontWeight: "600" }}>
            {jenisKoleksi}
          </span>
        )}
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">{book.author}</p>
        <div className="book-card-meta">
          <span className={`badge ${availabilityClass}`}>
            {availabilityText}
          </span>
          {book.location && (
            <span className="book-card-location" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <MapPin size={14} /> {book.location}
            </span>
          )}
        </div>
        {book.isbn && (
          <p className="book-card-isbn">ISBN: {book.isbn}</p>
        )}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          {showBorrow && book.available > 0 && (
            <button
              className="btn btn-primary btn-sm book-card-btn"
              onClick={() => onBorrow && onBorrow(book)}
              style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center", flex: 1 }}
            >
              <BookOpen size={16} /> Pinjam
            </button>
          )}
          {showBorrow && book.available === 0 && (
            <button
              className="btn btn-sm book-card-btn"
              onClick={() => onReserve && onReserve(book)}
              style={{ background: 'var(--warning)', color: 'white', border: 'none', display: "flex", alignItems: "center", gap: "6px", justifyContent: "center", flex: 1 }}
            >
              <Clock size={16} /> Antre
            </button>
          )}
          <button 
            onClick={() => onBookmark && onBookmark(book)} 
            style={{ background: 'var(--gray-100)', border: 'none', borderRadius: 'var(--radius-md)', padding: '0 12px', cursor: 'pointer', color: isBookmarked ? 'var(--primary)' : 'var(--gray-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
}

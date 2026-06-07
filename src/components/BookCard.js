"use client";

import { Book, MapPin, BookOpen } from "lucide-react";

export default function BookCard({ book, onBorrow, showBorrow = false, layout = "vertical" }) {
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
            {book.description || "Buku ini membahas konsep dan teknik terkait topik tersebut secara komprehensif."}
          </div>
          <div className="book-card-horizontal-tags">
            <span className="book-card-horizontal-tag">{book.category}</span>
            {book.title.includes("AI") || book.title.includes("Artificial") ? (
              <><span className="book-card-horizontal-tag">Machine Learning</span><span className="book-card-horizontal-tag">Neural Network</span></>
            ) : null}
          </div>
          <div className="book-card-horizontal-footer">
            <button className="btn btn-sm" style={{ border: "1px solid var(--gray-300)", background: "white", color: "var(--primary)", fontWeight: "600" }}>Detail</button>
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
        {showBorrow && book.available > 0 && (
          <button
            className="btn btn-primary btn-sm book-card-btn"
            onClick={() => onBorrow && onBorrow(book)}
            style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}
          >
            <BookOpen size={16} /> Pinjam Buku
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

interface PopularBook {
  title: string;
  author: string;
  count: number;
}

interface PopularBooksProps {
  data: PopularBook[];
}

export default function PopularBooks({ data }: PopularBooksProps) {
  return (
    <div className="admin-panel-card">
      <div className="admin-panel-header">
        <h3 className="admin-panel-title">Koleksi Terpopuler</h3>
      </div>
      <div className="popular-list">
        {data.length > 0 ? (
          data.map((book, index) => (
            <div key={index} className="popular-item">
              <div className="popular-rank">{index + 1}</div>
              <div className="popular-info">
                <div className="popular-title">{book.title}</div>
                <div className="popular-author">{book.author}</div>
              </div>
              <div className="popular-count-badge">{book.count}x</div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--gray-400)" }}>
            Belum ada data peminjaman
          </div>
        )}
      </div>
    </div>
  );
}

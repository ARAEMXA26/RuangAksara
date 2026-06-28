import { NextResponse } from "next/server";

// GET /api/books/fetch?isbn=12345
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawInput = searchParams.get("isbn");

    if (!rawInput) {
      return NextResponse.json({ error: "ISBN/Identifier is required" }, { status: 400 });
    }

    const input = rawInput.trim();

    // 1. Deteksi Pola Input: Tesis / Skripsi (Contoh: TESIS-HUKUM-2023, SKRIPSI-SOS-2024)
    const isAcademic = /^(TESIS|SKRIPSI|TA|DISERTASI)-/i.test(input) || 
                       input.toUpperCase().includes("TESIS") || 
                       input.toUpperCase().includes("SKRIPSI");
                       
    if (isAcademic) {
      const match = input.toUpperCase().match(/^(TESIS|SKRIPSI|TA|DISERTASI)-(?:([A-Z0-9_ -]+)-)?(\d{4})$/i);
      let type = "Skripsi";
      let field = "Umum";
      let year = new Date().getFullYear();

      if (match) {
        const rawType = match[1];
        if (rawType === "TESIS") type = "Tesis";
        else if (rawType === "SKRIPSI") type = "Skripsi";
        else if (rawType === "TA") type = "Tugas Akhir";
        else if (rawType === "DISERTASI") type = "Disertasi";
        
        if (match[2]) {
          field = match[2].trim().toLowerCase().split(/[_-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        }
        if (match[3]) {
          year = parseInt(match[3]);
        }
      } else {
        if (input.toUpperCase().includes("TESIS")) type = "Tesis";
        else if (input.toUpperCase().includes("SKRIPSI")) type = "Skripsi";
        else if (input.toUpperCase().includes("DISERTASI")) type = "Disertasi";
        
        const yearMatch = input.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) year = parseInt(yearMatch[0]);
      }

      const cover = type === "Tesis" ? "⚖️" : (type === "Disertasi" ? "📜" : "🎓");
      const category = field.toLowerCase().includes("hukum") ? "Hukum" : 
                       (field.toLowerCase().includes("sosial") || field.toLowerCase().includes("sos") ? "Sosial" : "Teknologi Informasi");

      return NextResponse.json({
        book: {
          title: `Draft ${type} Bidang ${field} (${year})`,
          author: `Penulis ${type}`,
          year: year,
          cover: cover,
          description: `Jenis Koleksi: ${type}\nKode Dokumen: ${input}\n\nTesis/Skripsi Akademik Mahasiswa Bidang ${field} tahun ${year}. Silakan ubah judul, penulis, dan deskripsi sesuai dokumen aslinya.`,
          pageCount: null,
          category: category,
          isbn: input,
          publisher: "Perpustakaan Universitas",
          language: "Indonesia"
        }
      });
    }

    // 2. Deteksi Pola Input: DOI (Digital Object Identifier)
    let cleanDoi = input;
    if (cleanDoi.toLowerCase().includes("doi.org/")) {
      cleanDoi = cleanDoi.substring(cleanDoi.toLowerCase().indexOf("doi.org/") + 8);
    }
    const isDoi = /^10\.\d{4,9}\//.test(cleanDoi);

    if (isDoi) {
      try {
        const crossrefRes = await fetch(`https://api.crossref.org/works/${encodeURIComponent(cleanDoi)}`, {
          cache: "no-store",
          headers: {
            "User-Agent": "LibKmsAi/1.0 (mailto:admin@example.com)"
          }
        });
        if (crossrefRes.ok) {
          const data = await crossrefRes.json();
          const work = data.message;
          
          let authorStr = "Unknown Author";
          if (work.author && Array.isArray(work.author)) {
            authorStr = work.author
              .map((a: any) => {
                if (a.name) return a.name;
                const given = a.given || "";
                const family = a.family || "";
                return `${given} ${family}`.trim();
              })
              .filter(Boolean)
              .join(", ");
          }

          const title = work.title && work.title.length > 0 ? work.title[0] : "Untitled Document";
          let year = new Date().getFullYear();
          if (work.published && work.published["date-parts"] && work.published["date-parts"][0]) {
            year = work.published["date-parts"][0][0] || year;
          } else if (work.created && work.created["date-parts"] && work.created["date-parts"][0]) {
            year = work.created["date-parts"][0][0] || year;
          }

          const publisher = work.publisher || "";
          let pageCount = null;
          if (work.page) {
            const parts = work.page.split("-");
            if (parts.length === 2) {
              const p1 = parseInt(parts[0].trim());
              const p2 = parseInt(parts[1].trim());
              if (!isNaN(p1) && !isNaN(p2)) {
                pageCount = p2 - p1 + 1;
              }
            } else {
              const p = parseInt(work.page.trim());
              if (!isNaN(p)) pageCount = p;
            }
          }

          const container = work["container-title"] && work["container-title"].length > 0 ? work["container-title"][0] : "";
          const isJournal = work.type === "journal-article" || !!container;

          return NextResponse.json({
            book: {
              title: title,
              author: authorStr,
              year: year,
              cover: "📝",
              description: `Jenis Koleksi: Jurnal\nDOI: ${work.DOI || cleanDoi}${container ? `\nDiterbitkan di: ${container}` : ""}\n\nAbstract/Subject: ${work.subject ? work.subject.join(", ") : "Tidak ada abstrak."}`,
              pageCount: pageCount,
              category: isJournal ? "Pendidikan" : "Umum",
              isbn: work.DOI || cleanDoi,
              publisher: publisher,
              language: "Inggris"
            }
          });
        }
      } catch (doiError: any) {
        console.warn("Failed to fetch from Crossref DOI:", doiError.message);
      }

      // Fallback draft jika API DOI gagal/tidak ketemu
      return NextResponse.json({
        book: {
          title: `Draft Artikel Jurnal (DOI: ${cleanDoi})`,
          author: "Penulis Artikel",
          year: new Date().getFullYear(),
          cover: "📝",
          description: `Jenis Koleksi: Jurnal\nDOI: ${cleanDoi}\n\nSilakan lengkapi judul, penulis, dan keterangan lainnya secara manual.`,
          pageCount: null,
          category: "Pendidikan",
          isbn: cleanDoi,
          publisher: "Penerbit Jurnal",
          language: "Indonesia"
        }
      });
    }

    // 3. Deteksi Pola Input: ISSN (Contoh: 2301-123X, 2442-5678)
    const isIssn = /^\d{4}-\d{3}[\dX]$/i.test(input) || /^\d{8}$/.test(input);
    if (isIssn) {
      const cleanIssn = input.replace(/-/g, "").toUpperCase();
      const formattedIssn = `${cleanIssn.slice(0, 4)}-${cleanIssn.slice(4)}`;
      try {
        const issnRes = await fetch(`https://api.crossref.org/journals/${formattedIssn}`, {
          cache: "no-store"
        });
        if (issnRes.ok) {
          const data = await issnRes.json();
          const journal = data.message;
          const title = journal.title || "Unknown Journal";
          const publisher = journal.publisher || "";
          
          return NextResponse.json({
            book: {
              title: title,
              author: "Dewan Redaksi",
              year: new Date().getFullYear(),
              cover: "📝",
              description: `Jenis Koleksi: Jurnal Ilmiah\nISSN: ${formattedIssn}\nPenerbit: ${publisher}\n\nDokumen cetak/elektronik terbitan berkala.`,
              pageCount: null,
              category: "Pendidikan",
              isbn: formattedIssn,
              publisher: publisher,
              language: "Indonesia"
            }
          });
        }
      } catch (issnError: any) {
        console.warn("Failed to fetch from Crossref ISSN:", issnError.message);
      }

      // Fallback draft jika API ISSN gagal/tidak ketemu
      return NextResponse.json({
        book: {
          title: `Draft Jurnal Ilmiah (ISSN: ${formattedIssn})`,
          author: "Dewan Redaksi",
          year: new Date().getFullYear(),
          cover: "📝",
          description: `Jenis Koleksi: Jurnal Ilmiah\nISSN: ${formattedIssn}\n\nSilakan lengkapi judul jurnal, penulis, dan keterangan lainnya secara manual.`,
          pageCount: null,
          category: "Pendidikan",
          isbn: formattedIssn,
          publisher: "Penerbit Jurnal",
          language: "Indonesia"
        }
      });
    }

    // 4. Default: Cari Buku berdasarkan ISBN via Google Books / Open Library
    const isbn = input.replace(/-/g, "").trim();

    // 4.1 Coba Google Books API terlebih dahulu (Nonaktifkan Cache)
    let googleBookData = null;
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`, {
        cache: "no-store"
      });
      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          const volumeInfo = data.items[0].volumeInfo;
          googleBookData = {
            title: volumeInfo.title || "Unknown Title",
            author: volumeInfo.authors ? volumeInfo.authors.join(", ") : "Unknown Author",
            year: volumeInfo.publishedDate ? parseInt(volumeInfo.publishedDate.substring(0, 4)) : new Date().getFullYear(),
            cover: volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:") || "📘",
            description: volumeInfo.description || "",
            pageCount: volumeInfo.pageCount || null,
            category: volumeInfo.categories && volumeInfo.categories.length > 0 ? volumeInfo.categories[0] : "Umum",
            isbn,
            publisher: volumeInfo.publisher || "",
            language: (volumeInfo.language || "id") === "id" ? "Indonesia" : (volumeInfo.language === "en" ? "Inggris" : "Lainnya")
          };
        }
      }
    } catch (googleError: any) {
      console.warn("Failed to fetch from Google Books:", googleError.message);
    }

    if (googleBookData) {
      return NextResponse.json({ book: googleBookData });
    }

    // 4.2 Jika Google Books gagal, lakukan fallback ke Open Library API
    console.log("Google Books failed or empty. Falling back to Open Library for ISBN:", isbn);
    try {
      const openLibraryRes = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`, {
        cache: "no-store"
      });
      if (openLibraryRes.ok) {
        const openLibraryData = await openLibraryRes.json();
        const key = `ISBN:${isbn}`;
        if (openLibraryData[key]) {
          const bookInfo = openLibraryData[key];
          const title = bookInfo.title || "Unknown Title";
          const author = bookInfo.authors ? bookInfo.authors.map((a: any) => a.name).join(", ") : "Unknown Author";
          
          let year = new Date().getFullYear();
          if (bookInfo.publish_date) {
            const match = bookInfo.publish_date.match(/\d{4}/);
            if (match) year = parseInt(match[0]);
          }

          const cover = bookInfo.cover?.large || bookInfo.cover?.medium || bookInfo.cover?.small || "📘";
          const description = bookInfo.notes || bookInfo.subjects?.map((s: any) => s.name).join(", ") || "";
          const pageCount = bookInfo.number_of_pages || null;
          const publisher = bookInfo.publishers ? bookInfo.publishers.map((p: any) => p.name).join(", ") : "";
          
          let category = "Umum";
          if (bookInfo.subjects) {
            const subjectsStr = bookInfo.subjects.map((s: any) => s.name.toLowerCase()).join(" ");
            if (subjectsStr.includes("computer") || subjectsStr.includes("technology") || subjectsStr.includes("programming")) {
              category = "Teknologi Informasi";
            }
          }

          return NextResponse.json({
            book: {
              title,
              author,
              year,
              cover,
              description,
              pageCount,
              category,
              isbn,
              publisher,
              language: "Inggris"
            }
          });
        }
      }
    } catch (openLibraryError: any) {
      console.error("Open Library fallback failed:", openLibraryError.message);
    }

    return NextResponse.json({
      error: "Buku tidak ditemukan di database online (Google Books & Open Library). Silakan lengkapi data secara manual."
    }, { status: 404 });

  } catch (error) {
    console.error("Critical error in fetch API:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal saat memverifikasi ISBN/Identifier." }, { status: 500 });
  }
}

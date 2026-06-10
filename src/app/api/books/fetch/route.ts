import { NextResponse } from "next/server";

// GET /api/books/fetch?isbn=12345
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const isbn = searchParams.get("isbn");

    if (!isbn) {
      return NextResponse.json({ error: "ISBN is required" }, { status: 400 });
    }

    // Call Google Books API
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: "Book not found in Google Books" }, { status: 404 });
    }

    const volumeInfo = data.items[0].volumeInfo;

    // Extracting fields safely
    const title = volumeInfo.title || "Unknown Title";
    const author = volumeInfo.authors ? volumeInfo.authors.join(", ") : "Unknown Author";
    const year = volumeInfo.publishedDate ? parseInt(volumeInfo.publishedDate.substring(0, 4)) : new Date().getFullYear();
    const cover = volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:") || "📘";
    const description = volumeInfo.description || "";
    const pageCount = volumeInfo.pageCount || null;
    const category = volumeInfo.categories && volumeInfo.categories.length > 0 ? volumeInfo.categories[0] : "Umum";

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
      }
    });
  } catch (error) {
    console.error("Error fetching from Google Books:", error);
    return NextResponse.json({ error: "Failed to fetch book data" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { tryDb } from "@/lib/db";
import { mockBooks, getAvailableCount, getTotalCount, mockInventory } from "@/lib/mockData";

// GET /api/books
export async function GET() {
  try {
    const dbResult = await tryDb(async (db) => {
      const books = await db.book.findMany({
        include: { inventory: true },
        orderBy: { createdAt: "desc" },
      });
      return books.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        category: book.category,
        year: book.year,
        cover: book.cover,
        available: book.inventory.filter((i) => i.status === "available").length,
        total: book.inventory.length,
        location: book.inventory[0]?.locationRack || "-",
      }));
    });

    if (dbResult) {
      return NextResponse.json({ books: dbResult });
    }

    // Fallback to mock data
    const result = mockBooks.map((book) => ({
      ...book,
      available: getAvailableCount(book.id),
      total: getTotalCount(book.id),
      location: mockInventory.find((i) => i.book_id === book.id)?.location_rack || "-",
    }));

    return NextResponse.json({ books: result });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/books
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, author, isbn, category, year, cover, description, pageCount } = body;

    if (!title || !author || !isbn) {
      return NextResponse.json({ error: "Title, author, and isbn are required" }, { status: 400 });
    }

    const dbResult = await tryDb(async (db) => {
      // Check if book exists
      const existing = await db.book.findUnique({ where: { isbn } });
      if (existing) {
        throw new Error("Book already exists");
      }

      // Create book
      const book = await db.book.create({
        data: {
          title, author, isbn, category, year, cover, description, pageCount
        }
      });
      return book;
    });

    if (dbResult) {
      return NextResponse.json({ message: "Book created successfully", book: dbResult });
    }

    // Fallback: Just return success if DB is not running
    const newMockBook = {
      id: `b${mockBooks.length + 100}`,
      title, author, isbn, category, year, cover, description, pageCount,
      available: 1,
      total: 1
    };
    mockBooks.push(newMockBook);

    return NextResponse.json({ message: "Book mocked successfully (DB offline)", book: newMockBook });
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

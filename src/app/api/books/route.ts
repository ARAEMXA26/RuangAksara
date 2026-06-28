import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/books
export async function GET() {
  try {
    const books = await prisma.book.findMany({
      include: { inventory: true },
      orderBy: { createdAt: "desc" },
    });
    
    const formattedBooks = books.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      year: book.year,
      cover: book.cover,
      description: book.description,
      pageCount: book.pageCount,
      available: book.inventory.filter((i) => i.status === "available").length,
      total: book.inventory.length,
      location: book.inventory[0]?.locationRack || "-",
    }));

    return NextResponse.json({ books: formattedBooks });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/books
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, author, isbn, category, year, cover, description, pageCount, copies, locationRack } = body;

    if (!title || !author || !isbn) {
      return NextResponse.json({ error: "Title, author, and isbn are required" }, { status: 400 });
    }

    const existing = await prisma.book.findUnique({ where: { isbn } });
    if (existing) {
      return NextResponse.json({ error: "Book already exists" }, { status: 409 });
    }

    const book = await prisma.book.create({
      data: {
        title, 
        author, 
        isbn, 
        category: category || "Umum", 
        year: year ? parseInt(year) : 2024, 
        cover: cover || "📘", 
        description, 
        pageCount: pageCount ? parseInt(pageCount) : null,
        inventory: {
          create: Array.from({ length: copies ? parseInt(copies) : 1 }).map(() => ({
            status: "available",
            locationRack: locationRack || ""
          }))
        }
      }
    });

    return NextResponse.json({ message: "Book created successfully", book }, { status: 201 });
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/search?q=...
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json({ results: [] });
    }

    const q = query.toLowerCase();
    const keywords = q.split(/\s+/).filter(Boolean);

    const books = await prisma.book.findMany({
      include: { inventory: true },
    });

    const results = books
      .map((book) => {
        let score = 0;
        const titleLower = book.title.toLowerCase();
        const authorLower = book.author.toLowerCase();
        const categoryLower = book.category.toLowerCase();

        keywords.forEach((word) => {
          if (titleLower.includes(word)) score += 0.3;
          if (authorLower.includes(word)) score += 0.2;
          if (categoryLower.includes(word)) score += 0.25;
        });

        if (q.includes("ai") || q.includes("kecerdasan") || q.includes("artificial")) {
          if (categoryLower.includes("ai") || titleLower.includes("artificial") || titleLower.includes("deep learning")) score += 0.4;
        }
        if (q.includes("algorithm") || q.includes("algoritma")) {
          if (titleLower.includes("algorithm") || categoryLower.includes("algoritma")) score += 0.4;
        }
        if (q.includes("database") || q.includes("basis data")) {
          if (titleLower.includes("database") || categoryLower.includes("database")) score += 0.4;
        }
        if (q.includes("network") || q.includes("jaringan")) {
          if (titleLower.includes("networking") || categoryLower.includes("jaringan")) score += 0.4;
        }
        if (q.includes("software") || q.includes("code") || q.includes("perangkat lunak")) {
          if (titleLower.includes("clean code") || titleLower.includes("design pattern") || titleLower.includes("pragmatic")) score += 0.4;
        }

        score += Math.random() * 0.1;
        score = Math.min(score, 0.99);

        return {
          id: book.id,
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          category: book.category,
          year: book.year,
          cover: book.cover,
          similarity: parseFloat(score.toFixed(4)),
          available: book.inventory.filter((i) => i.status === "available").length,
          total: book.inventory.length,
          location: book.inventory[0]?.locationRack || "-",
        };
      })
      .filter((r) => r.similarity > 0.1)
      .sort((a, b) => b.similarity - a.similarity);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

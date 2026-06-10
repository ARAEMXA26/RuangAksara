import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // ========== BORROW ACTIVITY (6 months) ==========
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const transactions = await db.transaction.findMany({
      where: {
        borrowDate: { gte: sixMonthsAgo },
      },
      select: {
        borrowDate: true,
      },
    });

    // Group by month
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
    ];
    const borrowActivity: { month: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const monthLabel = monthNames[d.getMonth()];
      const count = transactions.filter((t) => {
        const bd = new Date(t.borrowDate);
        return (
          bd.getFullYear() === d.getFullYear() &&
          bd.getMonth() === d.getMonth()
        );
      }).length;
      borrowActivity.push({ month: monthLabel, count });
    }

    // ========== POPULAR BOOKS (Top 5) ==========
    const allTransactions = await db.transaction.findMany({
      select: {
        inventory: {
          select: {
            book: {
              select: {
                id: true,
                title: true,
                author: true,
              },
            },
          },
        },
      },
    });

    const bookCounts: Record<string, { title: string; author: string; count: number }> = {};
    for (const tx of allTransactions) {
      const bookId = tx.inventory.book.id;
      if (!bookCounts[bookId]) {
        bookCounts[bookId] = {
          title: tx.inventory.book.title,
          author: tx.inventory.book.author,
          count: 0,
        };
      }
      bookCounts[bookId].count++;
    }

    const popularBooks = Object.values(bookCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // ========== CATEGORY DISTRIBUTION ==========
    const books = await db.book.findMany({
      select: { category: true },
    });

    const categoryCounts: Record<string, number> = {};
    for (const book of books) {
      const cat = book.category || "Lainnya";
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }

    const totalBooksCount = books.length;
    const categoryDistribution = Object.entries(categoryCounts)
      .map(([name, count]) => ({
        name,
        value: count,
        percentage: totalBooksCount > 0 ? Math.round((count / totalBooksCount) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value);

    return NextResponse.json({
      borrowActivity,
      popularBooks,
      categoryDistribution,
    });
  } catch (error) {
    console.error("Charts API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

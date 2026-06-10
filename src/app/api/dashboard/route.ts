import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const now = new Date();

    const [
      totalBooks,
      totalInventory,
      activeBorrows,
      completedBorrows,
      totalUsers,
      totalKnowledge,
      overdueCount,
    ] = await Promise.all([
      db.book.count(),
      db.inventory.count(),
      db.transaction.count({ where: { status: "active" } }),
      db.transaction.count({ where: { status: "returned" } }),
      db.user.count(),
      db.knowledgeBase.count(),
      db.transaction.count({
        where: {
          status: "active",
          dueDate: { lt: now },
        },
      }),
    ]);

    // Calculate change from last month for stats comparison
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const [
      booksLastMonth,
      borrowsLastMonth,
      completedLastMonth,
      usersLastMonth,
      knowledgeLastMonth,
    ] = await Promise.all([
      db.book.count({ where: { createdAt: { lt: oneMonthAgo } } }),
      db.transaction.count({
        where: { status: "active", borrowDate: { lt: oneMonthAgo } },
      }),
      db.transaction.count({
        where: { status: "returned", returnDate: { lt: oneMonthAgo } },
      }),
      db.user.count({ where: { createdAt: { lt: oneMonthAgo } } }),
      db.knowledgeBase.count({ where: { createdAt: { lt: oneMonthAgo } } }),
    ]);

    return NextResponse.json({
      totalBooks,
      totalInventory,
      activeBorrows,
      completedBorrows,
      totalUsers,
      totalKnowledge,
      overdueCount,
      changes: {
        books: totalBooks - booksLastMonth,
        borrows: activeBorrows - borrowsLastMonth,
        completed: completedBorrows - completedLastMonth,
        users: totalUsers - usersLastMonth,
        knowledge: totalKnowledge - knowledgeLastMonth,
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

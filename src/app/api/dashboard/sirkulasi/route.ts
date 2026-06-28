import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const skip = (page - 1) * limit;
    const tab = searchParams.get("tab") || "active"; // active | history | fines

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    // ===== STATS =====
    const [activeBorrows, overdueCount, dueTodayCount] = await Promise.all([
      db.transaction.count({ where: { status: "active" } }),
      db.transaction.count({
        where: { status: "active", dueDate: { lt: todayStart } },
      }),
      db.transaction.count({
        where: {
          status: "active",
          dueDate: { gte: todayStart, lt: todayEnd },
        },
      }),
    ]);

    // Active members (unique users with active transactions)
    const activeMembers = await db.transaction.findMany({
      where: { status: "active" },
      select: { userId: true },
      distinct: ["userId"],
    });

    // Denda summary
    const unpaidFines = await db.fine.findMany({
      where: { status: "unpaid" },
      select: { amount: true },
    });
    const totalDenda = unpaidFines.reduce((sum, f) => sum + f.amount, 0);

    // Normal count (active but not overdue and not due today)
    const normalCount = activeBorrows - overdueCount - dueTodayCount;

    // Due in 3 days
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    const dueIn3Days = await db.transaction.count({
      where: {
        status: "active",
        dueDate: { gt: todayEnd, lte: threeDaysFromNow },
      },
    });

    // ===== TRANSACTIONS (with search, filter, pagination) =====
    let txWhere: any = {};
    
    if (tab === "active") {
      txWhere.status = { in: ["active"] };
      // Include overdue as well (active past due date)
    } else if (tab === "history") {
      txWhere.status = "returned";
    }

    // For status filter within active tab
    if (tab === "active" && status) {
      if (status === "overdue") {
        txWhere.dueDate = { lt: todayStart };
      } else if (status === "dueToday") {
        txWhere.dueDate = { gte: todayStart, lt: todayEnd };
      } else if (status === "normal") {
        txWhere.dueDate = { gte: todayEnd };
      }
    }

    // Search by user name or book title
    if (search) {
      txWhere.OR = [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { inventory: { book: { title: { contains: search, mode: "insensitive" } } } },
      ];
    }

    // Category filter
    if (category) {
      txWhere.inventory = {
        ...txWhere.inventory,
        book: {
          ...txWhere.inventory?.book,
          category: category,
        },
      };
    }

    const [transactions, totalTx] = await Promise.all([
      db.transaction.findMany({
        where: txWhere,
        include: {
          user: { select: { id: true, name: true, email: true, role: true } },
          inventory: { include: { book: { select: { title: true, author: true, cover: true, category: true } } } },
          fines: true,
        },
        orderBy: { borrowDate: "desc" },
        skip,
        take: limit,
      }),
      db.transaction.count({ where: txWhere }),
    ]);

    // Count tabs
    const [activeCount, historyCount, finesCount] = await Promise.all([
      db.transaction.count({ where: { status: "active" } }),
      db.transaction.count({ where: { status: "returned" } }),
      db.fine.count({ where: { status: "unpaid" } }),
    ]);

    // Format transactions
    const formattedTx = transactions.map((t) => {
      const dueDate = new Date(t.dueDate);
      const isOverdue = t.status === "active" && dueDate < todayStart;
      const isDueToday = t.status === "active" && dueDate >= todayStart && dueDate < todayEnd;
      const daysLate = isOverdue
        ? Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;
      const fineAmount = t.fines.reduce((sum, f) => sum + f.amount, 0) || (daysLate > 0 ? Math.min(daysLate * 1000, 50000) : 0);

      return {
        id: t.id,
        userId: t.userId,
        userName: t.user.name,
        userEmail: t.user.email,
        userRole: t.user.role,
        bookTitle: t.inventory.book.title,
        bookAuthor: t.inventory.book.author,
        bookCover: t.inventory.book.cover,
        bookCategory: t.inventory.book.category,
        borrowDate: t.borrowDate.toISOString(),
        dueDate: t.dueDate.toISOString(),
        returnDate: t.returnDate ? t.returnDate.toISOString() : null,
        status: isOverdue ? "overdue" : isDueToday ? "dueToday" : t.status,
        daysLate,
        fineAmount,
        fines: t.fines,
      };
    });

    // ===== FINES LIST (for fines tab) =====
    let finesList: any[] = [];
    if (tab === "fines") {
      const fines = await db.fine.findMany({
        where: { status: "unpaid" },
        include: {
          transaction: {
            include: {
              user: { select: { name: true, email: true } },
              inventory: { include: { book: { select: { title: true, author: true, cover: true } } } },
            },
          },
        },
        orderBy: { id: "desc" },
        skip,
        take: limit,
      });

      finesList = fines.map((f) => ({
        id: f.id,
        amount: f.amount,
        status: f.status,
        userName: f.transaction.user.name,
        userEmail: f.transaction.user.email,
        bookTitle: f.transaction.inventory.book.title,
        bookAuthor: f.transaction.inventory.book.author,
        bookCover: f.transaction.inventory.book.cover,
        transactionId: f.transactionId,
        createdAt: f.transaction.borrowDate.toISOString().split("T")[0],
      }));
    }

    // Get unique categories for filter
    const categories = await db.book.findMany({
      select: { category: true },
      distinct: ["category"],
    });

    return NextResponse.json({
      stats: {
        activeBorrows,
        activeMembers: activeMembers.length,
        dueTodayCount,
        overdueCount,
        normalCount: Math.max(0, normalCount),
        totalDenda,
        dueIn3Days,
      },
      tabCounts: {
        active: activeCount,
        history: historyCount,
        fines: finesCount,
      },
      transactions: formattedTx,
      finesList,
      total: tab === "fines" ? finesCount : totalTx,
      page,
      limit,
      totalPages: Math.ceil((tab === "fines" ? finesCount : totalTx) / limit),
      categories: categories.map((c) => c.category),
    });
  } catch (error) {
    console.error("Sirkulasi API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

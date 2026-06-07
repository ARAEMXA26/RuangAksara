import { NextResponse } from "next/server";
import { tryDb } from "@/lib/db";
import { mockTransactions, mockInventory, mockBooks } from "@/lib/mockData";

// GET /api/circulation/transaction?userId=...
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const dbResult = await tryDb(async (db) => {
      const where = userId ? { userId } : {};
      const transactions = await db.transaction.findMany({
        where,
        include: {
          inventory: { include: { book: true } },
          fines: true,
          user: { select: { name: true, email: true } },
        },
        orderBy: { borrowDate: "desc" },
      });

      return transactions.map((t) => ({
        id: t.id,
        userId: t.userId,
        userName: t.user.name,
        bookTitle: t.inventory.book.title,
        bookCover: t.inventory.book.cover,
        inventoryId: t.inventoryId,
        borrowDate: t.borrowDate.toISOString().split("T")[0],
        dueDate: t.dueDate.toISOString().split("T")[0],
        returnDate: t.returnDate ? t.returnDate.toISOString().split("T")[0] : null,
        status: t.status,
        fines: t.fines,
      }));
    });

    if (dbResult) {
      return NextResponse.json({ transactions: dbResult });
    }

    // Fallback
    const filtered = userId
      ? mockTransactions.filter((t) => t.user_id === userId)
      : mockTransactions;

    const transactions = filtered.map((t) => {
      const inv = mockInventory.find((i) => i.id === t.inventory_id);
      const book = inv ? mockBooks.find((b) => b.id === inv.book_id) : null;
      return {
        id: t.id,
        userId: t.user_id,
        bookTitle: book?.title || "Unknown",
        bookCover: book?.cover || "📘",
        inventoryId: t.inventory_id,
        borrowDate: t.borrow_date,
        dueDate: t.due_date,
        returnDate: t.return_date,
        status: t.status,
        fines: [],
      };
    });
    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/circulation/transaction — Borrow a book
export async function POST(req) {
  try {
    const { userId, inventoryId, bookId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const dbResult = await tryDb(async (db) => {
      // If bookId is provided instead of inventoryId, find available inventory
      let targetInventoryId = inventoryId;
      if (!targetInventoryId && bookId) {
        const availableInv = await db.inventory.findFirst({
          where: { bookId, status: "available" },
        });
        if (!availableInv) return { error: "Buku tidak tersedia", status: 400 };
        targetInventoryId = availableInv.id;
      }

      if (!targetInventoryId) return { error: "Missing inventoryId", status: 400 };

      const inventory = await db.inventory.findUnique({ where: { id: targetInventoryId } });
      if (!inventory || inventory.status !== "available") {
        return { error: "Buku tidak tersedia", status: 400 };
      }

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      const transaction = await db.transaction.create({
        data: { userId, inventoryId: targetInventoryId, dueDate, status: "active" },
      });

      await db.inventory.update({
        where: { id: targetInventoryId },
        data: { status: "borrowed" },
      });

      return { transaction, status: 201 };
    });

    if (dbResult) {
      if (dbResult.error) {
        return NextResponse.json({ error: dbResult.error }, { status: dbResult.status });
      }
      return NextResponse.json({ transaction: dbResult.transaction }, { status: 201 });
    }

    // Fallback demo
    return NextResponse.json({
      transaction: { id: "demo_" + Date.now(), status: "active" },
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH /api/circulation/transaction — Return a book
export async function PATCH(req) {
  try {
    const { transactionId } = await req.json();

    if (!transactionId) {
      return NextResponse.json({ error: "Missing transactionId" }, { status: 400 });
    }

    const dbResult = await tryDb(async (db) => {
      const transaction = await db.transaction.findUnique({ where: { id: transactionId } });
      if (!transaction) return { error: "Transaction not found", status: 404 };

      const now = new Date();
      const dueDate = new Date(transaction.dueDate);
      const daysLate = Math.max(0, Math.floor((now - dueDate) / (1000 * 60 * 60 * 24)));
      const fineAmount = Math.min(daysLate * 1000, 50000);

      await db.transaction.update({
        where: { id: transactionId },
        data: { returnDate: now, status: "returned" },
      });

      await db.inventory.update({
        where: { id: transaction.inventoryId },
        data: { status: "available" },
      });

      if (fineAmount > 0) {
        await db.fine.create({
          data: { transactionId, amount: fineAmount, status: "unpaid" },
        });
      }

      return {
        success: true,
        daysLate,
        fineAmount,
        message: daysLate > 0
          ? `Buku dikembalikan. Denda keterlambatan ${daysLate} hari: Rp ${fineAmount.toLocaleString("id-ID")}`
          : "Buku berhasil dikembalikan. Tidak ada denda.",
      };
    });

    if (dbResult) {
      if (dbResult.error) {
        return NextResponse.json({ error: dbResult.error }, { status: dbResult.status });
      }
      return NextResponse.json(dbResult);
    }

    // Fallback demo
    return NextResponse.json({ success: true, daysLate: 0, fineAmount: 0, message: "Buku berhasil dikembalikan!" });
  } catch (error) {
    console.error("Error returning book:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

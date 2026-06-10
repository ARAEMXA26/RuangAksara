import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/circulation/transaction?userId=...
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const where = userId ? { userId } : {};
    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        inventory: { include: { book: true } },
        fines: true,
        user: { select: { name: true, email: true } },
      },
      orderBy: { borrowDate: "desc" },
    });

    const formattedTransactions = transactions.map((t) => ({
      id: t.id,
      userId: t.userId,
      userName: t.user.name,
      bookTitle: t.inventory.book.title,
      bookAuthor: t.inventory.book.author,
      bookCover: t.inventory.book.cover,
      inventoryId: t.inventoryId,
      borrowDate: t.borrowDate.toISOString().split("T")[0],
      dueDate: t.dueDate.toISOString().split("T")[0],
      returnDate: t.returnDate ? t.returnDate.toISOString().split("T")[0] : null,
      status: t.status,
      fines: t.fines,
    }));

    return NextResponse.json({ transactions: formattedTransactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/circulation/transaction — Borrow a book
export async function POST(req: Request) {
  try {
    const { userId, inventoryId, bookId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // If bookId is provided instead of inventoryId, find available inventory
    let targetInventoryId = inventoryId;
    if (!targetInventoryId && bookId) {
      const availableInv = await prisma.inventory.findFirst({
        where: { bookId, status: "available" },
      });
      if (!availableInv) return NextResponse.json({ error: "Buku tidak tersedia" }, { status: 400 });
      targetInventoryId = availableInv.id;
    }

    if (!targetInventoryId) {
      return NextResponse.json({ error: "Missing inventoryId" }, { status: 400 });
    }

    const inventory = await prisma.inventory.findUnique({ where: { id: targetInventoryId } });
    if (!inventory || inventory.status !== "available") {
      return NextResponse.json({ error: "Buku tidak tersedia" }, { status: 400 });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const transaction = await prisma.transaction.create({
      data: { userId, inventoryId: targetInventoryId, dueDate, status: "active" },
    });

    await prisma.inventory.update({
      where: { id: targetInventoryId },
      data: { status: "borrowed" },
    });

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH /api/circulation/transaction — Return a book
export async function PATCH(req: Request) {
  try {
    const { transactionId } = await req.json();

    if (!transactionId) {
      return NextResponse.json({ error: "Missing transactionId" }, { status: 400 });
    }

    const transaction = await prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const now = new Date();
    const dueDate = new Date(transaction.dueDate);
    const daysLate = Math.max(0, Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
    const fineAmount = Math.min(daysLate * 1000, 50000);

    await prisma.transaction.update({
      where: { id: transactionId },
      data: { returnDate: now, status: "returned" },
    });

    await prisma.inventory.update({
      where: { id: transaction.inventoryId },
      data: { status: "available" },
    });

    if (fineAmount > 0) {
      await prisma.fine.create({
        data: { transactionId, amount: fineAmount, status: "unpaid" },
      });
    }

    return NextResponse.json({
      success: true,
      daysLate,
      fineAmount,
      message: daysLate > 0
        ? `Buku dikembalikan. Denda keterlambatan ${daysLate} hari: Rp ${fineAmount.toLocaleString("id-ID")}`
        : "Buku berhasil dikembalikan. Tidak ada denda.",
    });
  } catch (error) {
    console.error("Error returning book:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

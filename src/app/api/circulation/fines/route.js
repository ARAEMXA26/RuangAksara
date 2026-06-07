import { NextResponse } from "next/server";
import { tryDb } from "@/lib/db";
import { mockFines } from "@/lib/mockData";

// GET /api/circulation/fines?userId=...
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const dbResult = await tryDb(async (db) => {
      const where = userId
        ? { transaction: { userId } }
        : {};

      const fines = await db.fine.findMany({
        where,
        include: {
          transaction: {
            include: {
              inventory: { include: { book: true } },
              user: { select: { name: true } },
            },
          },
        },
      });

      return fines.map((f) => ({
        id: f.id,
        transactionId: f.transactionId,
        amount: f.amount,
        status: f.status,
        bookTitle: f.transaction.inventory.book.title,
        userName: f.transaction.user.name,
      }));
    });

    if (dbResult) {
      return NextResponse.json({ fines: dbResult });
    }

    // Fallback
    return NextResponse.json({ fines: mockFines });
  } catch (error) {
    console.error("Error fetching fines:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/circulation/fines — Pay a fine
export async function POST(req) {
  try {
    const { fineId } = await req.json();

    if (!fineId) {
      return NextResponse.json({ error: "Missing fineId" }, { status: 400 });
    }

    const dbResult = await tryDb(async (db) => {
      await db.fine.update({
        where: { id: fineId },
        data: { status: "paid" },
      });
      return { success: true };
    });

    if (dbResult) {
      return NextResponse.json({ success: true, message: "Pembayaran denda berhasil!" });
    }

    // Fallback
    return NextResponse.json({ success: true, message: "Pembayaran denda berhasil! (Demo)" });
  } catch (error) {
    console.error("Error paying fine:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

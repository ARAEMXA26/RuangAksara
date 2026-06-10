import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/circulation/fines?userId=...
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const where = userId ? { transaction: { userId } } : {};

    const fines = await prisma.fine.findMany({
      where,
      include: {
        transaction: {
          include: {
            user: { select: { name: true, email: true } },
            inventory: { include: { book: { select: { title: true } } } },
          }
        }
      }
    });

    const formattedFines = fines.map(f => ({
      id: f.id,
      transactionId: f.transactionId,
      userName: f.transaction.user.name,
      bookTitle: f.transaction.inventory.book.title,
      amount: f.amount,
      status: f.status,
    }));

    return NextResponse.json({ fines: formattedFines });
  } catch (error) {
    console.error("Error fetching fines:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

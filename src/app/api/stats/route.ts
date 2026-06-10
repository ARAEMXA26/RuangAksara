import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const totalUsers = await prisma.user.count();
    const totalBooks = await prisma.inventory.count(); // Count of physical copies, or book.count() for distinct titles.
    
    // Overdue = status is 'active' and dueDate < now
    const overdueCount = await prisma.transaction.count({
      where: {
        status: "active",
        dueDate: {
          lt: new Date()
        }
      }
    });

    const pendingReservations = await prisma.reservation.count({
      where: {
        status: "pending"
      }
    });

    return NextResponse.json({
      totalUsers,
      totalBooks,
      overdueCount,
      pendingReservations
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

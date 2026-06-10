import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  try {
    if (userId) {
      const reservations = await prisma.reservation.findMany({
        where: { userId },
        include: {
          book: true
        },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json({ reservations });
    } else {
      // For admin dashboard, get all reservations
      const reservations = await prisma.reservation.findMany({
        include: {
          book: true,
          user: true
        },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json({ reservations });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, bookId } = await req.json();

    if (!userId || !bookId) {
      return NextResponse.json({ error: "userId and bookId are required" }, { status: 400 });
    }

    const existing = await prisma.reservation.findFirst({
      where: {
        userId,
        bookId,
        status: "pending"
      }
    });

    if (existing) {
      return NextResponse.json({ error: "You already have a pending reservation for this book" }, { status: 400 });
    }

    const reservation = await prisma.reservation.create({
      data: {
        userId,
        bookId,
        status: "pending"
      }
    });

    return NextResponse.json({ message: "Reservation created successfully", reservation });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create reservation" }, { status: 500 });
  }
}

// PATCH to update reservation status (for Admin)
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ message: "Reservation updated", reservation: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update reservation" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        book: true
      }
    });

    return NextResponse.json({ bookmarks });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, bookId } = await req.json();

    if (!userId || !bookId) {
      return NextResponse.json({ error: "userId and bookId are required" }, { status: 400 });
    }

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId
        }
      }
    });

    if (existing) {
      // if exists, we remove it (toggle behavior)
      await prisma.bookmark.delete({
        where: { id: existing.id }
      });
      return NextResponse.json({ message: "Bookmark removed", bookmarked: false });
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        bookId
      }
    });

    return NextResponse.json({ message: "Bookmark added", bookmarked: true, bookmark });
  } catch (error) {
    return NextResponse.json({ error: "Failed to toggle bookmark" }, { status: 500 });
  }
}

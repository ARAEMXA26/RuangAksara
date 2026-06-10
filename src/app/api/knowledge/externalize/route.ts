import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/knowledge/externalize
export async function GET() {
  try {
    const items = await prisma.knowledgeBase.findMany({
      include: {
        author: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedItems = items.map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      createdBy: item.createdBy,
      authorName: item.author.name,
      createdAt: item.createdAt.toISOString().split("T")[0],
    }));

    return NextResponse.json({ items: formattedItems });
  } catch (error) {
    console.error("Error fetching knowledge:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/knowledge/externalize
export async function POST(req: Request) {
  try {
    const { title, content, userId } = await req.json();

    if (!title || !content || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const item = await prisma.knowledgeBase.create({
      data: { title, content, createdBy: userId },
      include: { author: { select: { name: true } } },
    });

    return NextResponse.json({
      item: {
        id: item.id,
        title: item.title,
        content: item.content,
        createdBy: item.createdBy,
        authorName: item.author.name,
        createdAt: item.createdAt.toISOString().split("T")[0],
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating knowledge:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/knowledge/externalize
export async function GET() {
  try {
    const items = await db.knowledgeBase.findMany({
      include: {
        author: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedItems = items.map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      category: item.category,
      access: item.access,
      createdBy: item.createdBy,
      authorName: item.author?.name || "Pustakawan",
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
    const { title, content, userId, category, access } = await req.json();

    if (!title || !content || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const item = await db.knowledgeBase.create({
      data: { 
        title, 
        content, 
        createdBy: userId,
        category: category || "SOP & Panduan",
        access: access || "Terbuka"
      },
      include: { author: { select: { name: true } } },
    });

    return NextResponse.json({
      item: {
        id: item.id,
        title: item.title,
        content: item.content,
        category: item.category,
        access: item.access,
        createdBy: item.createdBy,
        authorName: item.author?.name || "Pustakawan",
        createdAt: item.createdAt.toISOString().split("T")[0],
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating knowledge:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH /api/knowledge/externalize
export async function PATCH(req: Request) {
  try {
    const { id, title, content, category, access } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const item = await db.knowledgeBase.update({
      where: { id },
      data: {
        title,
        content,
        category,
        access,
      },
      include: { author: { select: { name: true } } },
    });

    return NextResponse.json({
      item: {
        id: item.id,
        title: item.title,
        content: item.content,
        category: item.category,
        access: item.access,
        createdBy: item.createdBy,
        authorName: item.author?.name || "Pustakawan",
        createdAt: item.createdAt.toISOString().split("T")[0],
      }
    });
  } catch (error) {
    console.error("Error updating knowledge:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/knowledge/externalize
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        if (body.id) {
          await db.knowledgeBase.delete({ where: { id: body.id } });
          return NextResponse.json({ message: "Deleted successfully" });
        }
      } catch {}
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await db.knowledgeBase.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting knowledge:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

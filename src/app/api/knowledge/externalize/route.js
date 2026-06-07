import { NextResponse } from "next/server";
import { tryDb } from "@/lib/db";
import { mockKnowledgeBase } from "@/lib/mockData";

// GET /api/knowledge/externalize
export async function GET() {
  try {
    const dbResult = await tryDb(async (db) => {
      const items = await db.knowledgeBase.findMany({
        include: {
          author: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      return items.map((item) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        createdBy: item.createdBy,
        authorName: item.author.name,
        createdAt: item.createdAt.toISOString().split("T")[0],
      }));
    });

    if (dbResult) {
      return NextResponse.json({ items: dbResult });
    }

    // Fallback
    const items = mockKnowledgeBase.map((kb) => ({
      ...kb,
      title: "",
      authorName: "Pustakawan",
      createdAt: kb.created_at,
    }));
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching knowledge:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/knowledge/externalize
export async function POST(req) {
  try {
    const { title, content, userId } = await req.json();

    if (!title || !content || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const dbResult = await tryDb(async (db) => {
      const item = await db.knowledgeBase.create({
        data: { title, content, createdBy: userId },
        include: { author: { select: { name: true } } },
      });

      return {
        id: item.id,
        title: item.title,
        content: item.content,
        createdBy: item.createdBy,
        authorName: item.author.name,
        createdAt: item.createdAt.toISOString().split("T")[0],
      };
    });

    if (dbResult) {
      return NextResponse.json({ item: dbResult }, { status: 201 });
    }

    // Fallback
    return NextResponse.json({
      item: {
        id: "kb_" + Date.now(),
        title,
        content,
        createdBy: userId,
        authorName: "Pustakawan",
        createdAt: new Date().toISOString().split("T")[0],
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating knowledge:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

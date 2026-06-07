import { NextResponse } from "next/server";
import { tryDb } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const firebaseUid = searchParams.get("uid");

    if (!firebaseUid) {
      return NextResponse.json({ error: "Missing uid parameter" }, { status: 400 });
    }

    const dbResult = await tryDb(async (db) => {
      return await db.user.findUnique({ where: { firebaseUid } });
    });

    if (dbResult) {
      return NextResponse.json({ user: dbResult }, { status: 200 });
    }

    return NextResponse.json({ error: "Database not configured" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

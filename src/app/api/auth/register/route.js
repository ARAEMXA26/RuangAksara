import { NextResponse } from "next/server";
import { tryDb } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, name, role, firebaseUid } = body;

    if (!email || !name || !role || !firebaseUid) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const borrowLimit = role === "dosen" ? 5 : role === "pustakawan" ? 10 : 3;

    const dbResult = await tryDb(async (db) => {
      return await db.user.create({
        data: { firebaseUid, email, name, role, borrowLimit },
      });
    });

    if (dbResult) {
      return NextResponse.json({ user: dbResult }, { status: 201 });
    }

    // Fallback
    return NextResponse.json({
      user: {
        id: "temp_" + Date.now(),
        firebaseUid,
        email,
        name,
        role,
        borrowLimit,
        createdAt: new Date().toISOString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

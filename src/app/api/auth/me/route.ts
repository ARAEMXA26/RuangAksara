import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const firebaseUid = searchParams.get("uid");

    if (!firebaseUid) {
      return NextResponse.json({ error: "Missing uid parameter" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { firebaseUid } });

    if (user) {
      return NextResponse.json({ user }, { status: 200 });
    }

    return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

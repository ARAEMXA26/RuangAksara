import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/auth/verify
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idToken, email } = body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const sessionData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        borrow_limit: user.borrowLimit,
      },
      token: `session_${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    return NextResponse.json(sessionData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}

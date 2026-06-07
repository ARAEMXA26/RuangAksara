import { NextResponse } from "next/server";
import { mockUsers } from "@/lib/mockData";

// POST /api/auth/verify
// Sequence Diagram UC1: Verify Firebase ID Token → Return session data
export async function POST(request) {
  try {
    const body = await request.json();
    const { idToken, email } = body;

    // In production: Verify token via Firebase Admin SDK
    // const decodedToken = await admin.auth().verifyIdToken(idToken);
    // const uid = decodedToken.uid;

    // Simulate: Query SELECT * FROM users WHERE firebase_uid = ?
    const user = mockUsers.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Generate session data
    const sessionData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        borrow_limit: user.borrow_limit,
      },
      token: `session_${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    // Return 200 OK (Data Sesi/Session)
    return NextResponse.json(sessionData, { status: 200 });
  } catch (error) {
    // Return Error (Invalid Credentials)
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}

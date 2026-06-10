import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email } = body;

    let usernameExists = false;
    let emailExists = false;
    
    if (username) {
      const u = await db.user.findUnique({ where: { username } });
      if (u) usernameExists = true;
    }
    
    if (email) {
      const e = await db.user.findUnique({ where: { email } });
      if (e) emailExists = true;
    }

    return NextResponse.json({
      available: !usernameExists && !emailExists,
      usernameAvailable: !usernameExists,
      emailAvailable: !emailExists,
    });
  } catch (error: any) {
    console.error("Check availability error:", error);
    
    // Provide user-friendly error messages for common DB errors
    const msg = error?.message || "";
    if (msg.includes("Can't reach database") || msg.includes("Connection refused") || msg.includes("ECONNREFUSED")) {
      return NextResponse.json(
        { error: "Database sedang tidak tersedia. Silakan coba lagi nanti." },
        { status: 503 }
      );
    }
    if (msg.includes("denied") || msg.includes("authentication")) {
      return NextResponse.json(
        { error: "Koneksi database gagal. Silakan hubungi administrator." },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: "Terjadi kesalahan server. Silakan coba beberapa saat lagi." },
      { status: 500 }
    );
  }
}

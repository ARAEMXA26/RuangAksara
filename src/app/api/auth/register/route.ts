import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, role, firebaseUid } = body;

    if (!email || !name || !role || !firebaseUid) {
      return NextResponse.json({ error: "Data registrasi tidak lengkap." }, { status: 400 });
    }

    // Use the name as the username (the form's "username" field is passed as "name")
    const username = name.toLowerCase().replace(/\s+/g, "");

    // Verify uniqueness first to avoid ugly constraint errors
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email },
          { firebaseUid },
          { username }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json({ error: "Username sudah digunakan." }, { status: 409 });
      }
      return NextResponse.json({ error: "Akun dengan email ini sudah terdaftar." }, { status: 409 });
    }

    const borrowLimit = role === "dosen" ? 5 : role === "pustakawan" ? 10 : 3;

    const newUser = await db.user.create({
      data: { 
        firebaseUid, 
        email, 
        name,
        username,
        role, 
        borrowLimit 
      },
    });

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user in database:", error);
    
    const msg = error?.message || "";
    if (msg.includes("Can't reach database") || msg.includes("Connection refused") || msg.includes("ECONNREFUSED")) {
      return NextResponse.json(
        { error: "Database sedang tidak tersedia. Akun Firebase telah dibuat tetapi data belum tersimpan. Silakan hubungi admin." },
        { status: 503 }
      );
    }
    if (msg.includes("denied") || msg.includes("authentication")) {
      return NextResponse.json(
        { error: "Koneksi database gagal. Silakan hubungi administrator." },
        { status: 503 }
      );
    }
    if (msg.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Akun dengan data ini sudah terdaftar." },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Gagal menyimpan data pengguna. Silakan coba lagi." },
      { status: 500 }
    );
  }
}

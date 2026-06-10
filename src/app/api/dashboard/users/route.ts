import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET — List users with search, filter, pagination
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }
    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          firebaseUid: true,
          _count: {
            select: {
              transactions: true,
            },
          },
        },
      }),
      db.user.count({ where }),
    ]);

    // Determine status based on recent activity
    const usersWithStatus = users.map((u) => ({
      ...u,
      status: "Aktif", // All DB users are active by default
      transactionCount: u._count.transactions,
    }));

    return NextResponse.json({
      users: usersWithStatus,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH — Update user role
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, role, name } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const updateData: any = {};
    if (role) updateData.role = role;
    if (name) updateData.name = name;

    const user = await db.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE — Delete user
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Delete related records first
    await db.bookmark.deleteMany({ where: { userId: id } });
    await db.reservation.deleteMany({ where: { userId: id } });

    // Check for active transactions
    const activeTransactions = await db.transaction.count({
      where: { userId: id, status: { in: ["active", "overdue"] } },
    });

    if (activeTransactions > 0) {
      return NextResponse.json(
        { error: "User masih memiliki peminjaman aktif. Selesaikan terlebih dahulu." },
        { status: 400 }
      );
    }

    // Delete fines for user's transactions
    const userTransactions = await db.transaction.findMany({
      where: { userId: id },
      select: { id: true },
    });
    const txIds = userTransactions.map((t) => t.id);
    if (txIds.length > 0) {
      await db.fine.deleteMany({ where: { transactionId: { in: txIds } } });
    }
    await db.transaction.deleteMany({ where: { userId: id } });
    await db.knowledgeBase.deleteMany({ where: { createdBy: id } });

    await db.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

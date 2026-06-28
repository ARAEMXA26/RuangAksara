import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PREDEFINED_RACKS = [
  { name: "Lantai 1, Rak B-1", category: "Bisnis", maxCapacity: 5 },
  { name: "Lantai 1, Rak B-2", category: "Bisnis", maxCapacity: 5 },
  { name: "Lantai 1, Rak C-2", category: "Teknologi", maxCapacity: 8 },
  { name: "Lantai 1, Rak C-5", category: "Teknologi", maxCapacity: 8 },
  { name: "Lantai 1, Rak D-1", category: "Teknologi", maxCapacity: 8 },
  { name: "Lantai 1, Rak H-1", category: "Hukum", maxCapacity: 5 },
  { name: "Lantai 1, Rak H-2", category: "Hukum", maxCapacity: 5 },
  { name: "Lantai 2, Rak A-1", category: "Teknologi", maxCapacity: 10 },
  { name: "Lantai 2, Rak A-3", category: "Teknologi", maxCapacity: 10 },
  { name: "Lantai 2, Rak A-4", category: "Teknologi", maxCapacity: 10 },
  { name: "Lantai 2, Rak J-1", category: "Pendidikan", maxCapacity: 5 },
  { name: "Lantai 2, Rak J-2", category: "Pendidikan", maxCapacity: 5 },
  { name: "Lantai 2, Rak S-1", category: "Sosial", maxCapacity: 5 },
  { name: "Lantai 2, Rak S-2", category: "Sosial", maxCapacity: 5 },
  { name: "Lantai 3, Rak B-2", category: "Teknologi", maxCapacity: 10 },
  { name: "Lantai 3, Rak B-6", category: "Teknologi", maxCapacity: 10 },
  { name: "Lantai 3, Rak K-1", category: "Kesehatan", maxCapacity: 5 },
  { name: "Lantai 3, Rak K-2", category: "Kesehatan", maxCapacity: 5 },
  { name: "Lantai 3, Rak R-1", category: "Repository", maxCapacity: 8 }
];

export async function GET() {
  try {
    // Count current inventory items grouped by locationRack
    const counts = await prisma.inventory.groupBy({
      by: ["locationRack"],
      _count: {
        id: true
      }
    });

    const countsMap = counts.reduce((acc: any, cur: any) => {
      if (cur.locationRack) {
        acc[cur.locationRack] = cur._count.id;
      }
      return acc;
    }, {});

    const racks = PREDEFINED_RACKS.map(rack => {
      const currentCount = countsMap[rack.name] || 0;
      return {
        ...rack,
        currentCount,
        availableCapacity: Math.max(0, rack.maxCapacity - currentCount)
      };
    });

    return NextResponse.json({ racks });
  } catch (error) {
    console.error("Error fetching racks:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

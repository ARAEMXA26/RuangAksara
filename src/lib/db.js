// src/lib/db.js
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

let db;

try {
  db = globalForPrisma.prisma || new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
} catch (error) {
  console.warn("Prisma Client not available:", error.message);
  db = null;
}

// Helper: try a DB query, return null on connection failure so API can fallback
export async function tryDb(queryFn) {
  if (!db) return null;
  try {
    return await queryFn(db);
  } catch (error) {
    if (
      error.constructor?.name === "PrismaClientInitializationError" ||
      error.message?.includes("Can't reach database server")
    ) {
      console.warn("Database not reachable, falling back to mock data.");
      return null;
    }
    throw error; // Re-throw non-connection errors
  }
}

export { db };

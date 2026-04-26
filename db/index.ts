import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// ✅ Better pool config
const pool =
  (global as any).pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

// prevent multiple pools in dev (IMPORTANT)
if (process.env.NODE_ENV !== "production") {
  (global as any).pgPool = pool;
}

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ["error"], // optional (good for debugging)
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
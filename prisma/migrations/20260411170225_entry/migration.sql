-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('AAY', 'SYF', 'PHH');

-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" INTEGER NOT NULL,
    "cardType" "CardType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

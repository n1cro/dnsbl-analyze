-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PROCESSED', 'FAILED', 'QUEUED');

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cidr" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'QUEUED',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMPTZ(3),
    "blocklists" JSONB[],

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

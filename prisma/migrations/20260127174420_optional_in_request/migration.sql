-- AlterTable
ALTER TABLE "Request" ALTER COLUMN "rejectedReason" DROP NOT NULL,
ALTER COLUMN "approvedBy" DROP NOT NULL,
ALTER COLUMN "approvedRejectedAt" DROP NOT NULL;

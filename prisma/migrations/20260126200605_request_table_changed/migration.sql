/*
  Warnings:

  - You are about to drop the column `approvedAt` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `comments` on the `Request` table. All the data in the column will be lost.
  - Added the required column `approvedRejectedAt` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pointers` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Request" DROP COLUMN "approvedAt",
DROP COLUMN "comments",
ADD COLUMN     "approvedRejectedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "pointers" INTEGER NOT NULL,
ADD COLUMN     "type" "Type" NOT NULL;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

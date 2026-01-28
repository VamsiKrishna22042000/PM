/*
  Warnings:

  - You are about to drop the column `starTime` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `starTime` on the `Task` table. All the data in the column will be lost.
  - Added the required column `startTime` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "starTime",
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "starTime",
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

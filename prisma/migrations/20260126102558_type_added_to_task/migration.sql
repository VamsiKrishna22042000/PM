-- CreateEnum
CREATE TYPE "Type" AS ENUM ('Story', 'Bug', 'TechDeb', 'Task');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "type" "Type" NOT NULL DEFAULT 'Story';

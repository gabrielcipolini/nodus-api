/*
  Warnings:

  - The `newStatus` column on the `task_history` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "task_history" DROP COLUMN "newStatus",
ADD COLUMN     "newStatus" "TaskStatus";

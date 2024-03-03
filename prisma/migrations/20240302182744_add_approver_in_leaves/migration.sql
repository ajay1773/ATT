/*
  Warnings:

  - Added the required column `approvedBy` to the `Leave` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Leave" ADD COLUMN     "approvedBy" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Leave" ADD CONSTRAINT "Leave_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `approvedBy` on the `Leave` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "LeaveStatus" ADD VALUE 'PENDING';

-- DropForeignKey
ALTER TABLE "Leave" DROP CONSTRAINT "Leave_approvedBy_fkey";

-- AlterTable
ALTER TABLE "Leave" DROP COLUMN "approvedBy";

-- CreateTable
CREATE TABLE "ApproverOnLeaves" (
    "userId" TEXT NOT NULL,
    "leaveId" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApproverOnLeaves_pkey" PRIMARY KEY ("userId","leaveId")
);

-- AddForeignKey
ALTER TABLE "ApproverOnLeaves" ADD CONSTRAINT "ApproverOnLeaves_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApproverOnLeaves" ADD CONSTRAINT "ApproverOnLeaves_leaveId_fkey" FOREIGN KEY ("leaveId") REFERENCES "Leave"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `LeavesCount` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LeaveType" AS ENUM ('PRIVILEGE_LEAVE', 'EARNED_LEAVE', 'CASUAL_LEAVE', 'SICK_LEAVE', 'MATERNITY_LEAVE', 'COMPENSATORY_OFF', 'MARRIAGE_LEAVE', 'PATERNITY_LEAVE', 'BEREAVEMENT_LEAVE', 'LOSS_OF_PAY');

-- DropForeignKey
ALTER TABLE "LeavesCount" DROP CONSTRAINT "LeavesCount_userId_fkey";

-- DropTable
DROP TABLE "LeavesCount";

-- CreateTable
CREATE TABLE "Leave" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Leave_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Leave" ADD CONSTRAINT "Leave_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

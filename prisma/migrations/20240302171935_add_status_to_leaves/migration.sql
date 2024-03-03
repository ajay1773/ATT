/*
  Warnings:

  - Added the required column `status` to the `Leave` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('APPROVED', 'REJECTED', 'CONSUMED');

-- AlterTable
ALTER TABLE "Leave" ADD COLUMN     "status" "LeaveStatus" NOT NULL;

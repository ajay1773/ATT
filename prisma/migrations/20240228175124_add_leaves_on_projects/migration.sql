/*
  Warnings:

  - You are about to drop the column `userId` on the `Leave` table. All the data in the column will be lost.
  - Added the required column `appliedBy` to the `Leave` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Leave` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Leave` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Leave` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Leave" DROP CONSTRAINT "Leave_userId_fkey";

-- AlterTable
ALTER TABLE "Leave" DROP COLUMN "userId",
ADD COLUMN     "appliedBy" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "type" "LeaveType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "LeavesOnProjects" (
    "leaveId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "LeavesOnProjects_pkey" PRIMARY KEY ("leaveId","projectId")
);

-- AddForeignKey
ALTER TABLE "LeavesOnProjects" ADD CONSTRAINT "LeavesOnProjects_leaveId_fkey" FOREIGN KEY ("leaveId") REFERENCES "Leave"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeavesOnProjects" ADD CONSTRAINT "LeavesOnProjects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leave" ADD CONSTRAINT "Leave_appliedBy_fkey" FOREIGN KEY ("appliedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

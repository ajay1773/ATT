/*
  Warnings:

  - You are about to drop the `LeavesOnProjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LeavesOnProjects" DROP CONSTRAINT "LeavesOnProjects_leaveId_fkey";

-- DropForeignKey
ALTER TABLE "LeavesOnProjects" DROP CONSTRAINT "LeavesOnProjects_projectId_fkey";

-- DropTable
DROP TABLE "LeavesOnProjects";

-- CreateTable
CREATE TABLE "_LeaveToProject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LeaveToProject_AB_unique" ON "_LeaveToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_LeaveToProject_B_index" ON "_LeaveToProject"("B");

-- AddForeignKey
ALTER TABLE "_LeaveToProject" ADD CONSTRAINT "_LeaveToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "Leave"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeaveToProject" ADD CONSTRAINT "_LeaveToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

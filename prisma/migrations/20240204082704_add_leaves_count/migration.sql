-- CreateTable
CREATE TABLE "LeavesCount" (
    "id" TEXT NOT NULL,
    "lopLeaveCount" INTEGER NOT NULL,
    "bereavementLeaveCount" INTEGER NOT NULL,
    "maternityLeaveCount" INTEGER NOT NULL,
    "sickLeaveCount" INTEGER NOT NULL,
    "earnedLeaveCount" INTEGER NOT NULL,
    "compensatoryOffCount" INTEGER NOT NULL,
    "paternityLeaveCount" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LeavesCount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeavesCount_year_key" ON "LeavesCount"("year");

-- CreateIndex
CREATE UNIQUE INDEX "LeavesCount_userId_key" ON "LeavesCount"("userId");

-- AddForeignKey
ALTER TABLE "LeavesCount" ADD CONSTRAINT "LeavesCount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

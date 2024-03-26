/*
  Warnings:

  - You are about to drop the `RegisteredLocationCoordinates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "RegisteredLocationCoordinates";

-- CreateTable
CREATE TABLE "GlobalSettings" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "shiftStartHour" TEXT NOT NULL,
    "shiftEndHour" TEXT NOT NULL,

    CONSTRAINT "GlobalSettings_pkey" PRIMARY KEY ("id")
);

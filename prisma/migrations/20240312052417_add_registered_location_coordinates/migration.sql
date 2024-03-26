-- CreateTable
CREATE TABLE "RegisteredLocationCoordinates" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RegisteredLocationCoordinates_pkey" PRIMARY KEY ("id")
);

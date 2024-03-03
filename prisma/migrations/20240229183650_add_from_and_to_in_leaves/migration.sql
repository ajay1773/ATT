/*
  Warnings:

  - Added the required column `from` to the `Leave` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `Leave` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Leave" ADD COLUMN     "from" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "to" TIMESTAMP(3) NOT NULL;

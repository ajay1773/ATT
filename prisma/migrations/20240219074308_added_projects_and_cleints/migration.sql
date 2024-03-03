/*
  Warnings:

  - Added the required column `roleGroup` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `roleName` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RoleNames" AS ENUM ('SOFTWARE_ENGINEER', 'FRONTEND_DEVELOPER', 'BACKEND_DEVELOPER', 'FULL_STACK_DEVELOPER', 'DEVOPS_ENGINEER', 'DATA_ENGINEER', 'MACHINE_LEARNING_ENGINEER', 'DATA_SCIENTIST', 'QUALITY_ASSURANCE_ENGINEER', 'TEST_AUTOMATION_ENGINEER', 'NETWORK_ENGINEER', 'SYSTEM_ADMINISTRATOR', 'SECURITY_ANALYST', 'PROJECT_MANAGER', 'PRODUCT_MANAGER', 'BUSINESS_ANALYST', 'TECHNICAL_WRITER', 'UX_UI_DESIGNER', 'GRAPHIC_DESIGNER', 'HR_MANAGER', 'RECRUITER', 'FINANCE_MANAGER', 'MARKETING_MANAGER', 'SALES_MANAGER', 'CUSTOMER_SUPPORT_SPECIALIST', 'ADMINISTRATIVE_ASSISTANT');

-- CreateEnum
CREATE TYPE "RoleGroup" AS ENUM ('TECHNICAL', 'NON_TECHNICAL');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roleGroup" "RoleGroup" NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ALTER COLUMN "phoneNo" SET DATA TYPE BIGINT,
DROP COLUMN "roleName",
ADD COLUMN     "roleName" "RoleNames" NOT NULL;

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "domain" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersOnProjects" (
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsersOnProjects_pkey" PRIMARY KEY ("userId","projectId")
);

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnProjects" ADD CONSTRAINT "UsersOnProjects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnProjects" ADD CONSTRAINT "UsersOnProjects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

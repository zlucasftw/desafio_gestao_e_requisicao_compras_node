/*
  Warnings:

  - Added the required column `updatedAt` to the `ApprovalHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ApprovalHistory` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

/*
  Warnings:

  - Made the column `createdBy` on table `Exam` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Exam` MODIFY `createdBy` INTEGER NOT NULL;

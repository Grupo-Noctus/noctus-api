/*
  Warnings:

  - Added the required column `createdBy` to the `PreEnrollment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PreEnrollment` ADD COLUMN `createdBy` INTEGER NOT NULL;

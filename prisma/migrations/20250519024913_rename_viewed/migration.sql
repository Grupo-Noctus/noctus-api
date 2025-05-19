/*
  Warnings:

  - You are about to drop the column `viewred` on the `ProgressVideo` table. All the data in the column will be lost.
  - Added the required column `viewed` to the `ProgressVideo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ProgressVideo` DROP COLUMN `viewred`,
    ADD COLUMN `viewed` INTEGER NOT NULL;

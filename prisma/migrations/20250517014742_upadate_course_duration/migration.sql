/*
  Warnings:

  - You are about to drop the column `durationInDays` on the `Course` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `Enrollment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Course` DROP COLUMN `durationInDays`,
    ADD COLUMN `duration` INTEGER NOT NULL,
    MODIFY `image` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Enrollment` ADD COLUMN `expiresAt` DATETIME(3) NOT NULL;

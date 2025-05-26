/*
  Warnings:

  - You are about to drop the column `idEnrrolment` on the `ProgressVideo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idEnrollment,idVideo]` on the table `ProgressVideo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idEnrollment` to the `ProgressVideo` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `ProgressVideo_idEnrrolment_idVideo_key` ON `ProgressVideo`;

-- AlterTable
ALTER TABLE `ProgressVideo` DROP COLUMN `idEnrrolment`,
    ADD COLUMN `idEnrollment` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ProgressVideo_idEnrollment_idVideo_key` ON `ProgressVideo`(`idEnrollment`, `idVideo`);

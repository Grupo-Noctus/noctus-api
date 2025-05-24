/*
  Warnings:

  - You are about to drop the column `courseId` on the `PreEnrrolment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,idCourse]` on the table `PreEnrrolment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idCourse` to the `PreEnrrolment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `PreEnrrolment_email_courseId_key` ON `PreEnrrolment`;

-- AlterTable
ALTER TABLE `PreEnrrolment` DROP COLUMN `courseId`,
    ADD COLUMN `idCourse` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `PreEnrrolment_email_idCourse_key` ON `PreEnrrolment`(`email`, `idCourse`);

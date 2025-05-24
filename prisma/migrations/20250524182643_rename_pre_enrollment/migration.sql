/*
  Warnings:

  - You are about to drop the `PreEnrrolment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `PreEnrrolment`;

-- CreateTable
CREATE TABLE `PreEnrollment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `idCourse` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PreEnrollment_email_idCourse_key`(`email`, `idCourse`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

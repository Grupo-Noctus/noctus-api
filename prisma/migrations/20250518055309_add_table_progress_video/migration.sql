-- CreateTable
CREATE TABLE `ProgressVideo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idVideo` INTEGER NOT NULL,
    `idEnrrolment` INTEGER NOT NULL,
    `viewred` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ProgressVideo_idEnrrolment_idVideo_key`(`idEnrrolment`, `idVideo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

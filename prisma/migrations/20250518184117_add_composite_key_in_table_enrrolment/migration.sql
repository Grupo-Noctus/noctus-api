/*
  Warnings:

  - A unique constraint covering the columns `[idStudent,idCourse]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Enrollment_idStudent_idCourse_key` ON `Enrollment`(`idStudent`, `idCourse`);

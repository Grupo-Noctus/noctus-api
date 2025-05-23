import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnrollmentRequestDto } from './dto/enrollment-request.dto';
import { EnrollmentUpdateDto } from './dto/enrollment-update.dto'; 
import { EnrollmentResponseDto } from './dto/enrollment-response.dto';
import { EnrollmentPaginationResponseDto } from './dto/enrollment-pagination-response.dto';
import { Prisma } from '@prisma/client';
import { handleAppError } from 'src/utils/handle-app-error.error';

@Injectable()
export class EnrollmentService {
  private readonly logger = new Logger (EnrollmentService.name);
  constructor(private readonly prisma: PrismaService) {}

  async createEnrollment(enrrolement: EnrollmentRequestDto, user: number): Promise<boolean> {
    try{
      const expiresAt = await this.calculateExpiredAt(enrrolement.idCourse);
      await this.prisma.enrollment.create({
        data: {
          student: {
              connect:{
                  id:enrrolement.idStudent
              }
          },
          course:{
              connect:{
                  id:enrrolement.idCourse
              }
          },
          expiresAt,
          active: true,
          completed: false, 
        },
      });
      return true;
    } catch (error){
      this.logger.error('Error in create enrrollment: ', error);
      handleAppError(error); 
    }
  }

  async getEnrollmentById(id: number): Promise<EnrollmentResponseDto> {
    try{
      const enrollment = await this.prisma.$queryRaw<EnrollmentResponseDto>(
      Prisma.sql`
        SELECT u.name, e.active, e.completed, e.expiredAt, c.name,
          FROM Enrollment e
          INNER JOIN Student s ON s.id = e.idStudent
          INNER JOIN User u ON u.id = s.idUser
          WHERE e.id = ${id}
      `);  
      if (!enrollment) {
        throw new NotFoundException('Enrollment not found');
      }
      return enrollment;
    }catch (error){ 
      this.logger.error(`Error fetching enrrollment by id ${id}: `, error);
      handleAppError(error); 
    }   
  }
  
  async updateEnrollment(idEnrollment: number, updateEnrollment: EnrollmentUpdateDto, user: number): Promise<boolean> {
    try{ 
      await this.prisma.enrollment.update({
        where: { id: idEnrollment },
        data: {
        ...updateEnrollment,
      },
    });
    return true;
    } catch (error) {
      this.logger.error(`Error in update enrrollment by id ${idEnrollment}: `, error);
      handleAppError(error);
    }
  }

  async deleteEnrollment(idEnrollment: number) {
    try{
      await this.prisma.enrollment.delete({
        where: { id: idEnrollment}
      });
    } catch (error){
      this.logger.error(`Error deleting enrollment by id ${idEnrollment}: `, error);
      handleAppError(error);
    }
  }

  async findManyEnrollment(pageNumber: number): Promise<EnrollmentPaginationResponseDto>{
    try{
      const PAGE_SIZE = 10;
      const page = (PAGE_SIZE * (pageNumber - 1));

      const totalCount = await this.prisma.enrollment.count();
      const totalPages = Math.ceil(totalCount / PAGE_SIZE);

      const enrollments = await this.prisma.$queryRaw<
        EnrollmentResponseDto[]
      >(Prisma.sql`
      SELECT u.name as student_name, e.active, e.completed, e.expiredAt, c.name as course_name
        FROM Enrollment e
        INNER JOIN Student s ON s.id = e.idStudent
        INNER JOIN User u ON u.id = s.idUser
        INNER JOIN Course c ON c.id = e.idCourse
        ORDER BY u.name ASC
        LIMIT ${PAGE_SIZE} OFFSET ${page}
      `);  
      if (!enrollments || enrollments.length == 0) {
        throw new NotFoundException('Enrollments not found');
      }
      return { enrollments, totalPages };
    } catch (error){
      this.logger.error(`Error while retrieving paginated enrollments (page ${pageNumber}): `, error);
      handleAppError(error);
    }
  }

  private async calculateExpiredAt(idCourse: number) {
    const courseDuration = await this.prisma.course.findUnique({
        where: {id: idCourse},
        select: {duration: true}
      })

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + courseDuration.duration);

      return expiresAt;
  }
}

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnrollmentRequestDto } from './dto/request/enrollment.request.dto';
import { EnrollmentUpdateDto } from './dto/update/enrollment.update.dto';
import { EnrollmentResponseDto } from './dto/response/enrollment.response.dto';
import { EnrollmentPaginationResponseDto } from './dto/response/enrollment-pagination.response.dto';
import { Prisma } from '@prisma/client';
import { handleAppError } from 'src/utils/handle-app-error.error';
import { PreEnrollmentDto } from './dto/request/pre-enrollment.request.dto';
import { IEnrollmentService } from './interface/enrollment.interface';

@Injectable()
export class EnrollmentService implements IEnrollmentService{
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
      throw handleAppError(error); 
    }
  }

  async createPreEnrollment(idCourse: number,enrrolements: PreEnrollmentDto, user: number): Promise<boolean> {
    try {
      for (const email of enrrolements.emails){
        const student = await this.prisma.user.findUnique({
          where:  { email },
          include: {student: true}
        });

        if(student) {
          const alreadyEnrolled = await this.prisma.enrollment.findUnique({
            where: {
              idStudent_idCourse: {
                idStudent: student.id,
                idCourse: idCourse,
              },
            },
          });

          if (!alreadyEnrolled) {
            const enrrolement = {
              idCourse: idCourse,
              idStudent: student.student.id
            }
            await this.createEnrollment(enrrolement, user);
          }
        } else {
          await this.prisma.preEnrollment.upsert({
            where: {
              email_idCourse: {
                email,
                idCourse,
              },
            },
            update: {},
            create: {
              email,
              idCourse,
              createdBy: user,
            },
          });
        }
      }
      return true;
    } catch (error){
      this.logger.error('Error in create many enrrollments: ', error);
      throw handleAppError(error); 
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
      throw handleAppError(error); 
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
      throw handleAppError(error);
    }
  }

  async deleteEnrollment(idEnrollment: number): Promise<void> {
    try{
      await this.prisma.enrollment.delete({
        where: { id: idEnrollment}
      });
    } catch (error){
      this.logger.error(`Error deleting enrollment by id ${idEnrollment}: `, error);
      throw handleAppError(error);
    }
  }

  async deletePreEnrrolment(idEnrollment: number): Promise<void> {
    try {
      await this.prisma.preEnrollment.delete({
        where: {id: idEnrollment},
      });
    } catch (error){
      this.logger.error(`Error deleting pre-enrollment by id ${idEnrollment}: `, error);
      throw handleAppError(error);
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
      throw handleAppError(error);
    }
  }

  private async calculateExpiredAt(idCourse: number): Promise<Date> {
    const courseDuration = await this.prisma.course.findUnique({
      where: {id: idCourse},
      select: {duration: true}
    })

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + courseDuration.duration);

    return expiresAt;
  }

  async createEnrollmentByPreEnrrolment(student: number, userEmail: string): Promise<void>{
    try {
      const preEnrollments = await this.prisma.preEnrollment.findMany({
        where: { email: userEmail },
        select: { 
          id: true,
          idCourse: true,
          createdBy: true
        }
      });

      for (const pre of preEnrollments) {
        const exists = await this.prisma.enrollment.findUnique({
          where: {
            idStudent_idCourse: {
              idStudent: student,
              idCourse: pre.idCourse
            }
          }
        });

        if(!exists) {
          const enrrolement = {
            idCourse: pre.idCourse,
            idStudent: student
          }
          await this.createEnrollment(enrrolement, pre.createdBy);
        }

        await this.deletePreEnrrolment(pre.id);
      }      
    } catch (error){
      this.logger.error('Error in create enrrollment by pre enrollment: ', error);
      throw handleAppError(error); 
    }
  }
}

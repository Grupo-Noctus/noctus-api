import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnrollmentRequestDto } from './dto/enrollment-request.dto';
import { EnrollmentUpdateDto } from './dto/enrollment-update.dto'; 
import { EnrollmentResponseDto } from './dto/enrollment-response.dto';
import { EnrollmentPaginationResponseDto } from './dto/enrollment-pagination-response.dto';

@Injectable()
export class EnrollmentService {
  constructor(private readonly prisma: PrismaService) {}

  async createEnrollment(dto: EnrollmentRequestDto, user: number): Promise<boolean> {
    try{
      await this.prisma.enrollment.create({
        data: {
          student: {
              connect:{
                  id:dto.idStudent
              }
          },
          course:{
              connect:{
                  id:dto.idCourse
              }
          },
          active: dto.active,
          completed: dto.completed,
          startDate: dto.startDate,
          endDate: dto.endDate, 
        },
      });
      return true;
    } catch (error){
      console.error(error);
      throw new BadRequestException(); 
    }
  }

  async getEnrollmentById(id: number): Promise<EnrollmentResponseDto> {
    try{
      const enrollment = await this.prisma.$queryRaw<
      { name: string; active: boolean; completed: boolean; startDate: Date; endDate: Date; nameCourse: String; }[]
      >`
        SELECT u.name, e.active, e.completed, e.startDate, e.endDate, c.name,
          FROM Enrollment e
          INNER JOIN Student s ON s.id = e.idStudent
          INNER JOIN User u ON u.id = s.idUser
          WHERE e.id = ${id}
      `;  
      if (!enrollment) {
        throw new NotFoundException('Enrollment not found');
      }
      return {
        name: enrollment[0].name,
        active: enrollment[0].active,
        completed: enrollment[0].completed,
        startDate: enrollment[0].startDate,
        endDate: enrollment[0].endDate,
        nameCourse: enrollment[0].nameCourse,
      };
    }catch (error){ 
      console.error(error);
      throw new BadRequestException();
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
      console.error(error);
      throw new BadRequestException();
    }
  }

  async deleteEnrollment(idEnrollment: number) {
    try{
      await this.prisma.enrollment.delete({
        where: { id: idEnrollment}
      });
    } catch (error){
      console.error(error);
      throw new BadRequestException()
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
      >`
      SELECT u.name as student_name, e.active, e.completed, e.startDate, e.endDate, c.name as course_name
        FROM Enrollment e
        INNER JOIN Student s ON s.id = e.idStudent
        INNER JOIN User u ON u.id = s.idUser
        INNER JOIN Course c ON c.id = e.idCourse
        ORDER BY u.name ASC
        LIMIT ${PAGE_SIZE} OFFSET ${page}
      `;  
      if (!enrollments || enrollments.length == 0) {
        throw new NotFoundException('Enrollments not found');
      }
      return { enrollments, totalPages };
    } catch (error){
      console.error(error);
      throw new BadRequestException();
    }
  }
}

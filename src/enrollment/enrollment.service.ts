import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnrollmentRequestDto } from './dto/enrollment-request.dto';
import { EnrollmentUpdateDto } from './dto/enrollment-update.dto'; 

@Injectable()
export class EnrollmentService {
  constructor(private readonly prisma: PrismaService) {}

  async createEnrollment(dto: EnrollmentRequestDto) {
    const student = await this.prisma.student.findUnique({
      where: { id: dto.idStudent },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const course = await this.prisma.course.findUnique({
      where: { id: dto.idCourse },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    
    const enrollment = await this.prisma.enrollment.create({
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

    return {
      message: 'Enrollment created successfully',
      data: enrollment,
    };
  }

  async getEnrollmentById(id: number) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
      include: {
        student: true,
        course: true,
      },
    });
  
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }
  
    return {
      message: 'Enrollment retrieved successfully',
      data: enrollment,
    };
  }
  
  
  async updateEnrollment(id: number, dto: EnrollmentUpdateDto) {
    
    const enrollmentId = parseInt(id.toString(), 10);

    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    const updatedEnrollment = await this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        ...dto, 
      },
    });

    return {
      message: 'Enrollment updated successfully',
      data: updatedEnrollment,
    };
  }

  async deleteEnrollment(id: number) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
    });
  
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }
  
    await this.prisma.enrollment.delete({
      where: { id },
    });
  
    return {
      message: 'Enrollment deleted successfully',
      id,
    };
  }
  
}

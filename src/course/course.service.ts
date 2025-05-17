import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourseRequestDto } from './dto/course-request.dto';
import { CourseUpdateDto } from './dto/course-update.dto';
import { CourseResponseDto } from './dto/course-response.dto';
import { CoursePaginationResponseDto } from './dto/course-pagination-response.dto';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { UploadService } from 'src/upload/upload.service';
import { handlePrismaError } from 'src/utils/handle-prisma.error';
import { handleHttpError } from 'src/utils/handle-http.error';
@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(
    private prisma: PrismaService,
    private enrollmentService: EnrollmentService,
    private readonly uploadService: UploadService,
  ) {}

  async createCourse(courseRequest: CourseRequestDto, user: number, image: string): Promise<boolean> {
    try {
      const { duration } = courseRequest;
      await this.prisma.course.create({
        data: {
          ...courseRequest,
          duration: +duration,
          image,
          createdBy: user,
          updatedBy: user,
        },
      });
      return true;
    } catch (error) {
      this.logger.error('Error while creating course', error);
      if (image) await this.uploadService.deleteFile(image);
      handlePrismaError(error);
      handleHttpError(error);
    }
  }
  
  async updateCourse(idCourse: number, updateCourse: CourseUpdateDto, user: number, image?: string): Promise<boolean> {
    try {
      const existingCourse = await this.prisma.course.findUnique({ where: { id: idCourse } });
      if (!existingCourse) {
        throw new NotFoundException('Course not found');
      }
      const finalImage = image ?? existingCourse.image;
  
      if (updateCourse.duration != null) {
        updateCourse.duration = Number(updateCourse.duration);
      }
  
      await this.prisma.course.update({
        where: { id: idCourse },
        data: {
          ...updateCourse,
          image: finalImage,
          updatedBy: user,
        },
      });
      return true;
    } catch (error) {
      this.logger.error('Error while updating course', error);
      if (image) await this.uploadService.deleteFile(image);
      handlePrismaError(error);
      handleHttpError(error);
    }
  }
  
  async deleteCourse(idCourse: number): Promise<void> {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id: idCourse },
        select: { image: true },
      });
  
      if (!course) {
        throw new NotFoundException(`Course with ID ${idCourse} not found.`);
      }
  
      if (course.image) {
        await this.uploadService.deleteFile(course.image);
      }
  
      await this.prisma.course.delete({ where: { id: idCourse } });
    } catch (error) {
      this.logger.error('Error while deleting course', error);
      handlePrismaError(error);
      handleHttpError(error);
    }
  }
  
  async findOneCourse(idCourse: number): Promise<CourseResponseDto> {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id: idCourse },
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          duration: true,
        },
      });
  
      if (!course) {
        throw new NotFoundException(`Course with ID ${idCourse} not found.`);
      }
  
      return course;
    } catch (error) {
      this.logger.error('Error while fetching single course', error);
      handlePrismaError(error);
      handleHttpError(error);
    }
  }
  
  async findManyCoursePagination(limit: number, pageNumber: number): Promise<CoursePaginationResponseDto> {
    try {
      if (limit <= 0 || pageNumber <= 0) {
        throw new BadRequestException('Limit and page number must be greater than zero.');
      }
  
      const offset = limit * (pageNumber - 1);
      const totalCount = await this.prisma.course.count();
      const totalPages = Math.ceil(totalCount / limit);
  
      const courses = await this.prisma.$queryRaw<CourseResponseDto[]>`
        SELECT c.id, c.name, c.description, c.image, c.duration
        FROM Course c
        ORDER BY name ASC
        LIMIT ${limit} OFFSET ${offset}
      `;
  
      return { courses, totalPages };
    } catch (error) {
      this.logger.error('Error fetching courses with pagination', error);
      handlePrismaError(error);
      handleHttpError(error);
    }
  }
  
  async findManyCourse(user: number): Promise<CourseResponseDto[]> {
    try {
      const enrolledCourses = await this.enrollmentService.findCoursePerEnrollment(user);
      const enrolledCourseIds = enrolledCourses.map(course => course.courseId);
  
      return await this.prisma.course.findMany({
        where: { id: { notIn: enrolledCourseIds } },
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          duration: true,
        },
      });
    } catch (error) {
      this.logger.error('Error fetching courses for user', error);
      handlePrismaError(error);
      handleHttpError(error);
    }
  }  
}

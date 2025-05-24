import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourseRequestDto } from './dto/request/course.request.dto';
import { CourseUpdateDto } from './dto/update/course.update.dto';
import { CourseResponseDto } from './dto/response/course.response.dto';
import { CoursePaginationResponseDto } from './dto/response/course-pagination.response.dto';
import { UploadService } from 'src/upload/upload.service';
import { handleAppError } from 'src/utils/handle-app-error.error';
import { GetEnrolledCourseInfoService } from 'src/enrollment/get-enrolled-course-info.service';
import { Prisma, Role } from '@prisma/client';
import { ICourseService } from './interface/course.service.interface';
import { coursePreviewDto } from './dto/response/course-preview.response';
import { ModuleService } from 'src/module/module.service';
@Injectable()
export class CourseService implements ICourseService{
  private readonly logger = new Logger(CourseService.name);

  constructor(
    private prisma: PrismaService,
    private readonly moduleService: ModuleService,
    private getEnrolledCourseInfoService: GetEnrolledCourseInfoService,
    private readonly uploadService: UploadService,
  ) {}

  async createCourse(courseRequest: CourseRequestDto, user: number, image: string): Promise<boolean> {
    try {
      const { duration } = courseRequest;
      await this.prisma.course.create({
        data: {
          ...courseRequest,
          duration: duration,
          image,
          createdBy: user,
          updatedBy: user,
          isHidden: false,
        },
      });
      return true;
    } catch (error) {
      this.logger.error('Error while creating course', error);
      if (image) await this.uploadService.deleteFile(image);
      throw handleAppError(error);
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
      throw handleAppError(error);
    }
  }

    async toggleCourseVisibility(idCourse: number): Promise<void> {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id: idCourse },
        select: { image: true, isHidden: true },
      });

      if (!course) {
        throw new NotFoundException(`Course with ID ${idCourse} not found.`);
      }

      await this.prisma.course.update({
        where: { id: idCourse },
        data: { isHidden: !course.isHidden },
      });
    } catch (error) {
      this.logger.error('Error toggling course visibility', error);
      throw handleAppError(error);
    }
  }
  
  async findManyCourse(user: number): Promise<CourseResponseDto[]> {
    try {
      const enrolledCourses = await this.getEnrolledCourseInfoService.findCoursePerEnrollment(user);
      const enrolledCourseIds = enrolledCourses.map(course => course.courseId);

      return await this.prisma.course.findMany({
        where: { 
          id: { notIn: enrolledCourseIds },
          isHidden: false, 
        },
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
      throw handleAppError(error);
    }
  }  
  
  async findManyCoursePagination(user: number, limit: number, pageNumber: number): Promise<CoursePaginationResponseDto> {
    try {
      const enrolledCourses = await this.getEnrolledCourseInfoService.findCoursePerEnrollment(user);
      const enrolledCourseIds = enrolledCourses.map(course => course.courseId);

      if (limit <= 0 || pageNumber <= 0) {
        throw new BadRequestException('Limit and page number must be greater than zero.');
      }

      const offset = limit * (pageNumber - 1);
      const totalCount = await this.prisma.course.count({
        where: {
          isHidden: false,
          id: { notIn: enrolledCourseIds },
        },
      });
      const totalPages = Math.ceil(totalCount / limit);

      const courses = await this.prisma.$queryRaw<CourseResponseDto[]>
      (Prisma.sql`
        SELECT c.id, c.name, c.description, c.image, c.duration
        FROM Course c
        WHERE c.isHidden = 0
        ${
          enrolledCourseIds.length > 0 ? 
          Prisma.sql`AND c.id NOT IN (${Prisma.join(enrolledCourseIds)})` :
          Prisma.empty
        }
        ORDER BY c.name ASC
        LIMIT ${limit} OFFSET ${offset}
      `);

      return { courses, totalPages };
    } catch (error) {
      this.logger.error('Error fetching courses with pagination', error);
      throw handleAppError(error);
    }
  }

  async findOneCoursePreview(idCourse: number, user: number, role: Role): Promise<coursePreviewDto> {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id: idCourse },
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          duration: true,
          isHidden: true,
        },
      });

      if (!course) {
        throw new NotFoundException(`Course with ID ${idCourse} not found.`);
      }
      if (course.isHidden) {
        throw new ForbiddenException(`Course with ID ${idCourse} is not accessible.`);
      }

      const { isHidden, ...courseData } = course;

      const modulesAndVideos = await this.moduleService.findModulesWithVideos(idCourse, user, role);
      const countModules = modulesAndVideos.length;
      const countVideos = modulesAndVideos.reduce((acc, module) => acc + module.videos.length, 0);
      const durationVideos = modulesAndVideos.reduce(
        (acc, module) => acc + module.videos.reduce((sum, video) => sum + video.duration, 0),
        0
      );
      const modules = modulesAndVideos.map(({ videos, ...module }) => module);
      
      return {
        ...courseData,
        modules,
        countModules,
        countVideos,
        durationVideos,
      };
    } catch (error) {
      this.logger.error('Error while fetching single course', error);
      throw handleAppError(error);
    }
  }
}

import { ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourseRequestDto } from './dto/request/course.request.dto';
import { CourseUpdateDto } from './dto/update/course.update.dto';
import { CourseResponseDto } from './dto/response/course.response.dto';
import { CoursePaginationResponseDto } from './dto/response/course-pagination.response.dto';
import { UploadService } from 'src/upload/upload.service';
import { handleAppError } from 'src/utils/handle-app-error.error';
import { Prisma, Role } from '@prisma/client';
import { ICourseService } from './interface/course.service.interface';
import { coursePreviewDto } from './dto/response/course-preview.response';
import { IModuleService } from 'src/module/interface/module.interface';
import { IUploadService } from 'src/upload/interface/upload.service.interface';

@Injectable()
export class CourseService implements ICourseService {
  private readonly logger = new Logger(CourseService.name);
  constructor(
    private readonly prisma: PrismaService,
    @Inject('IModuleService')
    private readonly moduleService: IModuleService,
    @Inject('IUploadService')
    private readonly uploadService: IUploadService,
  ) {}

  async createCourse(
    courseRequest: CourseRequestDto,
    user: number,
    image: string,
  ): Promise<boolean> {
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

  async updateCourse(
    idCourse: number,
    updateCourse: CourseUpdateDto,
    user: number,
    image?: string,
  ): Promise<boolean> {
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

  async findManyCoursePagination(
    limit: number,
    page: number,
    user: number,
    role: Role,
  ): Promise<CoursePaginationResponseDto> {
    try {
      const offset = limit * page;
      const totalCount = await this.prisma.course.count({
        where: {
          isHidden: false,
        },
      });
      const totalPages = Math.ceil(totalCount / limit);

      const courses = await this.prisma.$queryRaw<CourseResponseDto[]>(Prisma.sql`
        SELECT c.id, c.name, c.description, c.image, c.duration
        FROM Course c
        WHERE c.isHidden = 0
        ORDER BY c.name ASC
        LIMIT ${limit} OFFSET ${offset}
      `);

      const coursesWithModules = await Promise.all(
        courses.map(async course => {
          const modules = await this.moduleService.findModulesWithVideos(
            course.id,
            null,
            user,
            role,
          );
          return {
            ...course,
            modules,
          };
        }),
      );

      return {
        courses: coursesWithModules,
        totalPages,
      };
    } catch (error) {
      this.logger.error('Error fetching courses with pagination', error);
      throw handleAppError(error);
    }
  }

  async findAvailableCoursesExcludingEnrolled(
    user: number,
    role: Role,
  ): Promise<coursePreviewDto[]> {
    try {
      const student = await this.prisma.student.findFirst({
        where: { idUser: user },
        select: { id: true },
      });
      const enrolledCourses = await this.prisma.enrollment.findMany({
        where: {
          student: {
            idUser: student.id,
          },
        },
        select: {
          idCourse: true,
        },
      });

      const enrolledCourseIds = enrolledCourses.map(e => e.idCourse);

      const availableCourses = await this.prisma.course.findMany({
        where: {
          isHidden: false,
          ...(enrolledCourseIds.length > 0 && {
            id: {
              notIn: enrolledCourseIds,
            },
          }),
        },
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          duration: true,
        },
      });
      const coursesWithDetails = await Promise.all(
        availableCourses.map(async course => {
          let enrollmentId: number | null = null;

          if (student) {
            const enrollment = await this.prisma.enrollment.findFirst({
              where: {
                idStudent: student.id,
                idCourse: course.id,
              },
              select: { id: true },
            });

            enrollmentId = enrollment?.id ?? null;
          }
          const modulesAndVideos = await this.moduleService.findModulesWithVideos(
            course.id,
            null,
            user,
            'ADMIN',
          );

          const safeModules = (modulesAndVideos ?? []).map(module => ({
            ...module,
            videos: module.videos ?? [],
          }));

          const countModules = safeModules.length;
          const countVideos = safeModules.reduce((acc, module) => acc + module.videos.length, 0);
          const durationVideos = safeModules.reduce(
            (acc, module) =>
              acc + module.videos.reduce((sum, video) => sum + (video.duration ?? 0), 0),
            0,
          );

          const modules = safeModules.map(({ videos, ...mod }) => mod);

          return {
            ...course,
            modules,
            countModules,
            countVideos,
            durationVideos,
          };
        }),
      );

      return coursesWithDetails;
    } catch (error) {
      this.logger.error('Error while fetching non-enrolled courses', error);
      throw handleAppError(error);
    }
  }
}

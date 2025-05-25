import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnrolledCourseDto } from './dto/response/enrolled-course.response.dto';
import { handleAppError } from 'src/utils/handle-app-error.error';
import { Prisma, Role } from '@prisma/client';
import { IEnrolledCourseService } from './interface/enrolled-course.interface';
import { ModuleService } from 'src/module/module.service';
import { IModuleService } from 'src/module/interface/module.interface';

@Injectable()
export class EnrolledCourseService implements IEnrolledCourseService {
  private readonly logger = new Logger(EnrolledCourseService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject('IModuleService')
    private readonly moduleService: IModuleService,
  ) {}

  async findCoursesPerEnrollment(user: number, role: Role): Promise<EnrolledCourseDto[] | []> {
    try {
      const enrrolmentsAndCourses = await this.prisma.$queryRaw<EnrolledCourseDto[]>(Prisma.sql`
                SELECT 
                e.id AS idEnrrolment, 
                e.completed, 
                e.expiresAt, 
                c.id AS idCourse, 
                c.name AS nameCourse, 
                c.description AS courseDescription, 
                c.image AS courseImage
                FROM User u 
                INNER JOIN Student s ON u.id  = s.idUser
                INNER JOIN Enrollment e ON e.idStudent = s.id
                INNER JOIN Course c ON c.id = e.idCourse
                WHERE u.id = ${user}
                AND c.isHidden = 0;
            `);

      if (enrrolmentsAndCourses.length === 0) {
        return [];
      }
      const coursesWithModules = await Promise.all(
        enrrolmentsAndCourses.map(async course => {
          const modules = await this.moduleService.findModulesWithVideos(
            course.idCourse,
            user,
            role,
          );
          return {
            ...course,
            modules,
          };
        }),
      );

      return coursesWithModules;
    } catch (error) {
      this.logger.error('Error fetching courses: ', error);
      throw handleAppError(error);
    }
  }
}

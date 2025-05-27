import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EnrollmentGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.role !== 'STUDENT') {
      return true;
    }

    const idCourse = this.extractId(request, 'idCourse');
    const idModule = this.extractId(request, 'idModule');
    const idVideo = this.extractId(request, 'idVideo');

    let resolvedCourseId: number | null = null;

    if (idCourse) {
      resolvedCourseId = idCourse;
    } else if (idModule) {
      const module = await this.prisma.module.findUnique({
        where: { id: idModule },
        select: { idCourse: true },
      });
      resolvedCourseId = module?.idCourse || null;
    } else if (idVideo) {
      const video = await this.prisma.videoLecture.findUnique({
        where: { id: idVideo },
        select: {
          module: {
            select: { idCourse: true },
          },
        },
      });
      resolvedCourseId = video?.module?.idCourse || null;
    }

    if (!resolvedCourseId) {
      return true;
    }

    const student = await this.prisma.student.findUnique({
      where: { idUser: user.id },
      select: { id: true },
    });

    if (!student) {
      throw new ForbiddenException('Student not found.');
    }

    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        idCourse: resolvedCourseId,
        idStudent: student.id,
      },
    });

    if (!enrollment) {
      throw new ForbiddenException('You are not enrolled in this course.');
    }

    return true;
  }

  private extractId(request: any, key: string): number | null {
    return (
      parseInt(request.params?.[key], 10) ||
      parseInt(request.query?.[key], 10) ||
      parseInt(request.body?.[key], 10) ||
      null
    );
  }
}

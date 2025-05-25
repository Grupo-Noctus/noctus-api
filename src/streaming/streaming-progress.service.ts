import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { handleAppError } from 'src/utils/handle-app-error.error';
import { StreamingService } from './streaming.service';

@Injectable()
export class StreamingProgressService {
  private readonly logger = new Logger(StreamingProgressService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly streamingService: StreamingService,
  ) {}
  //usar upsert
  async createProgressVideo(
    idCourse: number,
    idVideo: number,
    idUser: number,
    progressVideo: number,
  ): Promise<boolean> {
    try {
      const idEnrrolment = await this.streamingService.getEnrrolmentByIdCourseAndIdStudent(
        idCourse,
        idUser,
      );
      const data = await this.prisma.progressVideo.create({
        data: {
          idVideo,
          idEnrrolment,
          viewed: progressVideo,
        },
      });
      return !!data;
    } catch (error) {
      this.logger.error(`Failed to create video progress`, error);
      handleAppError(error);
    }
  }

  async updateProgressVideo(idProgressVideo: number, progressVideo: number): Promise<boolean> {
    try {
      const data = await this.prisma.progressVideo.update({
        where: { id: idProgressVideo },
        data: { viewed: progressVideo },
      });
      return !!data;
    } catch (error) {
      this.logger.error(`Failed to update video progress`, error);
      handleAppError(error);
    }
  }
}

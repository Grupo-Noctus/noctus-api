import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StreamingRequest } from './dto/request/streaming.request.dto';
import { StreamingDto } from './dto/streaming.dto';
import { StreamingUpdate } from './dto/update/streaming.update.dto';
import { StreamingResponseDto } from './dto/response/streaming.response.dto';
import { VideoMetadata } from 'src/upload/dto/video-metadata.dto';
import { handleAppError } from 'src/utils/handle-app-error.error';
import { UploadService } from 'src/upload/upload.service';
import { Role } from '@prisma/client';
import { ProgressVideoDto } from './dto/response/progress.response.dto';
import { IStreamingService } from './interface/streaming.intercafe';

@Injectable()
export class StreamingService implements IStreamingService {
  private readonly logger = new Logger(StreamingService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async createVideoLecture(
    idModule: number,
    videoMetadata: VideoMetadata,
    thumbnail: string,
    streamingRequest: StreamingRequest,
    user: number,
  ): Promise<boolean> {
    try {
      const videoData = {
        data: {
          module: {
            connect: {
              id: idModule,
            },
          },
          ...streamingRequest,
          ...videoMetadata,
          thumbnail: thumbnail,
          createdBy: user,
          updatedBy: user,
        },
      };

      await this.prisma.videoLecture.create(videoData);
      return true;
    } catch (error) {
      this.logger.error(`Failed to create video lecture for module`, error);
      if (videoMetadata) await this.uploadService.deleteFile(videoMetadata.key);
      throw handleAppError(error);
    }
  }

  async findManyVideos(
    idEnrollment: number,
    idModule: number,
    user: number,
    role: Role,
  ): Promise<StreamingResponseDto[]> {
    try {
      const data = await this.prisma.videoLecture.findMany({
        where: { idModule: idModule },
        select: {
          id: true,
          name: true,
          description: true,
          duration: true,
        },
      });
      if (role === Role.STUDENT) {
        const student = await this.prisma.student.findUnique({
          where: {
            idUser: user,
          },
          select: {
            id: true,
          },
        });

        if (!student) {
          throw new ForbiddenException('Student not found for this user');
        }

        const verifyEnrollment = await this.prisma.enrollment.findFirst({
          where: {
            id: idEnrollment,
            idStudent: student.id,
          },
        });

        if (!verifyEnrollment || verifyEnrollment == null) {
          throw new ForbiddenException('Enrollment not found for this student');
        }

        for (const item of data) {
          const progressVideo = await this.getVideoProgress(idEnrollment, item.id);
          if (progressVideo != null) {
            item['idProgressVideo'] = progressVideo.id;
            item['viewed'] = progressVideo.viewed;
          } else {
            item['idProgressVideo'] = 0;
            item['viewed'] = 0;
          }
        }
      }

      return data;
    } catch (error) {
      this.logger.error(`Failed to fetch video lectures for module ID ${idModule}`, error);
      throw handleAppError(error);
    }
  }

  async updateVideoData(
    idVideo: number,
    streamingUpdate: StreamingUpdate,
    user: number,
  ): Promise<boolean> {
    try {
      await this.prisma.videoLecture.update({
        where: { id: idVideo },
        data: {
          ...streamingUpdate,
          updatedBy: user,
        },
      });
      return true;
    } catch (error) {
      this.logger.error(`Failed to update video lecture with ID ${idVideo}`, error);
      throw handleAppError(error);
    }
  }

  async findVideo(id: number): Promise<StreamingDto> {
    try {
      const videoData = await this.prisma.videoLecture.findUnique({
        where: { id: id },
        select: {
          url: true,
          mimetype: true,
          size: true,
        },
      });

      if (!videoData) {
        throw new NotFoundException();
      }

      return videoData;
    } catch (error) {
      this.logger.error(`Failed to retrieve video lecture with ID ${id}`, error);
      throw handleAppError(error);
    }
  }

  async deleteVideo(idVideo: number): Promise<void> {
    try {
      const video = await this.prisma.videoLecture.findUnique({
        where: { id: idVideo },
        select: { url: true },
      });

      if (!video) {
        throw new NotFoundException(`video with ID ${idVideo} not found.`);
      }

      if (video.url) {
        await this.uploadService.deleteFile(video.url);
      }

      await this.prisma.videoLecture.delete({ where: { id: idVideo } });
    } catch (error) {
      this.logger.error(`Failed to delete video lecture with ID ${idVideo}`, error);
      throw handleAppError(error);
    }
  }

  private async getVideoProgress(
    idEnrollment: number,
    idVideo: number,
  ): Promise<ProgressVideoDto | null> {
    try {
      const data = await this.prisma.progressVideo.findUnique({
        where: {
          idEnrollment_idVideo: {
            idEnrollment,
            idVideo,
          },
        },
        select: {
          id: true,
          viewed: true,
        },
      });

      if (!data || !data.viewed) {
        return null;
      }

      return data;
    } catch (error) {
      this.logger.error(`Failed to find video progress`, error);
      throw handleAppError(error);
    }
  }

  async saveProgressVideo(
    idEnrollment: number,
    idVideo: number,
    progressVideo: number,
  ): Promise<boolean> {
    try {
      const data = await this.prisma.progressVideo.upsert({
        where: {
          idEnrollment_idVideo: {
            idVideo,
            idEnrollment,
          },
        },
        create: {
          idVideo,
          idEnrollment,
          viewed: progressVideo,
        },
        update: {
          viewed: progressVideo,
        },
      });

      return !!data;
    } catch (error) {
      this.logger.error(`Failed to save video progress`, error);
      throw handleAppError(error);
    }
  }
}

import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StreamingRequest } from './dto/streaming-request.dto';
import { StreamingDto } from './dto/streaming.dto';
import { StreamingUpdate } from './dto/streaming-update.dto';
import { StreamingResponseDto } from './dto/streaming-response.dto';
import { VideoMetadata } from 'src/upload/dto/video-metadata.dto';
import { handlePrismaError } from 'src/utils/handle-prisma.error';
import { handleHttpError } from 'src/utils/handle-http.error';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class StreamingService {
  private readonly logger = new Logger(StreamingService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService
  ){}

  async createVideoLecture( idModule: number, videoMetadata: VideoMetadata, thumbnail: string, streamingRequest: StreamingRequest, user: number): Promise<boolean> {
    try {
      const {order} = streamingRequest
      const videoData = {
        data: {
          module: {
            connect: {
              id: idModule
            }
          },
          ...streamingRequest,
          ...videoMetadata,
          thumbnail: thumbnail,
          order: +order,
          createdBy: user,
          updatedBy: user
        }
      };
    
      await this.prisma.videoLecture.create(videoData);
      return true;
    } catch (error) {
      this.logger.error(`Failed to create video lecture for module`, error);
      if (videoMetadata) await this.uploadService.deleteFile(videoMetadata.key);
      handlePrismaError(error);
      handleHttpError(error);
    }
  }

  async findManyVideos (idModule: number): Promise<StreamingResponseDto[]>{
    try{
      return await this.prisma.videoLecture.findMany({
        where: {idModule: idModule},
        select: {
          id: true,
          name: true,
          description: true,
          duration: true,
          order: true,
        }
      });
    } catch (error) {
      this.logger.error(`Failed to fetch video lectures for module ID ${idModule}`, error);
      handlePrismaError(error);
      handleHttpError(error);
    }
  }

  async updateVideoData (idVideo: number, streamingUpdate: StreamingUpdate, user: number): Promise <boolean> {
    try {
      await this.prisma.videoLecture.update({
        where: {id: idVideo},
        data: {
          ...streamingUpdate,
          updatedBy: user,
        }
      });
      return true;
    } catch (error) {
      this.logger.error(`Failed to update video lecture with ID ${idVideo}`, error);
      handlePrismaError(error);
      handleHttpError(error);
    }
  }

  async findVideo (id: number): Promise<StreamingDto>{
    try{
    const videoData = await this.prisma.videoLecture.findUnique({
        where: {id: id},
        select:{
          url: true,
          mimetype:true,
          size: true,
        }
      });
       
      if(!videoData){
        throw new NotFoundException();
      }

      return videoData;
    } catch (error){
      this.logger.error(`Failed to retrieve video lecture with ID ${id}`, error);;
      handlePrismaError(error);
      handleHttpError(error);
    }
  }

  async deleteVideo (idVideo: number): Promise<void>{
    try {
      const video = await this.prisma.videoLecture.findUnique({
        where: {id: idVideo},
        select: {url: true}
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
      handlePrismaError(error);
      handleHttpError(error);
    }
  }
}

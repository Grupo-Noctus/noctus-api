import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StreamingRequest } from './dto/streaming-request.dto';
import { v4 as uuidv4 } from 'uuid';
import * as ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import getVideoDurationInSeconds from 'get-video-duration';
import slugify from 'slugify';
import { StreamingDto } from './dto/streaming.dto';
import { StreamingUpdate } from './dto/streaming-update.dto';
import { StreamingResponseDto } from './dto/streaming-response.dto';

@Injectable()
export class StreamingService {
  constructor(private readonly prisma: PrismaService){}

  onModuleInit() {
    ffmpeg.setFfmpegPath(ffmpegStatic as string);
    ffmpeg.setFfprobePath(ffmpegStatic as string);
  }

  async createVideoLecture( file: Express.Multer.File, streamingRequest: StreamingRequest, user: number): Promise<boolean> {
    try {
      const {idModule, order, ...rest} = streamingRequest;

      const { filename, mimetype, size, path } = file;
      
      const uniqueKey = this.generateUniqueKey(filename);

      const pathS3 = path; //adicionar url gerada após salvar na s3
      
      const durationVideo = await getVideoDurationInSeconds(pathS3);

      const videoData = {
        data: {
          module: {
            connect: {
              id: Number(+idModule)
            }
          },
          ...rest,
          order: +order,
          duration: durationVideo,
          key: uniqueKey,
          url: pathS3,
          mimetype: mimetype,
          size: size,
          createdBy: user,
          updatedBy: user
        }
      };
    
      await this.prisma.videoLecture.create(videoData);
      return true;
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  generateUniqueKey(filename: string): string {
    try{
      const slugifiedName = slugify(filename, { lower: true, strict: true, replacement: '-' });

      const uniqueId = uuidv4();

      return `${slugifiedName}-${uniqueId}`;
    }catch (error){
      console.error(error);
      throw new InternalServerErrorException();
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
      console.error(error);
      throw new NotFoundException();
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
      console.log (error);
      throw new BadRequestException();
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
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteVideo (idVideo): Promise<void>{
    try {
      await this.prisma.videoLecture.delete({
        where: {id: idVideo},
      });

      //incluir lógica para excluir da s3
    } catch (error) {
      console.error(error);
      throw new NotFoundException();
    }
  }
}

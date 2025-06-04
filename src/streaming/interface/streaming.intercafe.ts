import { StreamingRequest } from '../dto/request/streaming.request.dto';
import { StreamingDto } from '../dto/streaming.dto';
import { StreamingUpdate } from '../dto/update/streaming.update.dto';
import { StreamingResponseDto } from '../dto/response/streaming.response.dto';
import { VideoMetadata } from 'src/upload/dto/video-metadata.dto';
import { Role } from '@prisma/client';

export interface IStreamingService {
  createVideoLecture(
    idModule: number,
    videoMetadata: VideoMetadata,
    thumbnail: string,
    streamingRequest: StreamingRequest,
    user: number,
  ): Promise<boolean>;

  findManyVideos(
    idEnrollment: number,
    idModule: number,
    user: number,
    role: Role,
  ): Promise<StreamingResponseDto[]>;

  updateVideoData(
    idVideo: number,
    streamingUpdate: StreamingUpdate,
    user: number,
  ): Promise<boolean>;

  findVideo(id: number): Promise<StreamingDto>;

  deleteVideo(idVideo: number): Promise<void>;

  saveProgressVideo(idEnrollment: number, idVideo: number, progressVideo: number): Promise<boolean>;
}

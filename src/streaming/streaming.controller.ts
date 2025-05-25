import { Controller, Post, Body, Get, Param, UseInterceptors, HttpStatus, HttpCode, Res, Req, Delete, UploadedFiles, Put } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { StreamingRequest } from './dto/streaming-request.dto';
import { StreamingService } from './streaming.service';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { StreamingUpdate } from './dto/streaming-update.dto';
import { StreamingResponseDto } from './dto/streaming-response.dto';
import * as path from 'path';
import * as fs from 'fs';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from '@prisma/client';
import { UploadService } from 'src/upload/upload.service';
import { VideoMetadata } from 'src/upload/dto/video-metadata.dto';
import { multerFieldsOptions } from 'src/upload/helper/multer-file-options.helper';
import { StreamingProgressService } from './streaming-progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';

@ApiTags('Streaming')
@Controller('streaming')
export class StreamingController {
  constructor(
    private readonly streamingService: StreamingService,
    private readonly streamingProgressService: StreamingProgressService,
    private readonly uploadService: UploadService
  ) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('upload/:idModule')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ], multerFieldsOptions({
    video: {
      destination: './uploads/videos-lectures',
      allowedMimeTypes: /^video\/(mp4|webm|ogg|quicktime)$/,
    },
    thumbnail: {
      destination: './uploads/thumbnails',
      allowedMimeTypes: /^image\/(jpeg|jpg|png|webp)$/,
    },
  })))
  @ApiOperation({ summary: 'Upload a video file' })
  @ApiResponse({ status: 200, description: 'Video file uploaded successfully.', type: Boolean})
  @ApiResponse({ status: 400, description: 'Bad request or missing file.'})
  @ApiParam({ name: 'idModule', description: 'ID of the module where the video is', type: Number })
  @ApiBody({ description: 'Data to create the video information.', type: StreamingRequest })
  async uploadFile(
    @Param('idModule') idModule: string,
    @UploadedFiles() files: { video?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
    @Body() streamingRequest: StreamingRequest,
    @CurrentUser() user: number
  ) {
    const videoFile = files.video?.[0];
    const thumbnailFile = files.thumbnail?.[0];

    let videoVideoMetadata: VideoMetadata = null;
    let thumbnailPath: string = null;

    if (videoFile) {
      videoVideoMetadata = await this.uploadService.uploadVideoMetadata(
        videoFile,
        './uploads/videos-lectures'
      );
    }

    if (thumbnailFile) {
      thumbnailPath = await this.uploadService.uploadFileMetadata(
        thumbnailFile,
        './uploads/thumbnails',
      );
    }

    if (thumbnailPath) {
      streamingRequest.thumbnail = thumbnailPath;
    }
    return await this.streamingService.createVideoLecture( +idModule, videoVideoMetadata, thumbnailPath, streamingRequest, user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('update/:idVideo')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update video data' })
  @ApiResponse({ status: 200, description: 'Video data updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request. Could not update video data.' })
  @ApiParam({ name: 'idVideo', description: 'ID of the video to be updated', type: Number })
  @ApiBody({ description: 'Data to update the video information.', type: StreamingUpdate })
  async updateVideoData (
    @Param('idVideo') idVideo: number,
    @Body() streamingUpdate: StreamingUpdate,
    @CurrentUser() user: number
  ): Promise<boolean> {
    return await this.streamingService.updateVideoData(+idVideo, streamingUpdate, user);
  }

  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  @Get(':idVideo')
  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({ summary: 'Stream a video file' })
  @ApiResponse({ status: 206, description: 'Partial content (video stream)'})
  @ApiResponse({ status: 400, description: 'Invalid range header.'})
  @ApiResponse({ status: 416, description: 'Requested range is not satisfiable.'})
  @ApiParam({ name: 'idVideo', description: 'ID of the video lecture to be streamed', type: Number })
  @ApiHeader({
    name: 'Range',
    description: 'The byte range for video streaming',
    required: false,
    example: 'bytes=0-999999',
  })
  async streamingVideo(
    @Param('idVideo') idVideo: string,
    @Res() res: Response,
    @Req() req: Request
  ): Promise <void> {
    const {url, mimetype, size} = await this.streamingService.findVideo(+idVideo);
    const videoPath = path.resolve(url);

    const stat = fs.statSync(videoPath);
    const range = req.headers.range;

    if (!range) {
      res.status(400).send('Not found headers');
      return;
    }

    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + 999999, size - 1);

    if (start >= size) {
      res.status(416).send('Invalid interval');
      return;
    }

    const chunkSize = (end - start) + 1;
    const fileStreaming = fs.createReadStream(videoPath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': mimetype,
    });

    fileStreaming.pipe(res);
  }

  @HttpCode(HttpStatus.OK)
  @Get('findMany/:idCourse/:idModule')
  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({ summary: 'Get multiple video lectures by module ID' })
  @ApiResponse({ status: 200, description: 'List of video lectures for the given module ID', type: [StreamingResponseDto] })
  @ApiParam({ name: 'id', description: 'The ID of the module to get the videos from', type: Number })
  async findManyVideos (
    @Param('idCourse') idCourse: number,
    @Param('idModule') idModule: number,
    @CurrentUser() user: number,
    @CurrentUser('role') roleUser: Role
  ): Promise<StreamingResponseDto[]> {
    return await this.streamingService.findManyVideos(+idCourse, +idModule, user, roleUser);
  }

  @HttpCode(HttpStatus.NO_CONTENT) 
  @Delete('delete/:idVideo') 
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a video lecture by ID' }) 
  @ApiResponse({ status: 204, description: 'Video lecture deleted successfully.' }) 
  @ApiResponse({ status: 400, description: 'Bad request. Could not delete the video lecture.' }) 
  @ApiResponse({ status: 404, description: 'Video lecture not found.' }) 
  @ApiParam({ name: 'idVideo', description: 'ID of the video lecture to be deleted', type: Number }) 
  async deleteVideoLecture (@Param('idVideo') idVideo: number): Promise<void> {
    await this.streamingService.deleteVideo(+idVideo);
  }

  @HttpCode(HttpStatus.OK) 
  @Post('create-progress/:idCourse/:idVideo') 
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Update progress of a video lecture by ID' })
  @ApiResponse({ status: 200, description: 'Video progress updated successfully.' }) 
  @ApiResponse({ status: 400, description: 'Bad request. Could not update video progress.' }) 
  @ApiResponse({ status: 404, description: 'Progress record not found.' }) 
  @ApiParam({name: 'idProgressVideo', description: 'ID of the progress record to be updated', type: Number}) 
  async createProgressVideo (
    @Param('idCourse') idCourse: number,
    @Param('idVideo') idVideo: number,
    @CurrentUser() user: number,
    @Body() body: CreateProgressDto,
  ): Promise<void> {
    await this.streamingProgressService.createProgressVideo(+idCourse, +idVideo, user, body.progressVideo);
  }

  @HttpCode(HttpStatus.OK) 
  @Put('update-progress/:idProgressVideo') 
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Update progress of a video lecture by ID' })
  @ApiResponse({ status: 200, description: 'Video progress updated successfully.' }) 
  @ApiResponse({ status: 400, description: 'Bad request. Could not update video progress.' }) 
  @ApiResponse({ status: 404, description: 'Progress record not found.' }) 
  @ApiParam({name: 'idProgressVideo', description: 'ID of the progress record to be updated', type: Number}) 
  async updateProgressVideo (
    @Param('idProgressVideo') idProgressVideo: number,
    @Body() body: CreateProgressDto,
  ): Promise<void> {
    await this.streamingProgressService.updateProgressVideo(+idProgressVideo, body.progressVideo);
  }
}

import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseInterceptors,
  HttpStatus,
  HttpCode,
  Res,
  Req,
  Delete,
  UploadedFiles,
  ParseIntPipe,
  Query,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { StreamingRequest } from './dto/request/streaming.request.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { StreamingUpdate } from './dto/update/streaming.update.dto';
import { StreamingResponseDto } from './dto/response/streaming.response.dto';
import * as path from 'path';
import * as fs from 'fs';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from '@prisma/client';
import { UploadService } from 'src/upload/upload.service';
import { VideoMetadata } from 'src/upload/dto/video-metadata.dto';
import { multerFieldsOptions } from 'src/upload/helper/multer-file-options.helper';
import { SaveProgressDto } from './dto/request/progress.request.dto';
import { IStreamingService } from './interface/streaming.intercafe';

@ApiTags('Streaming')
@Controller('streaming')
export class StreamingController {
  constructor(
    @Inject('IStreamingService')
    private readonly streamingService: IStreamingService,
    private readonly uploadService: UploadService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('upload/:idModule')
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
      ],
      multerFieldsOptions({
        video: {
          destination: './uploads/videos-lectures',
          allowedMimeTypes: /^video\/(mp4|webm|ogg|quicktime)$/,
        },
        thumbnail: {
          destination: './uploads/thumbnails',
          allowedMimeTypes: /^image\/(jpeg|jpg|png|webp)$/,
        },
      }),
    ),
  )
  @ApiOperation({ summary: 'Upload a video file' })
  @ApiResponse({ status: 200, description: 'Video file uploaded successfully.', type: Boolean })
  @ApiResponse({ status: 400, description: 'Bad request or missing file.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins can upload videos.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiParam({ name: 'idModule', description: 'ID of the module where the video is', type: Number })
  @ApiBody({ description: 'Data to create the video information.', type: StreamingRequest })
  async uploadFile(
    @Param('idModule', ParseIntPipe) idModule: number,
    @UploadedFiles() files: { video?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
    @Body() streamingRequest: StreamingRequest,
    @CurrentUser() user: number,
  ) {
    const videoFile = files.video?.[0];
    const thumbnailFile = files.thumbnail?.[0];

    let videoVideoMetadata: VideoMetadata = null;
    let thumbnailPath: string = null;

    if (videoFile) {
      videoVideoMetadata = await this.uploadService.uploadVideoMetadata(
        videoFile,
        './uploads/videos-lectures',
      );
    }

    if (thumbnailFile) {
      thumbnailPath = await this.uploadService.uploadFileMetadata(
        thumbnailFile,
        './uploads/thumbnails',
      );
    }
    return await this.streamingService.createVideoLecture(
      idModule,
      videoVideoMetadata,
      thumbnailPath,
      streamingRequest,
      user,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('update/:idVideo')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update video data' })
  @ApiResponse({ status: 200, description: 'Video data updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request. Could not update video data.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins can update video data.' })
  @ApiResponse({ status: 404, description: 'Video not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiParam({ name: 'idVideo', description: 'ID of the video to be updated', type: Number })
  @ApiBody({ description: 'Data to update the video information.', type: StreamingUpdate })
  async updateVideoData(
    @Param('idVideo', ParseIntPipe) idVideo: number,
    @Body() streamingUpdate: StreamingUpdate,
    @CurrentUser() user: number,
  ): Promise<boolean> {
    return await this.streamingService.updateVideoData(idVideo, streamingUpdate, user);
  }

  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  @Get(':idVideo')
  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({ summary: 'Stream a video file' })
  @ApiResponse({ status: 206, description: 'Partial content (video stream)' })
  @ApiResponse({ status: 400, description: 'Invalid range header.' })
  @ApiResponse({ status: 416, description: 'Requested range is not satisfiable.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only enrolled users or admins can access.' })
  @ApiResponse({ status: 404, description: 'Video not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiParam({
    name: 'idVideo',
    description: 'ID of the video lecture to be streamed',
    type: Number,
  })
  @ApiHeader({
    name: 'Range',
    description: 'The byte range for video streaming',
    required: false,
    example: 'bytes=0-999999',
  })
  async streamingVideo(
    @Param('idVideo', ParseIntPipe) idVideo: number,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<void> {
    const { url, mimetype, size } = await this.streamingService.findVideo(idVideo);
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

    const chunkSize = end - start + 1;
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
  @Get('findMany/:idModule')
  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({ summary: 'Get multiple video lectures by module ID' })
  @ApiResponse({
    status: 200,
    description: 'List of video lectures for the given module ID',
    type: [StreamingResponseDto],
  })
  @ApiResponse({ status: 400, description: 'idEnrollment is required for students.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Videos not found for the module.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiParam({
    name: 'idModule',
    description: 'The ID of the module to get the videos from',
    type: Number,
  })
  async findManyVideos(
    @Query('idEnrollment') idEnrollment: number | null,
    @Param('idModule') idModule: number,
    @CurrentUser() user: number,
    @CurrentUser('role') roleUser: Role,
  ): Promise<StreamingResponseDto[]> {
    if (roleUser === Role.STUDENT && !idEnrollment) {
      throw new BadRequestException('idEnrollment is required for students');
    }
    return await this.streamingService.findManyVideos(idEnrollment, idModule, user, roleUser);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete/:idVideo')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a video lecture by ID' })
  @ApiResponse({ status: 204, description: 'Video lecture deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request. Could not delete the video lecture.' })
  @ApiResponse({ status: 404, description: 'Video lecture not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins can delete videos.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiParam({ name: 'idVideo', description: 'ID of the video lecture to be deleted', type: Number })
  async deleteVideoLecture(@Param('idVideo', ParseIntPipe) idVideo: number): Promise<void> {
    await this.streamingService.deleteVideo(idVideo);
  }

  @HttpCode(HttpStatus.OK)
  @Post('save-progress/:idEnrollment/:idVideo')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'save progress of a video lecture by ID' })
  @ApiResponse({ status: 200, description: 'Video progress saved successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request. Could not save video progress.' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Progress record not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiParam({
    name: 'idProgressVideo',
    description: 'ID of the progress record to be saved',
    type: Number,
  })
  async saveProgressVideo(
    @Param('idEnrollment', ParseIntPipe) idEnrollment: number,
    @Param('idVideo', ParseIntPipe) idVideo: number,
    @Body() body: SaveProgressDto,
  ): Promise<void> {
    await this.streamingService.saveProgressVideo(idEnrollment, idVideo, body.progressVideo);
  }
}

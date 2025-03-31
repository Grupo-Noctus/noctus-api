import { Controller, Post, Body, Get, Param, UseInterceptors, UploadedFile, HttpStatus, HttpCode, Res, Req, Delete } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { StreamingRequest } from './dto/streaming-request.dto';
import { StreamingService } from './streaming.service';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { StreamingUpdate } from './dto/streaming-update.dto';
import { StreamingResponseDto } from './dto/streaming-response.dto';
import * as path from 'path';
import * as fs from 'fs';

@ApiTags('Streaming')
@Controller('streaming')
export class StreamingController {
  constructor(private readonly streamingService: StreamingService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('upload')
  @UseInterceptors(FileInterceptor('link'))
  @ApiOperation({ summary: 'Upload a video file' })
  @ApiResponse({ status: 200, description: 'Video file uploaded successfully.', type: Boolean})
  @ApiResponse({ status: 400, description: 'Bad request or missing file.'})
  @ApiBody({ description: 'Data to create the video information.', type: StreamingRequest })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() streamingRequest: StreamingRequest,
    @CurrentUser() user: number
  ) {
    return await this.streamingService.createVideoLecture( file, streamingRequest, user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('update/:id')
  @ApiOperation({ summary: 'Update video data' })
  @ApiResponse({ status: 200, description: 'Video data updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request. Could not update video data.' })
  @ApiParam({ name: 'id', description: 'ID of the video to be updated', type: Number })
  @ApiBody({ description: 'Data to update the video information.', type: StreamingUpdate })
  async updateVideoData (
    @Param('id') idVideo: number,
    @Body() streamingUpdate: StreamingUpdate,
    @CurrentUser() user: number
  ): Promise<boolean> {
    return await this.streamingService.updateVideoData(+idVideo, streamingUpdate, user);
  }

  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  @Get(':id')
  @ApiOperation({ summary: 'Stream a video file' })
  @ApiResponse({ status: 206, description: 'Partial content (video stream)'})
  @ApiResponse({ status: 400, description: 'Invalid range header.'})
  @ApiResponse({ status: 416, description: 'Requested range is not satisfiable.'})
  @ApiHeader({
    name: 'Range',
    description: 'The byte range for video streaming',
    required: false,
    example: 'bytes=0-999999',
  })
  async streamingVideo(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request
  ): Promise <void> {
    const {url, mimetype, size} = await this.streamingService.findVideo(+id);
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
  @Get('findMany/:id')
  @ApiOperation({ summary: 'Get multiple video lectures by module ID' })
  @ApiResponse({ status: 200, description: 'List of video lectures for the given module ID', type: [StreamingResponseDto] })
  @ApiParam({ name: 'id', description: 'The ID of the module to get the videos from', type: Number })
  async findManyVideos (@Param('id') idModule): Promise<StreamingResponseDto[]> {
    return await this.streamingService.findManyVideos(+idModule);
  }

  @HttpCode(HttpStatus.NO_CONTENT) 
  @Delete('delete/:id') @ApiOperation({ summary: 'Delete a video lecture by ID' }) 
  @ApiResponse({ status: 204, description: 'Video lecture deleted successfully.' }) 
  @ApiResponse({ status: 400, description: 'Bad request. Could not delete the video lecture.' }) 
  @ApiResponse({ status: 404, description: 'Video lecture not found.' }) 
  @ApiParam({ name: 'id', description: 'ID of the video lecture to be deleted', type: Number }) 
  async deleteVideoLecture (@Param('id') idVideo: number): Promise<void> {
    await this.streamingService.deleteVideo(+idVideo);
  }
}

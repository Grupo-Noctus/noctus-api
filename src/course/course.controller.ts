import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, Query, UseInterceptors, UploadedFile, Logger } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseUpdateDto } from './dto/course-update.dto';
import { CourseRequestDto } from './dto/course-request.dto';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CourseResponseDto } from './dto/course-response.dto';
import { CoursePaginationResponseDto } from './dto/course-pagination-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerFileOptions } from 'src/upload/helper/multer-file-options.helper';
import { UploadService } from 'src/upload/upload.service';

@ApiTags('Course')
@Controller('course')
export class CourseController {
  private readonly logger = new Logger(CourseController.name)
  constructor(
    private readonly courseService: CourseService,
    private readonly uploadService: UploadService
  ) {}
  
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('imageCourse', multerFileOptions('./uploads/images-courses', /^image\/(jpeg|png|jpg|webp)$/)))
  @ApiOperation({summary: 'Create course'})
  @ApiResponse({ status: 200, description:'Success'})
  @ApiResponse({status:400, description:'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  async createCourse(
    @Body() courseResponse: CourseRequestDto,
    @CurrentUser() user: number,
    @UploadedFile() imageCourse: Express.Multer.File,
  ): Promise<boolean> {
    let imageKey = null;
    if (imageCourse) {
      imageKey = await this.uploadService.uploadFileMetadata(
        imageCourse,
        'images-courses'
      );
    }
    return await this.courseService.createCourse(courseResponse, user, imageKey);
  }

  @HttpCode(HttpStatus.OK)
  @Get('find-one/:idCourse')
  @Roles(Role.ADMIN)
  @ApiOperation({summary: 'Find one course'})
  @ApiResponse({ status: 200, description:'Success', type: CourseResponseDto})
  @ApiResponse({status:400, description: 'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({ status: 404, description: 'Not Found'})
  @ApiParam({  name: 'idCourse', type: String, description: 'ID do curso' })
  async findOneCourse(@Param('idCourse') idCourse: string): Promise<CourseResponseDto> {
    return await this.courseService.findOneCourse(+idCourse);
  }

  @HttpCode(HttpStatus.OK)
  @Put('update/:idCourse')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('imageCourse', multerFileOptions('./uploads/images-courses', /^image\/(jpeg|png|jpg|webp)$/)))
  @ApiOperation({summary: 'Update course'})
  @ApiResponse({ status: 200, description:'Success', type: Boolean})
  @ApiResponse({status:400, description: 'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({ status: 404, description: 'Not Found'})
  @ApiParam({  name: 'idCourse', type: String, description: 'ID of course' })
  async updateCourse(
    @Param('idCourse') idCourse: string,
    @Body() updateCourse: CourseUpdateDto,
    @CurrentUser() user: number,
    @UploadedFile() imageCourse: Express.Multer.File
  ): Promise<boolean>{
    let imageKey = null;
    if (imageCourse) {
      imageKey = await this.uploadService.uploadFileMetadata(
        imageCourse,
        'images-courses'
      );
    }
    return await this.courseService.updateCourse(+idCourse, updateCourse, user, imageKey);
  }
  
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete/:idCourse')
  @Roles(Role.ADMIN)
  @ApiOperation({summary: 'Delete course'})
  @ApiResponse({ status: 200, description:'Success'})
  @ApiResponse({status:400, description: 'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({ status: 404, description: 'Not Found'})
  @ApiParam({  name: 'idCourse', type: String, description: 'ID of course' })
  async deleteCourse(@Param('idCourse') idCourse: string): Promise<void> {
    await this.courseService.deleteCourse(+idCourse);
  }

  @HttpCode(HttpStatus.OK)
  @Get('find-many-pagination')
  @Roles(Role.STUDENT, Role.ADMIN)
  @ApiOperation({ summary: 'Find many courses with pagination' })
  @ApiResponse({ status: 200, description:'Success', type: CoursePaginationResponseDto })
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({ status: 404, description: 'Not Found'})
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    example: 10,
    type: Number,
  })
  async findManyCoursePagination(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<CoursePaginationResponseDto> {
    return await this.courseService.findManyCoursePagination(limit, page);
  }

  @HttpCode(HttpStatus.OK)
  @Get('find-many')
  @Roles(Role.STUDENT, Role.ADMIN)
  @ApiOperation({ summary: 'Find many courses' })
  @ApiResponse({ status: 200, description:'Success', type: [CourseResponseDto] })
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({ status: 404, description: 'Not Found'})
  async findManyCourse(
    @CurrentUser() user: number
  ): Promise<CourseResponseDto[]> {
    return await this.courseService.findManyCourse(user);
  }
}


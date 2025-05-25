import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Logger, Param, Post, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { Roles } from "src/auth/decorator/role.decorator";
import { UploadService } from "src/upload/upload.service";
import { ICourseService } from "./interface/course.service.interface";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerFileOptions } from "src/upload/helper/multer-file-options.helper";
import { CourseRequestDto } from "./dto/request/course.request.dto";
import { CurrentUser } from "src/auth/decorator/current-user.decorator";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { handleAppError } from "src/utils/handle-app-error.error";
import { CourseUpdateDto } from "./dto/update/course.update.dto";
import { CoursePaginationResponseDto } from "./dto/response/course-pagination.response.dto";

@ApiTags('CourseAdmin')
@Controller('course/admin')
@Roles(Role.ADMIN)
export class CourseAdminController {
  private readonly logger = new Logger(CourseAdminController.name)
  constructor(
    @Inject('ICourseService') 
    private readonly courseService: ICourseService,
    private readonly uploadService: UploadService
  ) {}
  
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @UseInterceptors(
    FileInterceptor(
      'imageCourse', 
      multerFileOptions('./uploads/images-courses', /^image\/(jpeg|png|jpg|webp)$/)
    ),
  )
  @ApiOperation({summary: 'Create course'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CourseRequestDto })
  @ApiResponse({ status: 200, description:'Success'})
  @ApiResponse({status:400, description:'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({status: 403, description: 'Forbidden'})
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createCourse(
    @UploadedFile() imageCourse: Express.Multer.File,
    @Body() body: any,
    @CurrentUser() user: number,
  ): Promise<boolean> {
    let imageKey: string | null = null;
    try {
      if (imageCourse) {
        imageKey = await this.uploadService.uploadFileMetadata(
          imageCourse,
          'images-courses'
        );
      }
      const courseResponse = plainToInstance(CourseRequestDto, body);
      await validateOrReject(courseResponse, { whitelist: true, forbidNonWhitelisted: true });
      return await this.courseService.createCourse(courseResponse, user, imageKey);
    } catch (error) {
      this.logger.error('Error in create course.', error);
      throw handleAppError(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Put('update/:idCourse')
  @UseInterceptors(FileInterceptor(
    'imageCourse', 
    multerFileOptions('./uploads/images-courses', /^image\/(jpeg|png|jpg|webp)$/)
    ),
  )
  @ApiOperation({summary: 'Update course'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CourseUpdateDto })
  @ApiResponse({ status: 200, description:'Success', type: Boolean})
  @ApiResponse({status:400, description: 'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({status: 403, description: 'Forbidden'})
  @ApiResponse({ status: 404, description: 'Not Found'})
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiParam({  name: 'idCourse', type: String, description: 'ID of course' })
  async updateCourse(
    @Param('idCourse') idCourse: string,
    @Body() body: any,
    @CurrentUser() user: number,
    @UploadedFile() imageCourse: Express.Multer.File
  ): Promise<boolean>{
    let imageKey: string | null = null;
    try {
      if (imageCourse) {
        imageKey = await this.uploadService.uploadFileMetadata(
          imageCourse,
          'images-courses'
        );
      }
      const updateCourse = plainToInstance(CourseUpdateDto, body);
      await validateOrReject(updateCourse, { whitelist: true, forbidNonWhitelisted: true });
      return await this.courseService.updateCourse(+idCourse, updateCourse, user, imageKey);
    } catch (error) {
      this.logger.error('Error in create course.', error);
      throw handleAppError(error);
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('visibility/:idCourse')
  @ApiOperation({summary: 'Soft delete course'})
  @ApiResponse({ status: 200, description:'Success'})
  @ApiResponse({status:400, description: 'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({status: 403, description: 'Forbidden'})
  @ApiResponse({ status: 404, description: 'Not Found'})
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiParam({  name: 'idCourse', type: String, description: 'ID of course' })
  async toggleCourseVisibility(@Param('idCourse') idCourse: string): Promise<void> {
    await this.courseService.toggleCourseVisibility(+idCourse);
  }

    
  @HttpCode(HttpStatus.OK)
  @Get('find-many')
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
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
    @CurrentUser() user: number,
    @CurrentUser('role') role: Role
  ): Promise<CoursePaginationResponseDto> {
    return await this.courseService.findManyCoursePagination(limit, page, user, role);
  }
}
import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseUpdateDto } from './dto/course-update.dto';
import { CourseRequestDto } from './dto/course-request.dto';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CourseResponseDto } from './dto/course-response.dto';
import { CoursePaginationResponseDto } from './dto/course-pagination-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Course')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
  
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({summary: 'Create course'})
  @ApiResponse({ status: 200, description:'Success'})
  @ApiResponse({status:400, description:'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  async createCourse(
    @Body() courseResponse: CourseRequestDto,
    @CurrentUser() user: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<boolean> {
    return await this.courseService.createCourse(courseResponse, user, file);
  }

  @HttpCode(HttpStatus.OK)
  @Get('find-one/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({summary: 'Find one course'})
  @ApiResponse({ status: 200, description:'Success', type: CourseResponseDto})
  @ApiResponse({status:400, description: 'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({ status: 404, description: 'Not Found'})
  async findOneCourse(@Param('id') idCourse: string): Promise<CourseResponseDto> {
    return await this.courseService.findOneCourse(+idCourse);
  }

  @HttpCode(HttpStatus.OK)
  @Put('update/:id')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor ('image'))
  @ApiOperation({summary: 'Update course'})
  @ApiResponse({ status: 200, description:'Success', type: Boolean})
  @ApiResponse({status:400, description: 'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({ status: 404, description: 'Not Found'})
  async updateCourse(
    @Param('id') idCourse: string,
    @Body() updateCourse: CourseUpdateDto,
    @CurrentUser() user: number,
    @UploadedFile() image: Express.Multer.File
  ): Promise<boolean>{
    return await this.courseService.updateCourse(+idCourse, updateCourse, user, image);
  }
  
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({summary: 'Delete course'})
  @ApiResponse({ status: 200, description:'Success'})
  @ApiResponse({status:400, description: 'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({ status: 404, description: 'Not Found'})
  async deleteCourse(@Param('id') idCourse: string): Promise<void> {
    await this.courseService.deleteCourse(+idCourse);
  }

  @HttpCode(HttpStatus.OK)
  @Get('find-many-pagination')
  @Roles(Role.STUDENT, Role.ADMIN)
  @ApiOperation({ summary: 'Find many courses with pagination' })
  @ApiResponse({ status: 200, description:'Success', type: CoursePaginationResponseDto })
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({ status: 404, description: 'Not Found'})
  async findManyCoursePagination(
    @Query('page') page?: number
  ): Promise<CoursePaginationResponseDto> {
    return await this.courseService.findManyCoursePagination(page);
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


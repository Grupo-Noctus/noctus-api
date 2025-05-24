import { Controller, Get, Param, HttpCode, HttpStatus, Query, Logger, Inject } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CourseResponseDto } from './dto/response/course.response.dto';
import { CoursePaginationResponseDto } from './dto/response/course-pagination.response.dto';
import { ICourseService } from './interface/course.service.interface';
import { Role } from '@prisma/client';
import { coursePreviewDto } from './dto/response/course-preview.response';

@ApiTags('Course')
@Controller('course')
export class CourseController {
  private readonly logger = new Logger(CourseController.name)
  constructor(
    @Inject('ICourseService') 
    private readonly courseService: ICourseService
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('find-many')
  @ApiOperation({ summary: 'Find many courses' })
  @ApiResponse({ status: 200, description:'Success', type: [CourseResponseDto] })
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({ status: 404, description: 'Not Found'})
  async findManyCourse(
    @CurrentUser() user: number
  ): Promise<CourseResponseDto[]> {
    return await this.courseService.findManyCourse(user);
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
    @CurrentUser() user: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<CoursePaginationResponseDto> {
    return await this.courseService.findManyCoursePagination(user, limit, page);
  }

  @HttpCode(HttpStatus.OK) 
  @Get('preview/:idCourse')
  @ApiOperation({summary: 'Find one course'})
  @ApiResponse({ status: 200, description:'Success', type: coursePreviewDto})
  @ApiResponse({status:400, description: 'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({ status: 403, description: 'Course is hidden (soft deleted) and cannot be accessed' })
  @ApiResponse({ status: 404, description: 'Not Found'})
  @ApiParam({  name: 'idCourse', type: String, description: 'ID do curso' })
  async findOneCourse(
    @Param('idCourse') idCourse: string,
    @CurrentUser() user: number,
    @CurrentUser('role') role: Role
  ): Promise<coursePreviewDto> {
    return await this.courseService.findOneCoursePreview(+idCourse, user, role);
  }
}

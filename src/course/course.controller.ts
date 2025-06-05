import { Controller, Get, Param, HttpCode, HttpStatus, Logger, Inject } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ICourseService } from './interface/course.service.interface';
import { Role } from '@prisma/client';
import { coursePreviewDto } from './dto/response/course-preview.response';

@ApiTags('Course')
@Controller('course')
export class CourseController {
  private readonly logger = new Logger(CourseController.name);
  constructor(
    @Inject('ICourseService')
    private readonly courseService: ICourseService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('preview/:idCourse')
  @ApiOperation({ summary: 'Find one course preview' })
  @ApiResponse({ status: 200, description: 'Success', type: coursePreviewDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Course is hidden (soft deleted) and cannot be accessed',
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiParam({ name: 'idCourse', type: String, description: 'ID do curso' })
  async findOneCourse(
    @Param('idCourse') idCourse: string,
    @CurrentUser() user: number,
    @CurrentUser('role') role: Role,
  ): Promise<coursePreviewDto> {
    return await this.courseService.findOneCoursePreview(+idCourse, user, role);
  }

  //Criar pegar todos os cursos preview
}

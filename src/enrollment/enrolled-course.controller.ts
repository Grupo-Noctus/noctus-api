import { Controller, Get, HttpCode, HttpStatus, Inject, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorator/role.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EnrolledCourseDto } from './dto/response/enrolled-course.response.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { IEnrolledCourseService } from './interface/enrolled-course.interface';
import { EnrollmentGuard } from 'src/auth/guard/enrrolment.guard';

@ApiTags('EnrollmentCourse')
@Controller('enrollment-course')
@Roles(Role.STUDENT)
@UseGuards(EnrollmentGuard)
export class EnrroledCourseController {
  constructor(
    @Inject('IEnrolledCourseService')
    private readonly enrolledCourseService: IEnrolledCourseService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('find-many')
  @ApiOperation({ summary: 'Find couse per enrollments' })
  @ApiResponse({ status: 200, description: 'Success', type: [EnrolledCourseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findCoursesPerEnrollment(
    @CurrentUser() user: number,
    @CurrentUser('role') role: Role,
  ): Promise<EnrolledCourseDto[] | []> {
    return await this.enrolledCourseService.findCoursesPerEnrollment(user, role);
  }
}

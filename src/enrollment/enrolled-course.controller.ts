import { Controller, Get, HttpCode, HttpStatus, Inject } from "@nestjs/common";
import { EnrolledCourseService } from "./enrolled-course.service";
import { Role } from "@prisma/client";
import { Roles } from "src/auth/decorator/role.decorator";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { EnrolledCourseDto } from "./dto/response/enrolled-course.response.dto";
import { CurrentUser } from "src/auth/decorator/current-user.decorator";

@ApiTags('EnrollmentCourse')
@Controller('enrollment-course')
@Roles(Role.STUDENT)
export class EnrroledCourseController {
    constructor(
        @Inject('IEnrolledCourseService')
        private readonly enrolledCourseService: EnrolledCourseService
    ) {}

    @HttpCode(HttpStatus.OK)
    @Get('find-many')
    @ApiOperation({ summary: 'Find couse per enrollments' })
    @ApiResponse({ status: 200, description:'Success', type: [EnrolledCourseDto] })
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @ApiResponse({ status: 404, description: 'Not Found'})
    async findCoursesPerEnrollment(@CurrentUser() user: number): Promise<EnrolledCourseDto[] | []> {
        return await this.enrolledCourseService.findCoursesPerEnrollment(user);
    }
}
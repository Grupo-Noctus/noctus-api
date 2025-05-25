import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
  Inject,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBody, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { EnrollmentRequestDto } from './dto/request/enrollment.request.dto';
import { EnrollmentUpdateDto } from './dto/update/enrollment.update.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { EnrollmentResponseDto } from './dto/response/enrollment.response.dto';
import { EnrollmentPaginationResponseDto } from './dto/response/enrollment-pagination.response.dto';
import { PreEnrollmentDto } from './dto/request/pre-enrollment.request.dto';

@ApiTags('Enrollment')
@Controller('enrollment')
@Roles(Role.ADMIN)
export class EnrollmentController {
  constructor(
    @Inject('IEnrollmentService')
    private readonly enrollmentService: EnrollmentService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @ApiOperation({ summary: 'Create a new enrollment' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createEnrollment(
    @Body() enrollmentResponse: EnrollmentRequestDto,
    @CurrentUser() user: number,
  ): Promise<boolean> {
    return await this.enrollmentService.createEnrollment(enrollmentResponse, user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('pending/:idCourse')
  @ApiOperation({ summary: 'Create a pre-enrollments' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createPreEnrollment(
    @Param('idCourse') idCourse: string,
    @Body() enrollmentResponse: PreEnrollmentDto,
    @CurrentUser() user: number,
  ): Promise<boolean> {
    return await this.enrollmentService.createPreEnrollment(+idCourse, enrollmentResponse, user);
  }

  @HttpCode(HttpStatus.OK)
  @Put('update/:id')
  @ApiOperation({ summary: 'Update an existing enrollment' })
  @ApiBody({ type: EnrollmentUpdateDto })
  @ApiResponse({ status: 200, description: 'Success', type: Boolean })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateEnrollment(
    @Param('id') idEnrollment: string,
    @Body() updateEnrollment: EnrollmentUpdateDto,
    @CurrentUser() user: number,
  ): Promise<boolean> {
    return await this.enrollmentService.updateEnrollment(+idEnrollment, updateEnrollment, user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('find-many/:idCourse')
  @ApiOperation({ summary: 'Find many enrollments' })
  @ApiResponse({ status: 200, description: 'Success', type: EnrollmentPaginationResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
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
  async findManyEnrollment(
    @Param('idCourse') idCourse: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
  ): Promise<EnrollmentPaginationResponseDto> {
    return await this.enrollmentService.findManyEnrollment(+idCourse, limit, page);
  }

  @HttpCode(HttpStatus.OK)
  @Get('get-one/:id')
  @ApiOperation({ summary: 'Get enrollment by ID' })
  @ApiResponse({ status: 200, description: 'Success', type: EnrollmentResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getEnrollmentById(@Param('id') idEnrollment: string): Promise<EnrollmentResponseDto> {
    return await this.enrollmentService.getEnrollmentById(+idEnrollment);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete an enrollment by ID' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteEnrollment(@Param('id') idEnrollment: string): Promise<void> {
    await this.enrollmentService.deleteEnrollment(+idEnrollment);
  }
}

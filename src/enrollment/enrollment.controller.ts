import { Body, Controller, Get, Param, Post, Put, Delete, HttpStatus, HttpCode, Query } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EnrollmentRequestDto } from './dto/enrollment-request.dto';
import { EnrollmentUpdateDto } from './dto/enrollment-update.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { EnrollmentResponseDto } from './dto/enrollment-response.dto';
import { EnrollmentPaginationResponseDto } from './dto/enrollment-pagination-response.dto';

@ApiTags('Enrollment')
@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new enrollment'})
  @ApiResponse({ status: 200, description:'Success'})
  @ApiResponse({status:400, description:'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  async createEnrollment(@Body() enrollmentResponse: EnrollmentRequestDto, @CurrentUser() user: number): Promise<boolean> {
    return await this.enrollmentService.createEnrollment(enrollmentResponse, user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('get-one/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get enrollment by ID' })
  @ApiResponse({ status: 200, description:'Success', type: EnrollmentResponseDto})
  @ApiResponse({status:400, description: 'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({ status: 404, description: 'Not Found'})
  async getEnrollmentById(@Param('id') idEnrollment: string): Promise<EnrollmentResponseDto> {
    return await this.enrollmentService.getEnrollmentById(+idEnrollment); 
  }
  
  @HttpCode(HttpStatus.OK)
  @Put('update/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update an existing enrollment' })
  @ApiBody({ type: EnrollmentUpdateDto })
  @ApiResponse({ status: 200, description:'Success', type: Boolean})
  @ApiResponse({status:400, description: 'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({ status: 404, description: 'Not Found'})
  async updateEnrollment(
    @Param('id') idEnrollment: String, 
    @Body() updateEnrollment: EnrollmentUpdateDto,
    @CurrentUser() user: number 
  ): Promise<boolean> {
    return await this.enrollmentService.updateEnrollment(+idEnrollment, updateEnrollment, user);
  }
  
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete an enrollment by ID' })
  @ApiResponse({ status: 200, description:'Success'})
  @ApiResponse({status:400, description: 'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({ status: 404, description: 'Not Found'})
  async deleteEnrollment(@Param('id') idEnrollment: string): Promise<void> {
    await this.enrollmentService.deleteEnrollment(+idEnrollment);
  }

  @HttpCode(HttpStatus.OK)
  @Get('find-many')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Find many enrollments' })
  @ApiResponse({ status: 200, description:'Success', type: EnrollmentPaginationResponseDto })
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({ status: 404, description: 'Not Found'})
  async findManyEnrollment(@Query() page: number): Promise<EnrollmentPaginationResponseDto> {
    return await this.enrollmentService.findManyEnrollment(page);
  }
}

import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EnrollmentRequestDto } from './dto/enrollment-request.dto';
import { EnrollmentUpdateDto } from './dto/enrollment-update.dto';
import { Public } from 'src/auth/decorator/public.decorator';


@ApiTags('Enrollment')
@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Roles(Role.ADMIN)
  @Post('create')
  @ApiOperation({
    summary: 'Create a new enrollment'
  })
  @ApiResponse({ status: 200, description: 'Enrollment created successfully' })
  @ApiResponse({ status: 404, description: 'Error creating enrollment' })
  @ApiBody({ type: EnrollmentRequestDto })
  async createEnrollment(@Body() enrollmentDto: EnrollmentRequestDto) {
    return await this.enrollmentService.createEnrollment(enrollmentDto);
  }

  @Roles(Role.ADMIN)
  @Get('get/:id')
  @ApiOperation({ summary: 'Get enrollment by ID' })
  @ApiResponse({ status: 200, description: 'Enrollment found' })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  async getEnrollmentById(@Param('id') id: string) {
    return await this.enrollmentService.getEnrollmentById(+id); 
  }
  
  @Roles(Role.ADMIN)
  @Put('update/:id')
  @ApiOperation({ summary: 'Update an existing enrollment' })
  @ApiBody({ type: EnrollmentUpdateDto })
  @ApiResponse({ status: 200, description: 'Enrollment updated successfully.' })
  @ApiResponse({ status: 404, description: 'Enrollment not found.' })
  async updateEnrollment(
    @Param('id') id: number, 
    @Body() enrollmentDto: EnrollmentUpdateDto,  
  ) {
    return await this.enrollmentService.updateEnrollment(id, enrollmentDto);
  }
  
  @Roles(Role.ADMIN)
  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete an enrollment by ID' })
  @ApiResponse({ status: 200, description: 'Enrollment deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Enrollment not found.' })
  async deleteEnrollment(@Param('id') id: string) {
    return await this.enrollmentService.deleteEnrollment(+id);
}

}

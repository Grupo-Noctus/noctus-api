import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamRequestDto } from './dto/exam-request.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { userInfo } from 'os';
import { ExamResponseDto } from './dto/exam-response.dto';

@ApiTags('Exam')
@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create/:idModule')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new exam'})
  @ApiResponse({ status: 200, description:'Success'})
  @ApiResponse({status:400, description:'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiParam({ name: 'idExam', type: String, description:'Exam ID'})
  async createExam(
    @Param('idModule') idModule: string,
    @Param('idExam') idExam: string,
    @Body() examRequestDto: ExamRequestDto, 
    @CurrentUser() user: number
  ): Promise<boolean> {
    return await this.examService.createExam(+idExam, +idModule, examRequestDto, user);
  }

  @HttpCode(HttpStatus.OK)
  @Put('update/:idModule/:idExam')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update an exam '})
  @ApiResponse({ status: 200, description:'Success', type: Boolean})
  @ApiResponse({status:400, description:'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  async updateExam(
    @Param('idModule') idModule: string,
    @Param('idExam') idExam: string,
    @Body() updateExamDto: UpdateExamDto,
    @CurrentUser() user: number
  ): Promise <boolean> {
    return await this.examService.updateExam(+idModule,+idExam, updateExamDto, user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('find-many/:idModule')
  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({summary: 'Find many exams from a module'})
  @ApiResponse({ status: 200, description:'Success', type: [ExamResponseDto]})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({ status: 404, description: 'Not Found'})  
  async findManyExams(
    @Param('idModule') idModule: string,
    @Param('idExam') idExam: string
  ): Promise <ExamResponseDto[]> {
    return await this.examService.findManyExams(+idModule, +idExam);
  }

  @HttpCode(HttpStatus.OK)
  @Get('find-one/:idModule/:idExam')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Find One exam of Module'})
  @ApiResponse({ status: 200, description:'Success', type: ExamResponseDto})
  @ApiResponse({status:400, description:'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  async findOneExam(
    @Param('idModule') idModule: string,
    @Param('idExam') idExam: string
  ) {
    return await this.examService.findOneExam(+idModule, +idExam);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete/:idModule/:idExam')
  @Roles(Role.ADMIN)
  @ApiOperation({summary: 'Delete a exam of a Module'})
  @ApiResponse({ status: 200, description:'Success'})
  @ApiResponse({status:400, description: 'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({ status: 404, description: 'Not Found'})
  async deleteExam(
    @Param('idModule') idModule: string,
    @Param('idExam') idExam: string
  ): Promise<void> {
    await this.examService.deleteExam(+idModule, +idExam);
  }
}

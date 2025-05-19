import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionRequestDto } from './dto/question-request.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { QuestionResponseDto } from './dto/question-response.dto';

@ApiTags('Question')
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}
  
  @HttpCode(HttpStatus.CREATED)
  @Post('create/:idModule/:idExam')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new Question for an exam'})
  @ApiResponse({ status: 200, description:'Success'})
  @ApiResponse({status:400, description:'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiParam({ name: 'idQuestion', type: String, description:'Question ID'})
  async createQuestion(
    @Param('idModule') idModule: string,
    @Param('idExam') idExam: string,
    @Body() questionRequestDto: QuestionRequestDto, 
    @CurrentUser() user: number
  ): Promise<boolean> {
    return await this.questionService.createQuestion(+idModule,+idExam, questionRequestDto, user);
  }

  @HttpCode(HttpStatus.OK)
  @Put('update/:idModule/:idExam/:idQuestion')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update Question of an exam'})
  @ApiResponse({ status: 200, description:'Success', type: Boolean})
  @ApiResponse({status:400, description:'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  async updateQuestion(
    @Param('idModule') idModule: string,
    @Param('idExam') idExam: string,
    @Param('idQuestion') idQuestion: string, 
    @Body() updateQuestionDto: UpdateQuestionDto,
    @CurrentUser() user: number
  ): Promise <boolean> {
    return await this.questionService.updateQuestion(+idModule,+idExam,+idQuestion, updateQuestionDto, user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('find-many/:idModule/:idExam')
  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({summary: 'Find many questions of an exam'})
  @ApiResponse({ status: 200, description:'Success', type: [QuestionResponseDto]})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({ status: 404, description: 'Not Found'})  
  async findManyQuestion(
    @Param('idModule') idModule: string,
    @Param('idExam') idExam: string,
  ): Promise <QuestionResponseDto[]> {
    return await this.questionService.findManyQuestion(+idModule,+idExam);
  }

  @HttpCode(HttpStatus.OK)
  @Get('find-one/:idModule/:idExam/:idQuestion')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Find One Question of exam'})
  @ApiResponse({ status: 200, description:'Success', type: QuestionResponseDto})
  @ApiResponse({status:400, description:'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  async findOneQuestion(
    @Param('idModule') idModule: string,
    @Param('idExam') idExam: string,
    @Param('idQuestion') idQuestion: string
  ) {
    return await this.questionService.findOneQuestion(+idModule,+idExam,+idQuestion);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete/:idModule/:idExam/:idQuestion')
  @Roles(Role.ADMIN)
  @ApiOperation({summary: 'Delete a question of exam'})
  @ApiResponse({ status: 200, description:'Success'})
  @ApiResponse({status:400, description: 'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({ status: 404, description: 'Not Found'})
  async deleteQuestion(
    @Param('idModule') idModule: string,
    @Param('idExam') idExam: string,
    @Param('idQuestion') idQuestion: string
  ): Promise<void> {
    await this.questionService.deleteQuestion(+idModule,+idExam,+idQuestion);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionRequestDto } from './dto/question-request.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';

@ApiTags('Question')
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new Question'})
  @ApiResponse({ status: 200, description:'Success'})
  @ApiResponse({status:400, description:'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  async createQuestion(@Body() QuestionRequestDto: QuestionRequestDto, @CurrentUser() user: number): Promise<boolean> {
    return await this.questionService.createQuestion(QuestionRequestDto, user);
  }

  @Get()
  findAll() {
    return this.questionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(+id);
  }
}

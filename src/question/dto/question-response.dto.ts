import { IsInt, IsString, IsEnum, IsArray } from 'class-validator';
import { Type } from 'class-transformer'; // ajuste o caminho se necessário
import { QuestionOptionDto } from './question-option.dto';
import { TypeQuestion } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class QuestionResponseDto {

    @ApiProperty({ description: 'ID of the question', example: 1 })
  id: number;

  @ApiProperty({ description: 'ID of the exam associated with the question', example: 1 })
  idExam: number;

  @ApiProperty({ description: 'Text of the question', example: 'How many variables has...' })
  questionText: string;

  @ApiProperty({ enum: TypeQuestion, example: TypeQuestion })
  type: TypeQuestion;

  @ApiProperty({ example: 1 })
  order: number;

  @ApiProperty({
    description: 'Question options',
    type: QuestionOptionDto,
    isArray: true,
    example: [
      { optionText: 'Option A', correct: true },
      { optionText: 'Option B', correct: false },
    ],
  })
  options: QuestionOptionDto[];

  @ApiProperty({ type: String, example: '2025-05-13T19:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ type: String, example: '2025-05-13T19:10:00.000Z' })
  updatedAt: Date;
}

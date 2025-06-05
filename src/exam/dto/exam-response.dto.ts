import { ApiProperty } from '@nestjs/swagger';
import { QuestionResponseDto } from 'src/question/dto/question-response.dto';

export class ExamResponseDto {

  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 2 })
  idModule: number;

  @ApiProperty({ example: 'Java Exam' })
  title: string;

  @ApiProperty({ example: 'Java teory', required: false })
  description?: string;

  @ApiProperty({ example: '2025-05-13T19:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: 101, required: false })
  createdBy?: number;

  @ApiProperty({ example: '2025-05-13T20:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ example: 102 })
  updatedBy: number;

  @ApiProperty({
    type: [QuestionResponseDto],
    description: 'List of questions',
  })
  questions: QuestionResponseDto[];
}

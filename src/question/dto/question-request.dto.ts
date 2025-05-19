import { QuestionOptions, TypeQuestion } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Min, ValidateNested } from "class-validator";
import { QuestionOptionDto } from "./question-option.dto";
import { ApiProperty } from "@nestjs/swagger";

export class QuestionRequestDto {

  @ApiProperty({
    description: 'ID of the exam',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  idExam: number;

  @ApiProperty({
    description: 'Text of the question',
    example: 'What is a variable?',
  })
  @IsString()
  @IsNotEmpty()
  questionText: string;

  @ApiProperty({
    enum: TypeQuestion,
    example: TypeQuestion.MULTIPLE_CHOICE, // ajuste com o valor real
  })
  @IsEnum(TypeQuestion)
  @IsNotEmpty()
  type: TypeQuestion;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  @Min(1)
  order?: number;

  @ApiProperty({
    description: 'Question options',
    type: [QuestionOptionDto],
    example: [
      { optionText: 'Option A', correct: true },
      { optionText: 'Option B', correct: false },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionOptionDto)
  options: QuestionOptionDto[];


  }


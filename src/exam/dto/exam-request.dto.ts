import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";

export class ExamRequestDto {

  @ApiProperty({ example: 1, description: 'ID of the module with the exam' })
  @IsInt()
  idModule: number;

  @ApiProperty({ example: 'Exam of Java', description: 'Title of the exam' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Java teory', description: 'Optional description' })
  @IsOptional()
  @IsString()
  description?: string;
    

}

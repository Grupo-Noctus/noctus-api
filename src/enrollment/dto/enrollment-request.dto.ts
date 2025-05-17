import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class EnrollmentRequestDto {
  
  @IsNotEmpty()
  @IsInt()
  @IsOptional()
  @ApiProperty({
    description: 'Student\s ID',
    example: 123,
    type: Number,
  })
  idStudent?: number;

  @IsNotEmpty()
  @IsInt()
  @IsOptional()
  @ApiProperty({
    description: 'Course\s ID',
    example: 1,
    type: Number,
  })
  idCourse?: number;
}

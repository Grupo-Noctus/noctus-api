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
  
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Enrollment activation status',
    example: true,
    type: Boolean,
  })
  active?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Enrollment completion status',
    example: true,
    type: Boolean,
  })
  completed?: boolean;

  @Type(() => Date)
  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Registration start date in ISO format (YYYY-MM-DD)',
     example: '2023-03-23T15:00:00.000Z',
    type: Date,
  })
  startDate?: Date;

  @Type(() => Date)
  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Enrollment end date in ISO format (YYYY-MM-DD)',
    example: '2023-03-23T15:00:00.000Z',
    type: Date,
  })
  endDate?: Date;
}

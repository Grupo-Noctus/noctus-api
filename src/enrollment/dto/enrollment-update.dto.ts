import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class EnrollmentUpdateDto {

  @ApiProperty({
    description: 'Student\s ID',
    type: Number,
    example: 123,
    required: false,
  })
  @IsInt()
  @IsOptional()
  idStudent?: number;

  @ApiProperty({
    description: 'Course\s ID',
    type: Number,
    example: 456,
    required: false,
  })
  @IsInt()
  @IsOptional()
  idCourse?: number;

  @ApiProperty({
    description: 'Registration activation status',
    type: Boolean,
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiProperty({
    description: 'Enrollment completion status',
    type: Boolean,
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @ApiProperty({
    description: 'Registration start date',
    type: Date,
    example: '2025-03-22T10:00:00Z',
    required: false,
  })
  @Type(() => Date)
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({
    description: 'Enrollment end date',
    type: Date,
    example: '2025-06-22T10:00:00Z',
    required: false,
  })
  @Type(() => Date)
  @IsDateString()
  @IsOptional()
  endDate?: Date;
}

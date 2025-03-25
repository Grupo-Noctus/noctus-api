import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class EnrollmentRequestDto {

  @ApiProperty({
    description: 'Student\s ID',
    example: 123,
    type: Number,
  })
  @IsInt()
  idStudent: number;

  @ApiProperty({
    description: 'Course\s ID',
    example: 1,
    type: Number,
  })
  @IsInt()
  idCourse: number;
    
  @ApiProperty({
    description: 'Enrollment activation status',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  active: boolean;

  @ApiProperty({
    description: 'Enrollment completion status',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  completed: boolean;

  @ApiProperty({
    description: 'Registration start date',
     example: '2025-03-22T10:00:00Z',
    type: Date,
  })
  @Type(() => Date)
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    description: 'Enrollment end date',
    example: '2025-06-22T10:00:00Z',
    type: Date,
  })
  @Type(() => Date)
  @IsDateString()
  endDate: Date;
}

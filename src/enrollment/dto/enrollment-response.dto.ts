import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class EnrollmentResponseDto {

  @IsBoolean()
  @ApiProperty({
    description: 'Enrollment activation status',
    example: true,
    type: Boolean,
  })
  active: boolean;

  @IsBoolean()
  @ApiProperty({
    description: 'Enrollment completion status',
    example: false,
    type: Boolean,
  })
  completed: boolean;

  @Type(() => Date)
  @IsDateString()
  @ApiProperty({
    description: 'Registration start date in ISO format (YYYY-MM-DD)',
    example: '2023-03-23T15:00:00.000Z',
    type: Date,
  })
  startDate: Date;

  @Type(() => Date)
  @IsDateString()
  @ApiProperty({
    description: 'Enrollment end date in ISO format (YYYY-MM-DD)',
    example: '2023-06-23T15:00:00.000Z',
    type: Date,
  })
  endDate: Date;

  @IsString()
  @ApiProperty({
    description: 'Username',
    example: 'Maria Luiza',
    type: String,
  })
  name: String;

  @IsString()
  @ApiProperty({
    description: 'Course name',
    example: 'Advanced Java',
    type: String,
  })
  nameCourse: String;
}

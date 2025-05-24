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

  @ApiProperty({
    description: '',
    example: '',
    type: Date,
  })
  expiresAt: Date;

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

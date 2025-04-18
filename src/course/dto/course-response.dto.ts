import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, IsDateString, IsOptional } from 'class-validator';

export class CourseResponseDto {
  @ApiProperty({
    example: '1',
    description: 'Id of course.'
  })
  id: number;

  @ApiProperty({
    example: 'Full-Stack Web Development',
    description: 'The name of the course.'
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Learn to build web applications using React, Node.js, and MongoDB.',
    description: 'A short description summarizing the course content and goals.'
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: 'https://example.com/images/fullstack-course.png',
    description: 'Optional URL of the course cover image.'
  })
  @IsOptional()
  @IsUrl()
  image: string;

  @ApiProperty({
    example: '2023-03-23T15:00:00.000Z',
    description: 'Start date of course in ISO format (YYYY-MM-DD)',
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    example: '2023-06-23T15:00:00.000Z',
    description: 'End date of course in ISO format (YYYY-MM-DD)',
  })
  @IsNotEmpty()
  @IsDateString()
  endDate: Date;
}

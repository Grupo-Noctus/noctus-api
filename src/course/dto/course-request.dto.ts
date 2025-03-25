import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDate } from 'class-validator';

export class CourseRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Full-Stack Web Development',
    description: 'The name of the course.'
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Learn to build web applications using React, Node.js, and MongoDB.',
    description: 'A short description summarizing the course content and goals.'
  })
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'https://example.com/images/fullstack-course.png',
    description: 'Optional URL of the course cover image.'
  })
  image: string;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty({
    example: '2023-03-23T15:00:00.000Z',
    description: 'Start date of course in ISO format (YYYY-MM-DD)',
  })
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty({
    example: '2023-06-23T15:00:00.000Z',
    description: 'End date of course in ISO format (YYYY-MM-DD)',
  })
  endDate: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '<html><body><h1>Certificate of Completion</h1><p>This certifies that {{name}} has completed the {{courseName}} course.</p></body></html>',
    description: 'HTML template used to generate the course completion certificate PDF. Supports variables like {{name}}, {{courseName}}, and {{date}}.'
  })
  certificateModel: string;
}

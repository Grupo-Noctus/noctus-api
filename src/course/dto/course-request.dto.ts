import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

export class CourseRequestDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty({
    example: 'Full-Stack Web Development',
    description: 'The name of the course.',
  })
  name: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  @ApiProperty({
    example: 'Learn to build web applications using React, Node.js, and MongoDB.',
    description: 'A short description summarizing the course content and goals.',
  })
  description: string;

  @IsInt({ message: 'Duration in days must be an integer' })
  @Min(1, { message: 'Duration in days must be at least 1' })
  @Transform(({ value }) => Number(value))
  @ApiProperty({
    example: 21,
    description: 'Duration of course in days',
  })
  duration: number;

  @IsOptional()
  @IsString({ message: 'Certificate model must be a string (HTML)' })
  @ApiProperty({
    example:
      '<html><body><h1>Certificate of Completion</h1><p>This certifies that {{name}} has completed the course.</p></body></html>',
    description:
      'HTML template used to generate the course completion certificate PDF. Supports variables like {{name}}.',
    nullable: true,
    required: false,
  })
  certificateModel?: string;
}

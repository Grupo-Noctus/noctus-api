import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, IsOptional } from 'class-validator';
import { ModuleWithVideosResponseDto } from 'src/module/dto/response/module-and-video-response.dto';

export class CourseResponseDto {
  @ApiProperty({
    example: '1',
    description: 'Id of course.',
  })
  id: number;

  @ApiProperty({
    example: 'Full-Stack Web Development',
    description: 'The name of the course.',
  })
  name: string;

  @ApiProperty({
    example: 'Learn to build web applications using React, Node.js, and MongoDB.',
    description: 'A short description summarizing the course content and goals.',
  })
  description: string;

  @ApiProperty({
    example: 'https://example.com/images/fullstack-course.png',
    description: 'Optional URL of the course cover image.',
  })
  image: string;

  @ApiProperty({
    example: 21,
    description: 'Duration of course in days',
  })
  duration: number;

  @ApiProperty({
    type: [ModuleWithVideosResponseDto],
    description: 'List of course modules including their videos',
  })
  modules: ModuleWithVideosResponseDto[];
}

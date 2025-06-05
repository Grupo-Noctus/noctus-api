import { ApiProperty } from '@nestjs/swagger';
import { ModuleResponseDto } from 'src/module/dto/response/module-response.dto';

export class coursePreviewDto {
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
  @ApiProperty({
    type: [ModuleResponseDto],
    description: 'List of modules in the course.',
  })
  modules: ModuleResponseDto[];

  @ApiProperty({
    example: 5,
    description: 'Total number of modules in the course.',
  })
  countModules: number;

  @ApiProperty({
    example: 240,
    description: 'Total duration of all videos in the course.',
  })
  durationVideos: number;

  @ApiProperty({
    example: 15,
    description: 'Total number of videos in the course.',
  })
  countVideos: number;
}

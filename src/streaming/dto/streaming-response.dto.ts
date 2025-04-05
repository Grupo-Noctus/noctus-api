import { ApiProperty } from '@nestjs/swagger';

export class StreamingResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the video lecture',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the video lecture',
    example: 'Introduction to NestJS',
  })
  name: string;

  @ApiProperty({
    description: 'A brief description of the video lecture',
    example: 'This video covers the basics of NestJS framework.',
  })
  description: string;

  @ApiProperty({
    description: 'The duration of the video lecture in seconds',
    example: 3600,
  })
  duration: number;

  @ApiProperty({
    description: 'The display order of the video lecture in the module',
    example: 1,
  })
  order: number;
}

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
    description: 'Unique identifier of the video progress record',
    example: 1,
  })
  idProgressVideo?: number | null;

  @ApiProperty({
    description: 'Amount of the video in percentage the student has watched',
    example: 1,
  })
  viewed?: number | null;
}

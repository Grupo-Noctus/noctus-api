import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class StreamingRequest {
  @ApiProperty({
    description: 'The name of the video',
    type: String,
    example: 'Introduction to NestJS',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the video',
    type: String,
    example: 'This video covers the basics of NestJS framework.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The URL or path of the thumbnail image',
    type: String,
    example: '/uploads/thumbnails/intro-thumbnail.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  thumbnail?: string;
}

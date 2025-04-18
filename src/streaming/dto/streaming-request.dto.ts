import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class StreamingRequest {
  @ApiProperty({
    description: 'The ID of the module the video belongs to',
    type: Number,
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  idModule: number;

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
    description: 'The display order of the video within the module',
    type: Number,
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  order: number;

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
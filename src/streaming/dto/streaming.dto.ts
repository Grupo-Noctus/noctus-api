import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class StreamingDto {
  @ApiProperty({
    description: 'The URL or path where the video file is stored',
    example: '/uploads/videos/abcd1234.mp4',
  })
  @IsString()
  url: string;

  @ApiProperty({
    description: 'The MIME type of the video file',
    example: 'video/mp4',
  })
  @IsString()
  mimetype: string;

  @ApiProperty({
    description: 'The size of the video file in bytes',
    example: 10485760,
  })
  @IsInt()
  size: number;
}

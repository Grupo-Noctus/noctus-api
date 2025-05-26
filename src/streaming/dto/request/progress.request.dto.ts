import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class SaveProgressDto {
  @ApiProperty({
    example: 40,
    description: 'Progress value in percentage for the video (0 to 100)',
    minimum: 0,
    maximum: 100,
  })
  @IsInt()
  @Min(0)
  progressVideo: number;
}

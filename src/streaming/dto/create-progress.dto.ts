import { ApiProperty } from "@nestjs/swagger";

export class CreateProgressDto {
   @ApiProperty({
    example: 40,
    description: 'Progress value in percentage for the video (0 to 100)',
    minimum: 0,
    maximum: 100,
  })
  progressVideo: number;
}

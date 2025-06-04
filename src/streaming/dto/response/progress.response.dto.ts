import { ApiProperty } from '@nestjs/swagger';

export class ProgressVideoDto {
  @ApiProperty({
    description: 'Unique identifier of the video progress record',
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Amount of the video in percentage the student has watched',
    type: Number,
    example: 75,
  })
  viewed: number;
}

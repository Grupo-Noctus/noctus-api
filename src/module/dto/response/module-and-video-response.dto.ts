import { ApiProperty } from '@nestjs/swagger';
import { StreamingResponseDto } from 'src/streaming/dto/streaming-response.dto';

export class ModuleWithVideosResponseDto {
  @ApiProperty({
    example: '1',
    description: 'Id of module.',
  })
  id: number;

  @ApiProperty({
    example: 'Full-stack Web Development',
    description: 'The name of the module in the course.',
  })
  name: string;

  @ApiProperty({
    example: 'Full-Stack Web Development course covering frontend and backend technologies.',
    description: 'A short description summarizing the content and goals of the module.',
  })
  description: string;

  @ApiProperty({
    example: 1,
    description: 'The order of the module in the course sequence (e.g., module 1, module 2, etc.).',
  })
  order: number;

  @ApiProperty({ type: [StreamingResponseDto] })
  videos: StreamingResponseDto[];
}

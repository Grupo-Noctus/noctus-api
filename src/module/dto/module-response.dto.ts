import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty, Min } from 'class-validator';

export class ModuleResponseDto {
  @ApiProperty({
    example: '1',
    description: 'Id of module.',
  })
  id: number;

  @ApiProperty({
    example: 'Full-stack Web Development',
    description: 'The name of the module in the course.',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Full-Stack Web Development course covering frontend and backend technologies.',
    description: 'A short description summarizing the content and goals of the module.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 1,
    description: 'The order of the module in the course sequence (e.g., module 1, module 2, etc.).',
  })
  @IsInt()
  @Min(1)
  order: number;
}

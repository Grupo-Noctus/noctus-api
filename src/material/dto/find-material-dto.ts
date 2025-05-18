import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindMaterialDto {
  @ApiPropertyOptional({ description: 'ID do curso para filtrar materiais', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idCourse?: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsInt } from 'class-validator';
import { TypeMidia } from '@prisma/client';

export class MaterialRequestDto {
  @ApiProperty({ example: 'Matemática Aula 1' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Material introdutório de matemática' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'https://link.com/material', description: 'Link para acesso do material' })
  @IsString()
  @IsNotEmpty()
  link: string;

  @ApiProperty({ enum: TypeMidia, example: TypeMidia.PDF })
  @IsEnum(TypeMidia)
  type: TypeMidia;

  @ApiProperty({ example: 1, description: 'ID do curso associado ao material' })
  @IsInt()
  idCourse: number;
}

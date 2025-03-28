import { IsInt, IsString, IsEnum, IsOptional } from 'class-validator';
import { TypeMidia } from '@prisma/client';

export class CreateMaterialDto {
  @IsInt()
  idCourse: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  filename: string;

  @IsEnum(TypeMidia)
  type: TypeMidia;

  @IsString()
  link: string;

  @IsInt()
  createdBy: number;

  @IsOptional()
  updatedBy: number;
}

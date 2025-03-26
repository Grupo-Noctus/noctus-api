import { IsInt, IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { TypeMidia } from '@prisma/client';

export class CreateMaterialDto {
  @IsInt()
  @IsNotEmpty()
  idCourse: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsEnum(TypeMidia)
  @IsNotEmpty()
  type: TypeMidia;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsInt()
  @IsNotEmpty()
  createdBy: number;

  @IsInt()
  @IsOptional()
  updatedBy?: number;
}

import { IsInt, IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TypeMidia } from '@prisma/client';

export class MaterialResponseDto {
  @ApiProperty({ 
    description: 'ID of the course associated with the material',
    example: 1 })
  @IsInt()
  idCourse: number;

  @ApiProperty({ 
    description: 'Name of the material',
    example: 'Mathematics Workbook' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    description: 'Description of the material', 
    example: 'Supplementary material for the Mathematics course' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ 
    description: 'Filename of the material', 
    example: 'mathematics_workbook.pdf' })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({ 
    description: 'Type of media for the material', 
    enum: TypeMidia })
  @IsNotEmpty()
  type: TypeMidia;

  @ApiProperty({ 
    description: 'Link to access the material', 
    example: 'https://example.com/materials/mathematics' })
  @IsString()
  @IsNotEmpty()
  link: string;

  @ApiProperty({ 
    description: 'ID of the user who created the material', 
    example: 42 })
    
  @IsInt()
  createdBy: number;

  @IsOptional()
  updatedBy: number;
  
  @IsOptional()
  file: Express.Multer.File;
}


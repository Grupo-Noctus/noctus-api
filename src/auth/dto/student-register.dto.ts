import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';
import { EducationLevel, State, Ethnicity, Gender } from '@prisma/client';

export class StudentRegisterDto {
  @ApiProperty({
    example: '2005-03-23T15:00:00.000Z',
    description: "Student's date of birth in ISO format (YYYY-MM-DD)",
  })
  @IsNotEmpty()
  @IsDateString()
  dateBirth: string;

  @ApiProperty({
    enum: EducationLevel,
    enumName: 'EducationLevel',
    description: "Student's education level",
  })
  @IsNotEmpty()
  @IsEnum(EducationLevel)
  educationLevel: EducationLevel;

  @ApiProperty({
    enum: State,
    enumName: 'State',
    description: "Student's state of residence",
  })
  @IsNotEmpty()
  @IsEnum(State)
  state: State;

  @ApiProperty({
    enum: Ethnicity,
    enumName: 'Ethnicity',
    description: "Student's ethnicity",
  })
  @IsNotEmpty()
  @IsEnum(Ethnicity)
  ethnicity: Ethnicity;

  @ApiProperty({
    enum: Gender,
    enumName: 'Gender',
    description: "Student's gender",
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: 'Indicates whether the student has a disability',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  hasDisability: boolean;

  @ApiPropertyOptional({
    description: 'Type of disability (if applicable)',
    example: 'Visual',
  })
  @IsOptional()
  @IsString()
  disabilityType?: string;

  @ApiProperty({
    description: 'Indicates whether the student requires support resources',
    example: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  needsSupportResources: boolean;

  @ApiPropertyOptional({
    description: 'Description of required support resources (if applicable)',
    example: 'Screen reader',
  })
  @IsOptional()
  @IsString()
  supportResourcesDescription?: string;
}

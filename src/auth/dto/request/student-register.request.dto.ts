import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EducationLevel, Ethnicity, Gender, State } from '@prisma/client';
import {
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsString,
  IsDateString,
  ValidateIf,
} from 'class-validator';

export class StudentRegisterDto {
  @ApiProperty({
    example: '2005-03-23T15:00:00.000Z',
    description: "Student's date of birth in ISO format (YYYY-MM-DD)",
  })
  @IsNotEmpty({ message: 'Date of birth must not be empty.' })
  @IsDateString({}, { message: 'Date of birth must be a valid ISO date string.' })
  dateBirth: string;

  @ApiProperty({
    enum: EducationLevel,
    enumName: 'EducationLevel',
    description: "Student's education level",
  })
  @IsNotEmpty({ message: 'Education level must not be empty.' })
  @IsEnum(EducationLevel, { message: 'Education level must be a valid enum value.' })
  educationLevel: EducationLevel;

  @ApiProperty({
    enum: State,
    enumName: 'State',
    description: "Student's state of residence",
  })
  @IsNotEmpty({ message: 'State must not be empty.' })
  @IsEnum(State, { message: 'State must be a valid enum value.' })
  state: State;

  @ApiProperty({
    enum: Ethnicity,
    enumName: 'Ethnicity',
    description: "Student's ethnicity",
  })
  @IsNotEmpty({ message: 'Ethnicity must not be empty.' })
  @IsEnum(Ethnicity, { message: 'Ethnicity must be a valid enum value.' })
  ethnicity: Ethnicity;

  @ApiProperty({
    enum: Gender,
    enumName: 'Gender',
    description: "Student's gender",
  })
  @IsNotEmpty({ message: 'Gender must not be empty.' })
  @IsEnum(Gender, { message: 'Gender must be a valid enum value.' })
  gender: Gender;

  @ApiProperty({
    description: 'Indicates whether the student has a disability',
    example: true,
  })
  @IsNotEmpty({ message: 'Disability status must not be empty.' })
  @IsBoolean({ message: 'Disability status must be a boolean.' })
  hasDisability: boolean;

  @ApiPropertyOptional({
    description: 'Type of disability (if applicable)',
    example: 'Visual',
  })
  @ValidateIf((o) => o.hasDisability === true)
  @IsNotEmpty({ message: 'Disability type must not be empty when hasDisability is true.' })
  @IsString({ message: 'Disability type must be a string.' })
  disabilityType?: string;

  @ApiProperty({
    description: 'Indicates whether the student requires support resources',
    example: false,
  })
  @IsNotEmpty({ message: 'Support resource status must not be empty.' })
  @IsBoolean({ message: 'Support resource status must be a boolean.' })
  needsSupportResources: boolean;

  @ApiPropertyOptional({
    description: 'Description of required support resources (if applicable)',
    example: 'Screen reader',
  })
  @ValidateIf((o) => o.needsSupportResources === true)
  @IsNotEmpty({ message: 'Support resource description must not be empty when needed.' })
  @IsString({ message: 'Support resource description must be a string.' })
  supportResourcesDescription?: string;
}

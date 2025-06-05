import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EducationLevel, Ethnicity, Gender, State } from '@prisma/client';
import {
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsString,
  IsDateString,
  ValidateIf,
  IsDefined,
  MaxLength,
} from 'class-validator';

export class StudentRegisterDto {
  @ApiProperty({
    example: '2005-03-23T15:00:00.000Z',
    description: "Student's date of birth in ISO format (YYYY-MM-DD)",
  })
  @IsNotEmpty({ message: "Field 'dateBirth' is required." })
  @IsDateString({}, { message: "Field 'dateBirth' must be a valid ISO date string." })
  dateBirth: string;

  @ApiProperty({
    enum: EducationLevel,
    enumName: 'EducationLevel',
    description: "Student's education level",
  })
  @IsNotEmpty({ message: "Field 'educationLevel' is required." })
  @IsEnum(EducationLevel, { message: "Field 'educationLevel' must be a valid enum value." })
  educationLevel: EducationLevel;

  @ApiProperty({
    enum: State,
    enumName: 'State',
    description: "Student's state of residence",
  })
  @IsNotEmpty({ message: "Field 'state' is required." })
  @IsEnum(State, { message: "Field 'state' must be a valid enum value." })
  state: State;

  @ApiProperty({
    enum: Ethnicity,
    enumName: 'Ethnicity',
    description: "Student's ethnicity",
  })
  @IsNotEmpty({ message: "Field 'ethnicity' is required." })
  @IsEnum(Ethnicity, { message: "Field 'ethnicity' must be a valid enum value." })
  ethnicity: Ethnicity;

  @ApiProperty({
    enum: Gender,
    enumName: 'Gender',
    description: "Student's gender",
  })
  @IsNotEmpty({ message: "Field 'gender' is required." })
  @IsEnum(Gender, { message: "Field 'gender' must be a valid enum value." })
  gender: Gender;

  @ApiProperty({
    description: 'Indicates whether the student has a disability',
    example: true,
  })
  @IsDefined({ message: "Field 'hasDisability' must be defined." })
  @IsBoolean({ message: "Field 'hasDisability' must be a boolean." })
  hasDisability: boolean;

  @ApiPropertyOptional({
    description: 'Type of disability (if applicable)',
    example: 'Visual',
  })
  @ValidateIf(o => o.hasDisability === true)
  @IsNotEmpty({ message: "Field 'disabilityType' is required when 'hasDisability' is true." })
  @IsString({ message: "Field 'disabilityType' must be a string." })
  @MaxLength(100, { message: "Field 'disabilityType' must be at most 100 characters." })
  disabilityType?: string;

  @ApiProperty({
    description: 'Indicates whether the student requires support resources',
    example: false,
  })
  @IsDefined({ message: "Field 'needsSupportResources' must be defined." })
  @IsBoolean({ message: "Field 'needsSupportResources' must be a boolean." })
  needsSupportResources: boolean;

  @ApiPropertyOptional({
    description: 'Description of required support resources (if applicable)',
    example: 'Screen reader',
  })
  @ValidateIf(o => o.needsSupportResources === true)
  @IsNotEmpty({
    message:
      "Field 'supportResourcesDescription' is required when 'needsSupportResources' is true.",
  })
  @IsString({ message: "Field 'supportResourcesDescription' must be a string." })
  @MaxLength(255, {
    message: "Field 'supportResourcesDescription' must be at most 255 characters.",
  })
  supportResourcesDescription?: string;
}

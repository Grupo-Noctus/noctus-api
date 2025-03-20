import { EducationLevel, Ethnicity, Gender, State } from "@prisma/client";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class StudentRegisterDto {
 
@ApiProperty({
  example: '2005-06-15',
  description: 'Student\'s date of birth in ISO format (YYYY-MM-DD)',
})
dateBirth: string;

@ApiProperty({
  enum: EducationLevel,
  description: 'Student\'s education level',
})
educationLevel: EducationLevel;

@ApiProperty({
  enum: State,
  description: 'Student\'s state of residence',
})
state: State;

@ApiProperty({
  enum: Ethnicity,
  description: 'Student\'s ethnicity',
})
  ethnicity: Ethnicity;

@ApiProperty({
  enum: Gender,
  description: 'Student\'s gender',
})
gender: Gender;

@ApiProperty({
  description: 'Indicates whether the student has a disability',
  example: true,
})
  hasDisability: boolean;

@ApiPropertyOptional({
  description: 'Type of disability (if applicable)',
  example: 'Visual',
})
disabilityType?: string;

@ApiProperty({
  description: 'Indicates whether the student requires support resources',
  example: false,
})
needsSupportResources: boolean;

@ApiPropertyOptional({
  description: 'Description of required support resources (if applicable)',
  example: 'Screen reader',
})
supportResourcesDescription?: string;
}
import { ApiProperty } from '@nestjs/swagger';
import { State, Ethnicity, Gender } from '@prisma/client';

export class EnrollmentResponseDto {
  @ApiProperty({ example: 1, description: 'User ID associated with the enrollment' })
  idUser: number;

  @ApiProperty({ example: 'joao_silva', description: 'Username of the student' })
  username: string;

  @ApiProperty({ example: 'João Silva', description: 'Full name of the student' })
  name: string;

  @ApiProperty({ example: 'joao@email.com', description: 'Email of the student' })
  email: string;

  @ApiProperty({ example: '+55 11 91234-5678', description: 'Phone number of the student' })
  phoneNumber: string;

  @ApiProperty({ example: 10, description: 'Student entity ID' })
  idStudent: number;

  @ApiProperty({ example: '1995-08-15T00:00:00.000Z', description: 'Date of birth of the student' })
  dateBirth: Date;

  @ApiProperty({ enum: State, example: State.SP, description: 'State of origin' })
  state: State;

  @ApiProperty({ enum: Ethnicity, example: Ethnicity.WHITE, description: 'Ethnicity of the student' })
  ethnicity: Ethnicity;

  @ApiProperty({ enum: Gender, example: Gender.FEMALE, description: 'Gender of the student' })
  gender: Gender;

  @ApiProperty({ example: true, description: 'Indicates if the student has a disability' })
  hasDisability: boolean;

  @ApiProperty({ example: 'Visual impairment', required: false, nullable: true, description: 'Type of disability, if any' })
  disabilityType: string;

  @ApiProperty({ example: true, required: false, nullable: true, description: 'Whether the student needs support resources' })
  needsSupportResources: boolean;

  @ApiProperty({ example: 'Needs screen reader', required: false, nullable: true, description: 'Description of support resources required' })
  supportResourcesDescription: string;

  @ApiProperty({ example: 3, description: 'ID of the enrolled course' })
  idCourse: number;

  @ApiProperty({ example: 'Advanced TypeScript', description: 'Name of the enrolled course' })
  nameCourse: string;

  @ApiProperty({ example: 1001, description: 'Enrollment record ID' })
  idEnrollment: number;

  @ApiProperty({ example: false, description: 'Whether the course has been completed' })
  completed: boolean;

  @ApiProperty({ example: '2025-12-31T23:59:59.000Z', description: 'Expiration date of the enrollment' })
  expiresAt: Date;
}

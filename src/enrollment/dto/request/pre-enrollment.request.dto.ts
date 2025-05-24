import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class PreEnrollmentDto {
  @ApiProperty({
    description: 'Lista de e-mails dos estudantes a serem pré-matriculados.',
    example: ['aluno1@email.com', 'aluno2@email.com'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEmail({}, { each: true })
  emails: string[];
}
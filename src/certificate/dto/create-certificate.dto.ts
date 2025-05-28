import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  @IsNotEmpty()
  studentName: string;

  @IsString()
  @IsNotEmpty()
  courseName: string;

  @IsDateString()
  completionDate: string;
}

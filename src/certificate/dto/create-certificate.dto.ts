import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  course: string;

  @IsDateString()
  date: string;
}

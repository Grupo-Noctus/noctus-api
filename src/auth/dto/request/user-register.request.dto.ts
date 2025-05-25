import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsOptional,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UserRegisterDto {
  @ApiProperty({
    example: 'joaosilva',
    description: 'Unique username used on the platform',
  })
  @IsNotEmpty({ message: 'The username must not be empty.' })
  @IsString({ message: 'The username must be a string.' })
  @Matches(/^[a-zA-Z0-9._]{3,}$/, {
    message:
      'The username must have at least 3 characters and contain only letters, numbers, dots or underscores.',
  })
  username: string;

  @ApiProperty({
    example: 'João da Silva',
    description: 'Full name of the user',
  })
  @IsNotEmpty({ message: 'The name must not be empty.' })
  @IsString({ message: 'The name must be a string.' })
  name: string;

  @ApiProperty({
    example: 'joao@email.com',
    description: 'Email address of the user',
  })
  @IsNotEmpty({ message: 'The email must not be empty.' })
  @IsEmail({}, { message: 'The email must be valid.' })
  email: string;

  @ApiProperty({
    example: 'senhaSegura123',
    description: 'Password created by the user for authentication',
  })
  @IsNotEmpty({ message: 'The password must not be empty.' })
  @IsString({ message: 'The password must be a string.' })
  @MinLength(6, {
    message: 'The password must be at least 6 characters long.',
  })
  password: string;

  @ApiProperty({
    example: '+55 11 91234-5678',
    description: 'Phone number of the user',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'The phone number must be a string.' })
  @MinLength(8, {
    message: 'The phone number must be at least 8 characters long.',
  })
  @MaxLength(20, {
    message: 'The phone number must be at most 20 characters long.',
  })
  phoneNumber: string;
}

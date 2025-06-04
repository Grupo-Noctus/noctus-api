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
    example: 'john_doe',
    description: 'Unique username used by the user',
  })
  @IsNotEmpty({ message: "The 'username' field must not be empty." })
  @IsString({ message: "The 'username' field must be a string." })
  @Matches(/^[a-z0-9._]{3,}$/, {
    message:
      "The 'username' must have at least 3 characters and contain only letters, numbers, dots, or underscores.",
  })
  username: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @IsNotEmpty({ message: "The 'name' field must not be empty." })
  @IsString({ message: "The 'name' field must be a string." })
  @MaxLength(100, {
    message: "The 'name' must be at most 100 characters long.",
  })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user',
  })
  @IsNotEmpty({ message: "The 'email' field must not be empty." })
  @IsEmail({}, { message: "The 'email' must be a valid email address." })
  email: string;

  @ApiProperty({
    example: 'StrongPassword123',
    description: 'Password for user authentication',
  })
  @IsNotEmpty({ message: "The 'password' field must not be empty." })
  @IsString({ message: "The 'password' field must be a string." })
  @MinLength(6, {
    message: "The 'password' must be at least 6 characters long.",
  })
  @MaxLength(50, {
    message: "The 'password' must be at most 50 characters long.",
  })
  password: string;

  @ApiProperty({
    example: '+1 202-555-0182',
    description: 'Phone number of the user',
    required: false,
  })
  @IsOptional()
  @IsString({ message: "The 'phoneNumber' field must be a string." })
  @MinLength(8, {
    message: "The 'phoneNumber' must be at least 8 characters long.",
  })
  @MaxLength(20, {
    message: "The 'phoneNumber' must be at most 20 characters long.",
  })
  phoneNumber: string;
}

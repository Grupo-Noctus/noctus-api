import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsEmailOrUsername } from '../../validator/is-email-or-username.validator';

export class LoginRequestDto {
  @ApiProperty({
    example: 'john.doe@example.com or john_doe',
    description: 'Email address or username used for login',
  })
  @IsNotEmpty({ message: 'The email or username must not be empty.' })
  @IsString({ message: 'The email or username must be a string.' })
  @IsEmailOrUsername({ message: 'The value must be a valid email or username.' })
  usernameOrEmail: string;

  @ApiProperty({
    example: 'SecurePass123',
    description: 'Password used for authentication',
  })
  @IsNotEmpty({ message: 'The password must not be empty.' })
  @IsString({ message: 'The password must be a string.' })
  @MinLength(6, { message: 'The password must be at least 6 characters long.' })
  password: string;
}

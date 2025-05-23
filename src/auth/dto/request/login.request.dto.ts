import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsEmailOrUsername } from '../../validator/is-email-or-username.validator';

export class LoginRequestDto {
  @ApiProperty({
    example: 'joao@exemple.com ou joao_123',
    description: 'Email or username used for login',
  })
  @IsNotEmpty({ message: 'The email or username must not be empty.' })
  @IsString({ message: 'The email or username must be a string.' })
  @IsEmailOrUsername({ message: 'The value must be a valid email or username.' })
  usernameOrEmail: string;

  @ApiProperty({
    example: 'senhaSegura123',
    description: 'Password used to access the account',
  })
  @IsNotEmpty({ message: 'The password must not be empty.' })
  @IsString({ message: 'The password must be a string.' })
  @MinLength(6, { message: 'The password must be at least 6 characters long.' })
  password: string;
}

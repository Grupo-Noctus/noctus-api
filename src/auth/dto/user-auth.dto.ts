import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, MaxLength, IsNotEmpty } from "class-validator";

export class UserAuthDto {
  @ApiProperty({
    example: 'joao@email.com',
    description: 'Email or username used for login',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  usernameOrEmail: string;

  @ApiProperty({
    example: 'senhaSegura123',
    description: 'Password used to access the account',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

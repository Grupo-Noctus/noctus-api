import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, IsString, IsOptional, IsUrl } from "class-validator";

export class UserRegisterDto {
    
  @ApiProperty({
    example: 'joaosilva',
    description: 'Unique username used on the platform',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: 'João da Silva',
    description: 'Full name of the user',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'joao@email.com',
    description: 'Email address of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'senhaSegura123',
    description: 'Password created by the user for authentication',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: 'https://meusite.com/imagens/avatar.png',
    description: 'URL of the user profile image (optional)',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  image: string;
}

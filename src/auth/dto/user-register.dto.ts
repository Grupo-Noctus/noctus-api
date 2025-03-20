import { ApiProperty } from "@nestjs/swagger"

export class UserRegisterDto {
    
  @ApiProperty({
    example: 'joaosilva',
    description: 'Unique username used on the platform',
  })
  username: string

  @ApiProperty({
    example: 'João da Silva',
    description: 'Full name of the user',
  })
  name: string

  @ApiProperty({
    example: 'joao@email.com',
    description: 'email address of the user',
  })
  email: string

  @ApiProperty({
    example: 'senhaSegura123',
    description: 'Password created by the user for authentication',
  })
  password: string

  @ApiProperty({
    example: 'https://meusite.com/imagens/avatar.png',
    description: 'URL of the user\'s profile image (optional)',
    required: false,
  })
  image: string
}
import { ApiProperty } from "@nestjs/swagger"

export class UserRegisterDto {
    
    @ApiProperty({
        example: 'joaosilva',
        description: 'Nome de usuário único utilizado na plataforma',
      })
    username: string

    
  @ApiProperty({
    example: 'João da Silva',
    description: 'Nome completo do usuário',
  })
    name: string

    @ApiProperty({
        example: 'joao@email.com',
        description: 'Endereço de e-mail principal do usuário',
      })
    email: string

    @ApiProperty({
        example: 'senhaSegura123',
        description: 'Senha criada pelo usuário para autenticação',
      })
    password: string

    @ApiProperty({
        example: 'https://meusite.com/imagens/avatar.png',
        description: 'URL da imagem de perfil do usuário (opcional)',
        required: false,
      })
    image: string
}
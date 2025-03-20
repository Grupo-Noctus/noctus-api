import { ApiProperty } from "@nestjs/swagger"

export class UserAuthDto {
    id?: number

    @ApiProperty({
        example: 'joao@email.com',
        description: 'E-mail ou nome de usuário utilizado para login',
      })
    usernameOrEmail: string

    @ApiProperty({
        example: 'senhaSegura123',
        description: 'Senha de acesso à conta',
      })
    password: string
}
import { ApiProperty } from "@nestjs/swagger"

export class UserAuthDto {

  id?: number

  @ApiProperty({
    example: 'joao@email.com',
    description: 'Email or username used for login',
  })
  usernameOrEmail: string

  @ApiProperty({
    example: 'senhaSegura123',
    description: 'Password used to access the account',
  })
  password: string
}
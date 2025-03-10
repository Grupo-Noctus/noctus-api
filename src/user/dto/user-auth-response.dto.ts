import { Role } from "@prisma/client"

export class UserAutResDto {
    id: number
    username: string
    name: string
    email: string
    password: string
    role: Role
    active: boolean
}
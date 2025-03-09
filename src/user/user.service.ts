import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserAutResDto } from './dto/user-auth-response.dto';

@Injectable()
export class UserService {
    constructor(
        private prisma : PrismaService,
    ){}

    async findByUsernameOrEmailForAuth (usernameOrEmail: string): Promise < UserAutResDto > {
        return this.prisma.user.findFirst({
            where: {
                OR: [
                    { username: usernameOrEmail },
                    { email: usernameOrEmail },
                ],
            },
            select: {
                id: true,
                username: true,
                name: true,
                email: true,
                password: true,
                role: true,
                active : true,
            }
        });
    }
}

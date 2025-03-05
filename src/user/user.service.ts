import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserAutResDto } from './dto/user-auth-response.dto';

@Injectable()
export class UserService {
    constructor(
        private prisma : PrismaService,
    ){}

    async findByUsernameForAuth (username: string): Promise < UserAutResDto > {
        return this.prisma.user.findUnique({
            where: {username},
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

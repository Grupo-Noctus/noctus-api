import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserAutResDto } from './dto/user-auth-response.dto';
import { UserEntity } from './dto/user-entity';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async findByUsernameOrEmailForAuth(usernameOrEmail: string): Promise<UserEntity | null> {
        return this.prisma.user.findFirst({
            where: {
            OR: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
            },
            select: {
                id: true,
                username: true,
                name: true,
                email: true,
                password: true,
                role: true,
                active: true,
                image: true,
                phoneNumber: true,
            },
        });
    }
}
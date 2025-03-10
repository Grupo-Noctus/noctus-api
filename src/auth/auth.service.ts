import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserAuthDto } from './dto/user-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StudentRegisterDto } from './dto/student-register.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor( 
        private jwt: JwtService,
        private userService: UserService,
        private readonly prisma: PrismaService
    ){}

    async singIn (userAuth: UserAuthDto): Promise<{ access_token: string}>{
        const user = await this.userService.findByUsernameOrEmailForAuth(userAuth.usernameOrEmail);

        if(user?.password !== userAuth.password){
            throw new UnauthorizedException();
        }

        const payload = {
            sub: user.id,
            username: user.username,
            role: user.role,
            active: user.active
        }

        return {
            access_token: await this.jwt.signAsync(payload),
        }
    }

    isEmailFromMatera (email: string): boolean {
        const permissionEmail: string = "matera";
        const regex: RegExp = new RegExp(`@${permissionEmail}`);
        return regex.test(email);
    }

    async registerAdmin (
        userRegister: UserRegisterDto,
        role: Role
    ): Promise <UserAuthDto>{
        const createdAdimin = await this.prisma.user.create({
            data: {
                ...userRegister,
                role: role,
                active: true,
            },
            select:{
                id: true,
                email: true,
                password: true,
            }
        });
        const userAuthDto = new UserAuthDto();
        userAuthDto.id = createdAdimin.id;
        userAuthDto.usernameOrEmail = createdAdimin.email;
        userAuthDto.password = createdAdimin.password;

        return userAuthDto;
    }

    async registerStudent (
        userRegister: UserRegisterDto,
        studentRegister: StudentRegisterDto
    ): Promise <UserAuthDto>{
        const createdStudent = await this.prisma.user.create({
            data: {
                ...userRegister,
                role: Role.STUDENT,
                active: true,
                student:{
                    create: {
                        ...studentRegister
                    }
                }
            },
            select:{
                id: true,
                email: true,
                password: true,
            }
        });

        const userAuthDto = new UserAuthDto();
        userAuthDto.id = createdStudent.id;
        userAuthDto.usernameOrEmail = createdStudent.email;
        userAuthDto.password = createdStudent.password;

        return userAuthDto;
    }
}

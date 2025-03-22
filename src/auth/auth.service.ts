import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserAuthDto } from './dto/user-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StudentRegisterDto } from './dto/student-register.dto';
import { Role } from '@prisma/client';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    
    constructor( 
        private jwt: JwtService,
        private userService: UserService,
        private readonly prisma: PrismaService
    ){}

    async signIn(userAuth: UserAuthDto): Promise<{ access_token: string }> {
        const user = await this.userService.findByUsernameOrEmailForAuth(userAuth.usernameOrEmail);
    
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

    async registerAdmin(userRegister: UserRegisterDto, role: Role): Promise<UserAuthDto> {
        const hashedPassword = await argon2.hash(userRegister.password); 
        const createdAdmin = await this.prisma.user.create({
            data: {
                ...userRegister,
                role: role,
                active: true,
                password: hashedPassword,  
            },
            select: {
                id: true,
                email: true,
                password: true,
            }
        });

        const userAuthDto = new UserAuthDto();
        userAuthDto.id = createdAdmin.id;
        userAuthDto.usernameOrEmail = createdAdmin.email;
        userAuthDto.password = createdAdmin.password;

        return userAuthDto;
    }

    async registerStudent(userRegister: UserRegisterDto, studentRegister: StudentRegisterDto): Promise<UserAuthDto> {
        const hashedPassword = await argon2.hash(userRegister.password);  

        const createdStudent = await this.prisma.user.create({
            data: {
                ...userRegister,
                role: Role.STUDENT,
                active: true,
                password: hashedPassword,  
                student: {
                    create: {
                        ...studentRegister
                    }
                }
            },
            select: {
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
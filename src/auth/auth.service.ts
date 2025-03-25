import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserAuthDto } from './dto/user-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StudentRegisterDto } from './dto/student-register.dto';
import { Role } from '@prisma/client';
import { UserAuthJwtDto } from './dto/user-auth-jwt.dto';

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
    ): Promise <UserAuthJwtDto>{
        try {
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
            const userAuth = new UserAuthJwtDto();
            userAuth.id = createdAdimin.id;
            userAuth.usernameOrEmail = createdAdimin.email;
            userAuth.password = createdAdimin.password;
    
            return userAuth;
        }catch(error){
            console.error(error);
            throw new InternalServerErrorException();
        }
    }

    async registerStudent (
        userRegister: UserRegisterDto,
        studentRegister: StudentRegisterDto
    ): Promise <UserAuthJwtDto>{
        try {
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
    
            const userAuth = new UserAuthJwtDto();
            userAuth.id = createdStudent.id;
            userAuth.usernameOrEmail = createdStudent.email;
            userAuth.password = createdStudent.password;
    
            return userAuth;
        }catch(error){
            console.error(error);
            throw new InternalServerErrorException();
        }
    }
}

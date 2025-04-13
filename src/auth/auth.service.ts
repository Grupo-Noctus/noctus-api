import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserAuthDto } from './dto/user-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StudentRegisterDto } from './dto/student-register.dto';
import { Role } from '@prisma/client';
import { UserAuthJwtDto } from './dto/user-auth-jwt.dto';
import * as argon2 from 'argon2';
import { generateUniqueKey } from 'src/utils/genarate-unique-key';

@Injectable()
export class AuthService {
    
    constructor( 
        private jwt: JwtService,
        private userService: UserService,
        private readonly prisma: PrismaService
    ){}

    async signIn(userAuth: UserAuthDto): Promise<{ access_token: string }> {
        const user = await this.userService.findByUsernameOrEmailForAuth(userAuth.usernameOrEmail);

        const argonVerify = await argon2.verify(user?.password, userAuth.password) 
        if(!argonVerify){
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

    async registerAdmin(userRegister: UserRegisterDto, role: Role, photo: Express.Multer.File): Promise<boolean> {
        try {
            if (photo){
                var { filename, mimetype, size, path } = photo;    
                //if (size > que alguma coisa){otimiza}
                var uniqueKey = generateUniqueKey(filename);
                var pathS3 = path; //adicionar url gerada após salvar na s3
            } else {
                pathS3 = null;
            }
            const hashedPassword = await argon2.hash(userRegister.password); 
            const createdAdmin = await this.prisma.user.create({
                data: {
                    ...userRegister,
                    role: role,
                    active: true,
                    password: hashedPassword,  
                    image: pathS3
                },
                select: {
                    id: true,
                    email: true,
                    password: true,
                }
            });

            const userAuthDto = new UserAuthJwtDto();
            userAuthDto.id = createdAdmin.id;
            userAuthDto.usernameOrEmail = createdAdmin.email;
            userAuthDto.password = createdAdmin.password;

            return true;
        }catch(error){
            console.error(error);
            throw new InternalServerErrorException();
        }
    }

    async registerStudent (
        userRegister: UserRegisterDto,
        studentRegister: StudentRegisterDto
    ): Promise <boolean>{
        try {
            const { dateBirth } = studentRegister
            const hashedPassword = await argon2.hash(userRegister.password);
            const createdStudent = await this.prisma.user.create({
                data: {
                    ...userRegister,
                    role: Role.STUDENT,
                    active: true,
                    password: hashedPassword, 
                    student:{
                        create: {
                            ...studentRegister,
                            dateBirth: new Date(dateBirth)
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
    
            return true;
        }catch(error){
            console.error(error);
            throw new InternalServerErrorException();
        }
    }
}
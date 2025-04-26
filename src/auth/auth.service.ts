import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { LoginRequestDto } from './dto/login-request.dto';
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

  async signIn(login: LoginRequestDto): Promise<{ access_token: string }> {
    const user = await this.userService.findByUsernameOrEmailForAuth(login.usernameOrEmail);
  
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const passwordMatches = await argon2.verify(user.password, login.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      active: user.active,
    };
  
    const access_token = await this.jwt.signAsync(payload);
  
    return { access_token };
  }      

  async registerAdmin(
    userRegister: UserRegisterDto,
    image: string
    ): Promise<boolean> {
    const hashedPassword = await argon2.hash(userRegister.password);

    await this.prisma.user.create({
      data: {
        ...userRegister,
        role: Role.ADMIN,
        active: true,
        password: hashedPassword,
        image: image
      }
    });

    return true;
  }
    
  async registerStudent(
    userRegister: UserRegisterDto,
    studentRegister: StudentRegisterDto,
    image?: string
  ): Promise<boolean> {
    const hashedPassword = await argon2.hash(userRegister.password);

    await this.prisma.user.create({
    data: {
        ...userRegister,
        role: Role.STUDENT,
        active: true,
        password: hashedPassword,
        image: image,
        student: {
          create: {
            ...studentRegister,
            dateBirth: new Date(studentRegister.dateBirth)
          }
        }
      }
    });

    return true;
  }  
}
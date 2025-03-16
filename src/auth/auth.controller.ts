import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthDto } from './dto/user-auth.dto';
import { Public } from './decorator/public.decorator';
import { UserRegisterDto } from './dto/user-register.dto';
import { StudentRegisterDto } from './dto/student-register.dto';
import { Role } from '@prisma/client';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60 }})
  @Post('login')
  async signIn (@Body() userAuth: UserAuthDto): Promise <{access_token: string}>{
    return await this.authService.singIn(userAuth);
  }

  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60 }})
  @Post('register')
  async register (
    @Body() userRegister: UserRegisterDto,
    @Body('student') studentRegister: StudentRegisterDto
  ): Promise <{access_token: string}>{
    let createdUser: UserAuthDto = null; 
    const isAdmin = this.authService.isEmailFromMatera(userRegister.email);

    if(!isAdmin){
      if(!studentRegister){
        throw new BadRequestException('The user is student and your data not found.')
      }
      createdUser = await this.authService.registerStudent(userRegister, studentRegister);
    } else {
      createdUser = await this.authService.registerAdmin(userRegister, Role.ADMIN);
    }
    return this.authService.singIn(createdUser);
  }
}

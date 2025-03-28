import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthDto } from './dto/user-auth.dto';
import { Public } from './decorator/public.decorator';
import { UserRegisterDto } from './dto/user-register.dto';
import { StudentRegisterDto } from './dto/student-register.dto';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserAuthJwtDto } from './dto/user-auth-jwt.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Success', type: String })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: UserAuthDto })
  async signIn (@Body() userAuth: UserAuthDto): Promise <{access_token: string}>{
    return await this.authService.signIn(userAuth);
  }

  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'Success', type: String})
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error'})
  async register (
    @Body() registerDto: RegisterDto
  ): Promise <{access_token: string}>{
    const { user, student } = registerDto;
    let createdUser: UserAuthJwtDto = null; 
    const isAdmin = this.authService.isEmailFromMatera(user.email);

    if(!isAdmin){
      if(!student){
        throw new BadRequestException('The user is student and your data not found.')
      }
      createdUser = await this.authService.registerStudent(user, student);
    } else {
      createdUser = await this.authService.registerAdmin(user, Role.ADMIN);
    }
    return this.authService.signIn(createdUser);
  }
}

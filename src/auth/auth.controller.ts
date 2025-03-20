import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthDto } from './dto/user-auth.dto';
import { Public } from './decorator/public.decorator';
import { UserRegisterDto } from './dto/user-register.dto';
import { StudentRegisterDto } from './dto/student-register.dto';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiProperty } from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Realiza login do usuário' })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido, retorna access_token' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @ApiBody({ type: UserAuthDto })
  async signIn (@Body() userAuth: UserAuthDto): Promise <{access_token: string}>{
    return await this.authService.singIn(userAuth);
  }

  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registra novo usuário (admin ou estudante)' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou incompletos' })
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

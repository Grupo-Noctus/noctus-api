import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthDto } from './dto/user-auth.dto';
import { Public } from './decorator/public.decorator';
import { UserRegisterDto } from './dto/user-register.dto';
import { StudentRegisterDto } from './dto/student-register.dto';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserAuthJwtDto } from './dto/user-auth-jwt.dto';
import { RegisterDto } from './dto/register.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
  async signIn (
    @Body() userAuth: UserAuthDto,
  ): Promise <{access_token: string}>{
    return await this.authService.signIn(userAuth);
  }

  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post('register')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'Success', type: Boolean })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async register(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<boolean> {
    let user, student;
    user = typeof body.user === 'string' ? JSON.parse(body.user) : body.user;
    student = typeof body.student === 'string' ? JSON.parse(body.student) : body.student;

    if (!user) {
      throw new BadRequestException('Dados de usuário não encontrados');
    }

    const isAdmin = this.authService.isEmailFromMatera(user.email);

    if (!isAdmin) {
      if (!student) {
        throw new BadRequestException('O usuário é estudante e os dados do estudante não foram encontrados.');
      }
      return await this.authService.registerStudent(user, student, file);
    } else {
      return await this.authService.registerAdmin(user, Role.ADMIN, file);
    }
  }
}

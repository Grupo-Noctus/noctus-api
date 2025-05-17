import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Logger, Post, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { Public } from './decorator/public.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { isEmailFromMatera } from 'src/utils/is-matera';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';
import { multerFileOptions } from 'src/upload/helper/multer-file-options.helper';
import { handlePrismaError } from 'src/utils/handle-prisma.error';
import { handleHttpError } from 'src/utils/handle-http.error';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor(
    private readonly authService: AuthService,
    private readonly uploadService: UploadService
  ) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Login successful', type: 'access_token' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid credentials' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: LoginRequestDto })
  async signIn(
    @Body() userAuth: LoginRequestDto,
  ): Promise<{ access_token: string }> {
    try {
      return await this.authService.signIn(userAuth);
    } catch (error) {
      this.logger.error('Error occurred during login attempt', error);
      handlePrismaError(error);
      handleHttpError(error);
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post('register')
  @UseInterceptors(FileInterceptor('imageUser', multerFileOptions('./uploads/images-users', /^image\/(jpeg|png|jpg|webp)$/)))
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: Boolean })
  @ApiResponse({ status: 400, description: 'Missing or invalid user/student data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async register(
    @UploadedFile() imageUser: Express.Multer.File,
    @Body() body: RegisterDto,
  ): Promise<boolean> {
    let imageKey = null
    try {
      const user = typeof body.user === 'string' ? JSON.parse(body.user) : body.user;
      const student = typeof body.student === 'string' ? JSON.parse(body.student) : body.student;

      if (imageUser) {
        imageKey = await this.uploadService.uploadFileMetadata(
        imageUser,
        'images-users'
      );
      }
      if (!user) {
        throw new BadRequestException('User data not found');
      }

      const isAdmin = isEmailFromMatera(user.email);

      if (!isAdmin) {
        if (!student) {
          throw new BadRequestException('Student data is required for non-admin users');
        }

        return await this.authService.registerStudent(user, student, imageKey);
      }

      return await this.authService.registerAdmin(user, imageKey);
    } catch (error) {
      this.logger.error('Error occurred during user registration', error)
      if (imageKey) {
        await this.uploadService.deleteFile(imageKey);
      }
      handlePrismaError(error);
      handleHttpError(error);
    }
  }
}

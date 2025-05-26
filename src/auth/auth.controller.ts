import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { LoginRequestDto } from './dto/request/login.request.dto';
import { Public } from './decorator/public.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { RegisterRequestDto } from './dto/request/register.request.dto';
import { isEmailFromMatera } from 'src/utils/is-matera';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';
import { multerFileOptions } from 'src/upload/helper/multer-file-options.helper';
import { handleAppError } from 'src/utils/handle-app-error.error';
import { IAuthService } from './interface/auth.service.interface';
import { UserRegisterDto } from './dto/request/user-register.request.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { StudentRegisterDto } from './dto/request/student-register.request.dto';
import { LoginResponseDto } from './dto/response/login.response.dto';
import { IUploadService } from 'src/upload/interface/upload.service.interface';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    @Inject('IAuthService')
    private readonly authService: IAuthService,
    @Inject('IUploadService')
    private readonly uploadService: IUploadService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: 'Missing or invalid login data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid credentials' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: LoginRequestDto })
  async signIn(@Body() userAuth: LoginRequestDto): Promise<{ access_token: string }> {
    try {
      return await this.authService.signIn(userAuth);
    } catch (error) {
      this.logger.error('Error occurred during login attempt', error);
      throw handleAppError(error);
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post('register')
  @UseInterceptors(
    FileInterceptor(
      'imageUser',
      multerFileOptions('./uploads/images-users', /^image\/(jpeg|png|jpg|webp)$/),
    ),
  )
  @ApiOperation({ summary: 'Register new user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: RegisterRequestDto })
  @ApiResponse({ status: 201, description: 'User created successfully', type: Boolean })
  @ApiResponse({ status: 400, description: 'Missing or invalid user/student data' })
  @ApiResponse({ status: 409, description: 'User already exists (duplicate email or username)' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async register(
    @UploadedFile() imageUser: Express.Multer.File,
    @Body() body: any,
  ): Promise<boolean> {
    let imageKey: string | null = null;

    try {
      const userPlain = typeof body.user === 'string' ? JSON.parse(body.user) : body.user;
      const studentPlain =
        typeof body.student === 'string' ? JSON.parse(body.student) : body.student;

      if (!userPlain) {
        throw new BadRequestException('User data not found');
      }

      const userDto = plainToInstance(UserRegisterDto, userPlain);
      await validateOrReject(userDto, { whitelist: true, forbidNonWhitelisted: true });

      let studentDto: StudentRegisterDto | undefined;
      if (!isEmailFromMatera(userDto.email)) {
        if (!studentPlain) {
          throw new BadRequestException('Student data is required for non-admin users');
        }

        studentDto = plainToInstance(StudentRegisterDto, studentPlain);
        await validateOrReject(studentDto, { whitelist: true, forbidNonWhitelisted: true });
      }

      if (imageUser) {
        imageKey = await this.uploadService.uploadFileMetadata(imageUser, 'images-users');
      }

      if (isEmailFromMatera(userDto.email)) {
        return await this.authService.registerAdmin(userDto, imageKey);
      } else {
        return await this.authService.registerStudent(userDto, studentDto!, imageKey);
      }
    } catch (error) {
      this.logger.error('Error occurred during user registration', error);
      if (imageKey) {
        await this.uploadService.deleteFile(imageKey);
      }

      throw handleAppError(error);
    }
  }
}

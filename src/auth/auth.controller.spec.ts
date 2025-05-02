import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UploadService } from 'src/upload/upload.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterDto } from './dto/register.dto';
import { EducationLevel, Ethnicity, Gender, Role, State } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let uploadService: UploadService;

  const mockAuthService = {
    signIn: jest.fn(),
    registerAdmin: jest.fn(),
    registerStudent: jest.fn(),
  };

  const mockUploadService = {
    uploadFileMetadata: jest.fn(),
    deleteFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UploadService, useValue: mockUploadService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    uploadService = module.get<UploadService>(UploadService);
  });

  describe('signIn', () => {
    it('should return an access token when credentials are valid', async () => {
      const dto: LoginRequestDto = {
        usernameOrEmail: 'joao@email.com',
        password: 'senhaSegura123',
      };

      const result = { access_token: 'mockedToken' };
      mockAuthService.signIn.mockResolvedValue(result);

      expect(await controller.signIn(dto)).toEqual(result);
      expect(mockAuthService.signIn).toHaveBeenCalledWith(dto);
    });
  });

  describe('register', () => {
    const user = {
      username: 'joaosilva',
      name: 'João da Silva',
      email: 'joao@email.com',
      password: 'senhaSegura123',
      phoneNumber: '+55 11 91234-5678',
      image: '',
    };

    const student = {
      dateBirth: '2005-03-23T15:00:00.000Z',
      educationLevel: EducationLevel.HIGHER_INCOMPLETE,
      state: State.SP,
      ethnicity: Ethnicity.INDIGENOUS,
      gender: Gender.MALE,
      hasDisability: false,
      needsSupportResources: false,
    };

    it('should register an admin when email is from Matera', async () => {
      const dto: RegisterDto = { user: user, student: null };
      const file = { originalname: 'avatar.png' } as Express.Multer.File;

      mockUploadService.uploadFileMetadata.mockResolvedValue('image_key');
      mockAuthService.registerAdmin.mockResolvedValue(true);

      const result = await controller.register(file, dto);

      expect(result).toBe(true);
      expect(mockAuthService.registerAdmin).toHaveBeenCalledWith(user, 'image_key');
    });

    it('should register a student when email is not from Matera', async () => {
      const nonAdminUser = { ...user, email: 'joao@gmail.com' };
      const dto: RegisterDto = { user: nonAdminUser, student };
      const file = { originalname: 'avatar.png' } as Express.Multer.File;

      mockUploadService.uploadFileMetadata.mockResolvedValue('image_key');
      mockAuthService.registerStudent.mockResolvedValue(true);

      const result = await controller.register(file, dto);

      expect(result).toBe(true);
      expect(mockAuthService.registerStudent).toHaveBeenCalledWith(nonAdminUser, student, 'image_key');
    });
  });
});

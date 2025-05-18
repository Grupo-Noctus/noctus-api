import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UploadService } from 'src/upload/upload.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterDto } from './dto/register.dto';
import { BadRequestException } from '@nestjs/common';


describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let uploadService: UploadService;

  const mockAuthService = {
    signIn: jest.fn(),
    registerStudent: jest.fn(),
    registerAdmin: jest.fn(),
    registerStudent: jest.fn(),
  };

  const mockUploadService = {
    uploadFileMetadata: jest.fn(),
    deleteFile: jest.fn(),
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should return access_token on successful login', async () => {
      const dto: LoginRequestDto = {
        usernameOrEmail: 'user@example.com',
        password: 'securePass123',
      };

      const mockToken = { access_token: 'jwt-token' };
      jest.spyOn(authService, 'signIn').mockResolvedValue(mockToken);

      const result = await controller.signIn(dto);
      expect(result).toEqual(mockToken);
      expect(authService.signIn).toHaveBeenCalledWith(dto);

    });
  });

  describe('register', () => {
    it('should register an admin when email is from Matera', async () => {
      const dto: RegisterDto = {
        user: { email: 'admin@matera.com', password: 'securePass123', name: 'Admin' },
      } as any;

      jest.spyOn(authService, 'registerAdmin').mockResolvedValue(true);

      const result = await controller.register(undefined, dto);
      expect(result).toBe(true);
      expect(authService.registerAdmin).toHaveBeenCalledWith(dto.user, null);
    });

    it('should register a student when email is not from Matera', async () => {
      const dto: RegisterDto = {
        user: { email: 'student@gmail.com', password: 'securePass123', name: 'Student' },
        student: { ra: '123456' },
      } as any;

      jest.spyOn(authService, 'registerStudent').mockResolvedValue(true);

      const result = await controller.register(undefined, dto);
      expect(result).toBe(true);
      expect(authService.registerStudent).toHaveBeenCalledWith(dto.user, dto.student, null);
    });

    it('should throw BadRequestException if user is missing', async () => {
      const dto: any = { user: null };

      await expect(controller.register(undefined, dto)).rejects.toThrow(BadRequestException);
    });

    it('should delete image if error occurs during registration', async () => {
      const dto: RegisterDto = {
        user: { email: 'admin@matera.com', password: 'securePass123', name: 'Admin' },
      } as any;

      const image = { originalname: 'pic.jpg' } as Express.Multer.File;
      jest.spyOn(uploadService, 'uploadFileMetadata').mockResolvedValue('image-key');
      jest.spyOn(authService, 'registerAdmin').mockRejectedValue(new Error('fail'));
      jest.spyOn(uploadService, 'deleteFile').mockResolvedValue(undefined);

      await expect(controller.register(image, dto)).rejects.toThrow();
      expect(uploadService.deleteFile).toHaveBeenCalledWith('image-key');

    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { IAuthService } from '../interface/auth.service.interface';
import { UploadService } from 'src/upload/upload.service';
import { LoginRequestDto } from '../dto/request/login.request.dto';
import { BadRequestException } from '@nestjs/common';

jest.mock('src/utils/handle-app-error.error', () => ({
  handleAppError: (error: any) => error,
}));

describe('AuthController', () => {
  let controller: AuthController;
  let authService: IAuthService;
  let uploadService: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: 'IAuthService',
          useValue: {
            signIn: jest.fn(),
            registerAdmin: jest.fn(),
            registerStudent: jest.fn(),
          },
        },
        {
          provide: UploadService,
          useValue: {
            uploadFileMetadata: jest.fn(),
            deleteFile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<IAuthService>('IAuthService');
    uploadService = module.get<UploadService>(UploadService);
  });

  describe('signIn', () => {
    it('should return access token on successful login', async () => {
      const loginDto: LoginRequestDto = {
        usernameOrEmail: 'user@example.com',
        password: 'password123',
      };
      const expectedResult = { access_token: 'mock_token' };
      (authService.signIn as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.signIn(loginDto);
      expect(authService.signIn).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw error and log on failed login', async () => {
      const loginDto: LoginRequestDto = {
        usernameOrEmail: 'user@example.com',
        password: 'wrongpass',
      };
      const error = new Error('Invalid credentials');
      (authService.signIn as jest.Mock).mockRejectedValue(error);
      const spyLoggerError = jest.spyOn(controller['logger'], 'error');

      await expect(controller.signIn(loginDto)).rejects.toThrow(error);
      expect(spyLoggerError).toHaveBeenCalledWith('Error occurred during login attempt', error);
    });
  });

  describe('register', () => {
    const mockUser = {
      name: 'User Test',
      email: 'user@test.com',
      username: 'usertest',
      password: 'password123',
      phoneNumber: '123456789',
    };
    const mockStudent = {
      dateBirth: '2000-01-01',
      educationLevel: 'HIGHER_COMPLETE',
      state: 'SP',
      ethnicity: 'WHITE',
      gender: 'FEMALE',
      hasDisability: false,
      disabilityType: null,
      needsSupportResources: false,
      supportResourcesDescription: null,
    };

    it('should register admin user successfully without student data', async () => {
      const imageFile = { originalname: 'admin.png', mimetype: 'image/png' } as Express.Multer.File;
      (uploadService.uploadFileMetadata as jest.Mock).mockResolvedValue('image-key.png');
      (authService.registerAdmin as jest.Mock).mockResolvedValue(true);

      // Pass user as stringified JSON, no student data needed for admin (email from Matera)
      const body = {
        user: JSON.stringify({ ...mockUser, email: 'admin@matera.com' }),
      };

      const result = await controller.register(imageFile, body);

      expect(uploadService.uploadFileMetadata).toHaveBeenCalledWith(imageFile, 'images-users');
      expect(authService.registerAdmin).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'admin@matera.com' }),
        'image-key.png',
      );
      expect(result).toBe(true);
    });

    it('should register student user successfully with student data', async () => {
      const imageFile = {
        originalname: 'student.png',
        mimetype: 'image/png',
      } as Express.Multer.File;
      (uploadService.uploadFileMetadata as jest.Mock).mockResolvedValue('image-key-student.png');
      (authService.registerStudent as jest.Mock).mockResolvedValue(true);

      const body = {
        user: JSON.stringify({ ...mockUser, email: 'student@example.com' }),
        student: JSON.stringify(mockStudent),
      };

      const result = await controller.register(imageFile, body);

      expect(uploadService.uploadFileMetadata).toHaveBeenCalledWith(imageFile, 'images-users');
      expect(authService.registerStudent).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'student@example.com' }),
        expect.objectContaining({ dateBirth: mockStudent.dateBirth }),
        'image-key-student.png',
      );
      expect(result).toBe(true);
    });

    it('should throw BadRequestException if user data is missing', async () => {
      await expect(controller.register(null, {})).rejects.toThrow(BadRequestException);
    });

    it('should delete uploaded file and rethrow on error', async () => {
      const imageFile = {
        originalname: 'student.png',
        mimetype: 'image/png',
      } as Express.Multer.File;
      (uploadService.uploadFileMetadata as jest.Mock).mockResolvedValue('temp-image-key.png');
      (authService.registerAdmin as jest.Mock).mockRejectedValue(new Error('Some error'));
      const body = {
        user: JSON.stringify({ ...mockUser, email: 'admin@matera.com' }),
      };
      const spyDelete = jest.spyOn(uploadService, 'deleteFile');

      await expect(controller.register(imageFile, body)).rejects.toThrow('Some error');
      expect(spyDelete).toHaveBeenCalledWith('temp-image-key.png');
    });
  });
});

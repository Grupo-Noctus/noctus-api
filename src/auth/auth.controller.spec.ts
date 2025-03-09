import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserAuthDto } from './dto/user-auth.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { StudentRegisterDto } from './dto/student-register.dto';
import { BadRequestException } from '@nestjs/common';
import { Role } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    singIn: jest.fn(),
    isEmailFromMatera: jest.fn(),
    registerStudent: jest.fn(),
    registerAdmin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should return an access token', async () => {
      const userAuth: UserAuthDto = {
        usernameOrEmail: 'test@email.com',
        password: '123456',
      };

      const expectedResult = { access_token: 'fake-token' };

      mockAuthService.singIn.mockResolvedValue(expectedResult);

      const result = await controller.signIn(userAuth);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.singIn).toHaveBeenCalledWith(userAuth);
    });
  });

  describe('register', () => {
    it('should register a student and return a token', async () => {
      const userRegister: UserRegisterDto = {
        username: 'johndoe',
        name: 'John Doe',
        email: 'john@gmail.com',
        password: 'pass123',
        image: 'profile.jpg',
      };

      const studentRegister: StudentRegisterDto = {
        dateBirth: '2000-01-01',
        educationLevel: 'HIGHER_COMPLETE',
        state: 'SP',
        ethnicity: 'WHITE',
        gender: 'MALE',
        hasDisability: false,
        needsSupportResources: false,
      };

      const createdUser = {
        email: userRegister.email,
        password: userRegister.password,
      };

      const expectedToken = { access_token: 'student-token' };

      mockAuthService.isEmailFromMatera.mockReturnValue(false);
      mockAuthService.registerStudent.mockResolvedValue(createdUser);
      mockAuthService.singIn.mockResolvedValue(expectedToken);

      const result = await controller.register(userRegister, studentRegister);

      expect(result).toEqual(expectedToken);
      expect(mockAuthService.registerStudent).toHaveBeenCalledWith(userRegister, studentRegister);
      expect(mockAuthService.singIn).toHaveBeenCalledWith(createdUser);
    });

    it('should register an admin and return a token', async () => {
      const userRegister: UserRegisterDto = {
        username: 'admin',
        name: 'Admin User',
        email: 'admin@matera.com',
        password: 'adminpass',
        image: 'admin.jpg',
      };

      const createdUser = {
        email: userRegister.email,
        password: userRegister.password,
      };

      const expectedToken = { access_token: 'admin-token' };

      mockAuthService.isEmailFromMatera.mockReturnValue(true);
      mockAuthService.registerAdmin.mockResolvedValue(createdUser);
      mockAuthService.singIn.mockResolvedValue(expectedToken);

      const result = await controller.register(userRegister, undefined);

      expect(result).toEqual(expectedToken);
      expect(mockAuthService.registerAdmin).toHaveBeenCalledWith(userRegister, Role.ADMIN);
      expect(mockAuthService.singIn).toHaveBeenCalledWith(createdUser);
    });

    it('should throw BadRequest if student data is missing for non-admin', async () => {
      const userRegister: UserRegisterDto = {
        username: 'student',
        name: 'Student User',
        email: 'student@gmail.com',
        password: 'pass',
        image: 'student.jpg',
      };

      mockAuthService.isEmailFromMatera.mockReturnValue(false);

      await expect(controller.register(userRegister, undefined)).rejects.toThrow(
        new BadRequestException('The user is student and your data not found.')
      );

      expect(mockAuthService.registerStudent).not.toHaveBeenCalled();
      expect(mockAuthService.registerAdmin).not.toHaveBeenCalled();
      expect(mockAuthService.singIn).not.toHaveBeenCalled();
    });
  });
});

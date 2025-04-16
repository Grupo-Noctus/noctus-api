import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UserAuthDto } from './dto/user-auth.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { StudentRegisterDto } from './dto/student-register.dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockUserService = {
    findByUsernameOrEmailForAuth: jest.fn(),
  };

  const mockPrisma = {
    user: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UserService, useValue: mockUserService },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('signIn', () => {
    it('should return access token when credentials are valid', async () => {
      const userAuth: UserAuthDto = {
        usernameOrEmail: 'john@example.com',
        password: '123456',
      };

      const mockUser = {
        id: 1,
        username: 'john',
        password: '123456',
        role: Role.STUDENT,
        active: true,
      };

      mockUserService.findByUsernameOrEmailForAuth.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('jwt-token');

      const result = await service.signIn(userAuth);

      expect(result).toEqual({ access_token: 'jwt-token' });
      expect(mockUserService.findByUsernameOrEmailForAuth).toHaveBeenCalledWith('john@example.com');
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        username: mockUser.username,
        role: mockUser.role,
        active: mockUser.active,
      });
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockUserService.findByUsernameOrEmailForAuth.mockResolvedValue({
        password: 'correct',
      });

      await expect(
        service.signIn({ usernameOrEmail: 'user', password: 'wrong' })
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('isEmailFromMatera', () => {
    it('should return true for Matera email', () => {
      expect(service.isEmailFromMatera('admin@matera')).toBe(true);
    });

    it('should return false for non-Matera email', () => {
      expect(service.isEmailFromMatera('user@gmail.com')).toBe(false);
    });
  });

  describe('registerAdmin', () => {
    it('should create and return UserAuthDto for admin', async () => {
      const userRegister: UserRegisterDto = {
        email: 'admin@matera',
        name: 'Admin',
        username: 'admin',
        password: 'admin123',
        image: 'admin.jpg',
      };

      mockPrisma.user.create.mockResolvedValue({
        id: 1,
        email: userRegister.email,
        password: userRegister.password,
      });

      const result = await service.registerAdmin(userRegister, Role.ADMIN);

      expect(result).toEqual({
        id: 1,
        usernameOrEmail: userRegister.email,
        password: userRegister.password,
      });

      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          ...userRegister,
          role: Role.ADMIN,
          active: true,
        },
        select: {
          id: true,
          email: true,
          password: true,
        },
      });
    });
  });

  describe('registerStudent', () => {
    it('should create and return UserAuthDto for student', async () => {
      const userRegister: UserRegisterDto = {
        email: 'student@gmail.com',
        name: 'Student',
        username: 'student1',
        password: 'pass123',
        image: 'student.jpg',
      };

      const studentRegister: StudentRegisterDto = {
        dateBirth: '2001-01-01',
        educationLevel: 'SECONDARY_COMPLETE',
        state: 'SP',
        ethnicity: 'WHITE',
        gender: 'FEMALE',
        hasDisability: false,
        needsSupportResources: false,
      };

      mockPrisma.user.create.mockResolvedValue({
        id: 2,
        email: userRegister.email,
        password: userRegister.password,
      });

      const result = await service.registerStudent(userRegister, studentRegister);

      expect(result).toEqual({
        id: 2,
        usernameOrEmail: userRegister.email,
        password: userRegister.password,
      });

      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          ...userRegister,
          role: Role.STUDENT,
          active: true,
          student: {
            create: {
              ...studentRegister,
            },
          },
        },
        select: {
          id: true,
          email: true,
          password: true,
        },
      });
    });
  });
});

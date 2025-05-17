import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { EducationLevel, Role } from '@prisma/client';
import { LoginRequestDto } from './dto/login-request.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { StudentRegisterDto } from './dto/student-register.dto';

jest.mock('argon2');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userService: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mocked-token'),
          },
        },
        {
          provide: UserService,
          useValue: {
            findByUsernameOrEmailForAuth: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('signIn', () => {
    it('should return access token on valid credentials', async () => {
      const loginDto: LoginRequestDto = {
        usernameOrEmail: 'joao',
        password: 'password123',
      };

      const mockUser = {
        id: 1,
        username: 'joao',
        password: 'hashed-password',
        role: Role.ADMIN,
        active: true,
      };

      (userService.findByUsernameOrEmailForAuth as jest.Mock).mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await service.signIn(loginDto);
      expect(result).toEqual({ access_token: 'mocked-token' });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        username: mockUser.username,
        role: mockUser.role,
        active: mockUser.active,
      });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      (userService.findByUsernameOrEmailForAuth as jest.Mock).mockResolvedValue(null);

      await expect(service.signIn({ usernameOrEmail: 'fail', password: 'fail' }))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const mockUser = { id: 1, username: 'joao', password: 'hash', role: Role.ADMIN, active: true };

      (userService.findByUsernameOrEmailForAuth as jest.Mock).mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn({ usernameOrEmail: 'joao', password: 'wrong' }))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });

  describe('registerAdmin', () => {
    it('should create an admin user', async () => {
      const dto: UserRegisterDto = {
        username: 'admin',
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        phoneNumber: '+5511912345678',
      };

      (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');
      (prisma.user.create as jest.Mock).mockResolvedValue(true);

      const result = await service.registerAdmin(dto, 'image.png');
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          role: Role.ADMIN,
          active: true,
          password: 'hashed-password',
          image: 'image.png',
        },
      });
      expect(result).toBe(true);
    });
  });

  describe('registerStudent', () => {
    it('should create a student user with student data', async () => {
      const userDto: UserRegisterDto = {
        username: 'student1',
        name: 'Student One',
        email: 'student@example.com',
        password: 'pass123',
        phoneNumber: '+5511912345678',
      };

      const studentDto: StudentRegisterDto = {
        dateBirth: '2005-03-23T15:00:00.000Z',
        educationLevel: EducationLevel.PRIMARY_INCOMPLETE,
        state: 'SP',
        ethnicity: 'WHITE',
        gender: 'MALE',
        hasDisability: false,
        needsSupportResources: false,
      };

      (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');
      (prisma.user.create as jest.Mock).mockResolvedValue(true);

      const result = await service.registerStudent(userDto, studentDto, 'image.jpg');
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...userDto,
          role: Role.STUDENT,
          active: true,
          password: 'hashed-password',
          image: 'image.jpg',
          student: {
            create: {
              ...studentDto,
              dateBirth: new Date(studentDto.dateBirth),
            },
          },
        },
      });
      expect(result).toBe(true);
    });
  });
});

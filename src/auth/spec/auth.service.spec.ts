import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { IAuthService } from '../interface/auth.service.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { EducationLevel, Ethnicity, Gender, Role, State } from '@prisma/client';
import { LoginRequestDto } from '../dto/request/login.request.dto';
import { UserRegisterDto } from '../dto/request/user-register.request.dto';
import { StudentRegisterDto } from '../dto/request/student-register.request.dto';

jest.mock('argon2');

describe('AuthService', () => {
  let authService: IAuthService;
  let prisma: PrismaService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IAuthService,
          useClass: AuthService,
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
            },
            student: {
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mock_token'),
          },
        },
        {
          provide: UserService,
          useValue: {
            findByUsernameOrEmailForAuth: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<IAuthService>(IAuthService);
    prisma = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);
  });

  describe('signIn', () => {
    it('should return access token when credentials are valid', async () => {
      const loginDto: LoginRequestDto = {
        usernameOrEmail: 'admin@example.com',
        password: 'test123',
      };

      const user = {
        id: 1,
        username: 'adminuser',
        email: 'admin@example.com',
        password: 'hashed_password',
        role: Role.ADMIN,
      };

      (userService.findByUsernameOrEmailForAuth as jest.Mock).mockResolvedValue(user);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await authService.signIn(loginDto);

      expect(userService.findByUsernameOrEmailForAuth).toHaveBeenCalledWith(
        loginDto.usernameOrEmail,
      );
      expect(argon2.verify).toHaveBeenCalledWith(user.password, loginDto.password);

      expect(result).toHaveProperty('access_token', 'mock_token');
    });

    it('should throw if user is not found', async () => {
      (userService.findByUsernameOrEmailForAuth as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.signIn({ usernameOrEmail: 'notfound@example.com', password: 'test123' }),
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw if password is invalid', async () => {
      const user = { id: 1, username: 'adminuser', password: 'hashed_password' };

      (userService.findByUsernameOrEmailForAuth as jest.Mock).mockResolvedValue(user);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.signIn({ usernameOrEmail: 'adminuser', password: 'wrong' }),
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('registerAdmin', () => {
    it('should create an admin user and return true', async () => {
      const dto: UserRegisterDto = {
        name: 'Admin',
        email: 'admin@example.com',
        username: 'adminuser',
        password: 'test123',
        phoneNumber: '123456789',
      };

      (argon2.hash as jest.Mock).mockResolvedValue('hashed_password');
      (prisma.user.create as jest.Mock).mockResolvedValue({ id: 1 });

      const result = await authService.registerAdmin(dto, 'admin.png');

      expect(argon2.hash).toHaveBeenCalledWith(dto.password);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          role: Role.ADMIN,
          active: true,
          password: 'hashed_password',
          image: 'admin.png',
        },
      });
      expect(result).toBe(true);
    });
  });

  describe('registerStudent', () => {
    it('should create a student user and return true', async () => {
      const userDto: UserRegisterDto = {
        name: 'Student',
        email: 'student@example.com',
        username: 'studentuser',
        password: 'test123',
        phoneNumber: '987654321',
      };

      const studentDto: StudentRegisterDto = {
        dateBirth: '2000-01-01',
        educationLevel: EducationLevel.HIGHER_COMPLETE,
        state: State.SP,
        ethnicity: Ethnicity.WHITE,
        gender: Gender.FEMALE,
        hasDisability: true,
        disabilityType: 'Visual',
        needsSupportResources: true,
        supportResourcesDescription: 'Screen reader',
      };

      (argon2.hash as jest.Mock).mockResolvedValue('hashed_password');
      (prisma.user.create as jest.Mock).mockResolvedValue({ id: 1 });

      const result = await authService.registerStudent(userDto, studentDto, 'student.png');

      expect(argon2.hash).toHaveBeenCalledWith(userDto.password);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...userDto,
          role: Role.STUDENT,
          active: true,
          password: 'hashed_password',
          image: 'student.png',
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

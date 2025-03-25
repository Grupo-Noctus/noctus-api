import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserAuthDto } from './dto/user-auth.dto';
import { RegisterDto } from './dto/register.dto';
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
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('signIn', () => {
    it('should return an access_token on successful login', async () => {
      const loginDto: UserAuthDto = {
        usernameOrEmail: 'joao@email.com',
        password: 'senhaSegura123',
      };

      const result = { access_token: 'token123' };
      mockAuthService.singIn.mockResolvedValue(result);

      const response = await controller.signIn(loginDto);
      expect(response).toEqual(result);
      expect(authService.singIn).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('register', () => {
    it('should register a student and return an access_token', async () => {
      const registerDto: RegisterDto = {
        user: {
          username: 'joaosilva',
          name: 'João da Silva',
          email: 'joao@email.com',
          password: 'senhaSegura123',
          image: '',
        },
        student: {
          dateBirth: '2005-03-23T15:00:00.000Z',
          educationLevel: 'HIGHER_COMPLETE',
          state: 'SP',
          ethnicity: 'WHITE',
          gender: 'MALE',
          hasDisability: false,
          needsSupportResources: false,
        },
      };

      const createdUser = { id: '123', email: 'joao@email.com' };
      const result = { access_token: 'student-token' };

      mockAuthService.isEmailFromMatera.mockReturnValue(false);
      mockAuthService.registerStudent.mockResolvedValue(createdUser);
      mockAuthService.singIn.mockResolvedValue(result);

      const response = await controller.register(registerDto);

      expect(response).toEqual(result);
      expect(authService.registerStudent).toHaveBeenCalledWith(registerDto.user, registerDto.student);
      expect(authService.singIn).toHaveBeenCalledWith(createdUser);
    });

    it('should register an admin and return an access_token', async () => {
      const registerDto: RegisterDto = {
        user: {
          username: 'adminuser',
          name: 'Admin',
          email: 'admin@matera.com',
          password: 'adminPass123',
          image: '',
        },
      };

      const createdUser = { id: '999', email: 'admin@matera.com' };
      const result = { access_token: 'admin-token' };

      mockAuthService.isEmailFromMatera.mockReturnValue(true);
      mockAuthService.registerAdmin.mockResolvedValue(createdUser);
      mockAuthService.singIn.mockResolvedValue(result);

      const response = await controller.register(registerDto);

      expect(response).toEqual(result);
      expect(authService.registerAdmin).toHaveBeenCalledWith(registerDto.user, Role.ADMIN);
      expect(authService.singIn).toHaveBeenCalledWith(createdUser);
    });

    it('should throw BadRequestException if student data is missing for non-admin', async () => {
      const registerDto: RegisterDto = {
        user: {
          username: 'aluno',
          name: 'Aluno Exemplo',
          email: 'aluno@gmail.com',
          password: 'senha123',
          image: '',
        },
      };

      mockAuthService.isEmailFromMatera.mockReturnValue(false);

      await expect(controller.register(registerDto)).rejects.toThrow('The user is student and your data not found.');
    });
  });
});

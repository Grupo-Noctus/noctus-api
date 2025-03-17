import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findByUsernameOrEmailForAuth', () => {
    it('should call prisma with username or email and return user data', async () => {
      const mockUser = {
        id: 1,
        username: 'john',
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        role: 'STUDENT',
        active: true,
      };

      mockPrisma.user.findFirst.mockResolvedValue(mockUser);

      const result = await service.findByUsernameOrEmailForAuth('john');

      expect(result).toEqual(mockUser);
      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { username: 'john' },
            { email: 'john' },
          ],
        },
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
          password: true,
          role: true,
          active: true,
        },
      });
    });

    it('should return null if user is not found', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);

      const result = await service.findByUsernameOrEmailForAuth('notfound');

      expect(result).toBeNull();
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ModuleService } from './module.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ModuleService', () => {
  let service: ModuleService;
  let prisma: PrismaService;

  const mockPrisma = {
    module: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModuleService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ModuleService>(ModuleService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyOrder', () => {
    it('should return true if order exists', async () => {
      mockPrisma.module.findMany.mockResolvedValue([{ order: 1 }, { order: 2 }]);
      const result = await service.verifyOrder(1, 2);
      expect(result).toBe(true);
    });

    it('should return false if order does not exist', async () => {
      mockPrisma.module.findMany.mockResolvedValue([{ order: 1 }, { order: 2 }]);
      const result = await service.verifyOrder(1, 3);
      expect(result).toBe(false);
    });
  });

  describe('createModule', () => {
    it('should create module with incremented order', async () => {
      const dto = { idCourse: 1, name: 'Test', description: 'Desc' };
      mockPrisma.module.findFirst.mockResolvedValue({ order: 2 });
      mockPrisma.module.create.mockResolvedValue({});

      const result = await service.createModule(dto as any, 1);

      expect(mockPrisma.module.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            order: 3,
            createdBy: 1,
            updatedBy: 1,
          }),
        }),
      );
      expect(result).toBe(true);
    });

    it('should default order to 1 if no modules exist', async () => {
      const dto = { idCourse: 1, name: 'Test', description: 'Desc' };
      mockPrisma.module.findFirst.mockResolvedValue(null);
      mockPrisma.module.create.mockResolvedValue({});

      const result = await service.createModule(dto as any, 1);
      expect(mockPrisma.module.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ order: 1 }),
        }),
      );
      expect(result).toBe(true);
    });

    it('should throw BadRequestException on error', async () => {
      mockPrisma.module.findFirst.mockRejectedValue(new Error('fail'));
      await expect(service.createModule({} as any, 1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateModule', () => {
    it('should update the module', async () => {
      mockPrisma.module.update.mockResolvedValue({});
      const result = await service.updateModule(1, { name: 'New' } as any, 2);
      expect(mockPrisma.module.update).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should throw BadRequestException on error', async () => {
      mockPrisma.module.update.mockRejectedValue(new Error());
      await expect(service.updateModule(1, {} as any, 1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOneModule', () => {
    it('should return module', async () => {
      mockPrisma.module.findUnique.mockResolvedValue({ name: 'Test', description: 'Desc', order: 1 });
      const result = await service.findOneModule(1);
      expect(result).toEqual({ name: 'Test', description: 'Desc', order: 1 });
    });

    it('should throw NotFoundException on error', async () => {
      mockPrisma.module.findUnique.mockRejectedValue(new Error());
      await expect(service.findOneModule(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteCourse', () => {
    it('should delete the module', async () => {
      mockPrisma.module.delete.mockResolvedValue({});
      await expect(service.deleteCourse(1)).resolves.toBeUndefined();
    });

    it('should throw NotFoundException on error', async () => {
      mockPrisma.module.delete.mockRejectedValue(new Error());
      await expect(service.deleteCourse(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findManyModule', () => {
    it('should return list of modules', async () => {
      const modules = [{ name: 'A', description: 'B', order: 1 }];
      mockPrisma.module.findMany.mockResolvedValue(modules);
      const result = await service.findManyModule(1);
      expect(result).toEqual(modules);
    });

    it('should throw NotFoundException if none found', async () => {
      mockPrisma.module.findMany.mockResolvedValue([]);
      await expect(service.findManyModule(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException on error', async () => {
      mockPrisma.module.findMany.mockRejectedValue(new Error());
      await expect(service.findManyModule(1)).rejects.toThrow(NotFoundException);
    });
  });
});

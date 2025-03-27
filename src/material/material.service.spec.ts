import { Test, TestingModule } from '@nestjs/testing';
import { MaterialService } from './material.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { TypeMidia } from '@prisma/client';

const mockMaterial = {
  id: 1,
  name: 'Material Test',
  description: 'Description Test',
  filename: 'file.pdf',
  type: TypeMidia.PDF,
  link: 'http://example.com/file.pdf',
  createdBy: 1,
  updatedBy: 1,
  idCourse: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('MaterialService', () => {
  let service: MaterialService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaterialService,
        {
          provide: PrismaService,
          useValue: {
            material: {
              create: jest.fn().mockResolvedValue(mockMaterial),
              findMany: jest.fn().mockResolvedValue([mockMaterial]),
              findUnique: jest.fn().mockResolvedValue(mockMaterial),
              update: jest.fn().mockResolvedValue(mockMaterial),
              delete: jest.fn().mockResolvedValue(mockMaterial),
            },
          },
        },
      ],
    }).compile();

    service = module.get<MaterialService>(MaterialService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new material', async () => {
      const result = await service.create(mockMaterial);
      expect(result).toEqual(mockMaterial);
      expect(prisma.material.create).toHaveBeenCalledWith({
        data: {
          ...mockMaterial,
          course: { connect: { id: mockMaterial.idCourse } },
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of materials', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockMaterial]);
      expect(prisma.material.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a material by id', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockMaterial);
      expect(prisma.material.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if material not found', async () => {
      jest.spyOn(prisma.material, 'findUnique').mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a material', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockMaterial);
      expect(prisma.material.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if material does not exist', async () => {
      jest.spyOn(prisma.material, 'delete').mockRejectedValue(new NotFoundException('Material not found'));
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});

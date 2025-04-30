import { Test, TestingModule } from '@nestjs/testing';
import { MaterialService } from './material.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { TypeMidia } from '@prisma/client';

const user = {
  id: 1,
}
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

const mockFile = {
  fieldname: 'file',
  originalname: 'file.pdf',
  encoding: '7bit',
  mimetype: 'application/pdf',
  size: 1024,
  destination: './uploads',
  filename: 'file.pdf',
  path: './uploads/file.pdf',
  buffer: Buffer.from('mock file'),
} as Express.Multer.File;

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

  describe('createMaterial', () => {
    it('should create a new material', async () => {
      const result = await service.createMaterial(mockMaterial, user, mockFile);
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
      const result = await service.findManyMaterial(10);
      expect(result).toEqual([mockMaterial]);
      expect(prisma.material.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a material by id', async () => {
      const result = await service.findOneMaterial(1);
      expect(result).toEqual(mockMaterial);
      expect(prisma.material.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if material not found', async () => {
      jest.spyOn(prisma.material, 'findUnique').mockResolvedValueOnce(null);
      await expect(service.findOneMaterial(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a material', async () => {
      const result = await service.deleteMaterial(1);
      expect(result).toEqual(mockMaterial);
      expect(prisma.material.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if material does not exist', async () => {
      jest.spyOn(prisma.material, 'delete').mockRejectedValue(new NotFoundException('Material not found'));
      await expect(service.deleteMaterial(999)).rejects.toThrow(NotFoundException);
    });
  });
});

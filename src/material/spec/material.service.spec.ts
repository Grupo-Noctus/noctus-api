import { Test, TestingModule } from '@nestjs/testing';
import { MaterialService } from '../material.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadService } from '../../upload/upload.service';
import { NotFoundException } from '@nestjs/common';
import { TypeMidia } from '@prisma/client';
import { Readable } from 'stream';

describe('MaterialService', () => {
  let service: MaterialService;
  let prisma: PrismaService;
  let uploadService: UploadService;

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
    stream: new Readable(),
  } as Express.Multer.File;

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
              delete: jest.fn().mockResolvedValue(mockMaterial),
            },
          },
        },
        {
          provide: UploadService,
          useValue: {
            uploadFileMetadata: jest.fn().mockResolvedValue('metadata'),
            deleteFile: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<MaterialService>(MaterialService);
    prisma = module.get<PrismaService>(PrismaService);
    uploadService = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMaterial', () => {
    it('should create a new material', async () => {
      const materialDto = {
        name: 'Material Test',
        description: 'Description Test',
        type: TypeMidia.PDF,
        link: 'http://example.com/file.pdf',
        idCourse: 1,
      };

      const result = await service.createMaterial(materialDto, 1, mockFile);
      expect(result).toBe(mockMaterial.id);
      expect(prisma.material.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          course: { connect: { id: 1 } },
          filename: mockFile.filename,
          createdBy: 1,
          updatedBy: 1,
        }),
      });
    });
  });

  describe('findManyMaterial', () => {
    it('should return an array of materials', async () => {
      const result = await service.findManyMaterial(1);
      expect(result).toEqual([mockMaterial]);
      expect(prisma.material.findMany).toHaveBeenCalledWith({
        where: { idCourse: 1 },
      });
    });
  });

  describe('findOneMaterial', () => {
    it('should return a material by id', async () => {
      const result = await service.findOneMaterial(1);
      expect(result).toEqual(mockMaterial);
      expect(prisma.material.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return material with metadata when withMetadata is true', async () => {
      const result = await service.findOneMaterial(1, true);
      expect(result).toEqual({
        material: mockMaterial,
        fileMetadata: 'metadata',
      });
    });

    it('should throw NotFoundException if material not found', async () => {
      jest.spyOn(prisma.material, 'findUnique').mockResolvedValueOnce(null);
      await expect(service.findOneMaterial(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteMaterial', () => {
    it('should delete a material', async () => {
      await service.deleteMaterial(1);
      expect(prisma.material.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(uploadService.deleteFile).toHaveBeenCalled();
    });

    it('should throw NotFoundException if material does not exist', async () => {
      jest.spyOn(prisma.material, 'findUnique').mockResolvedValueOnce(null);
      await expect(service.deleteMaterial(999)).rejects.toThrow(NotFoundException);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { MaterialController } from '../material.controller';
import { MaterialService } from '../material.service';
import { MaterialResponseDto } from '../dto/material-response.dto';
import { TypeMidia } from '@prisma/client';
import { Response } from 'express';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Readable } from 'stream';

describe('MaterialController', () => {
  let controller: MaterialController;
  let service: MaterialService;

  const mockMaterial = {
    id: 1,
    name: 'Test Material',
    description: 'Test Description',
    filename: 'test.pdf',
    type: TypeMidia.PDF,
    link: 'http://example.com',
    createdBy: 1,
    updatedBy: 1,
    idCourse: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockFile = {
    fieldname: 'file',
    originalname: 'test.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    buffer: Buffer.from('mock file content'),
    size: 1024,
    destination: '',
    filename: 'test.pdf',
    path: '',
    stream: new Readable(),
  } as Express.Multer.File;

  const mockResponse = {
    download: jest.fn(),
  } as unknown as Response;

  const mockMaterialService = {
    createMaterial: jest.fn().mockResolvedValue(1),
    findManyMaterial: jest.fn().mockResolvedValue([mockMaterial]),
    findOneMaterial: jest.fn().mockResolvedValue(mockMaterial),
    deleteMaterial: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialController],
      providers: [
        {
          provide: MaterialService,
          useValue: mockMaterialService,
        },
      ],
    }).compile();

    controller = module.get<MaterialController>(MaterialController);
    service = module.get<MaterialService>(MaterialService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createMaterial', () => {
    it('should create a material', async () => {
      const dto = {
        name: 'Test Material',
        description: 'Test Description',
        type: TypeMidia.PDF,
        link: 'http://example.com',
        idCourse: 1,
      };

      const result = await controller.createMaterial(dto, 1, mockFile);
      expect(result).toBe(1);
      expect(service.createMaterial).toHaveBeenCalledWith(dto, 1, mockFile);
    });

    it('should throw BadRequestException for blocked file extensions', async () => {
      const dto = {
        name: 'Test Material',
        description: 'Test Description',
        type: TypeMidia.PDF,
        link: 'http://example.com',
        idCourse: 1,
      };

      const badFile = { ...mockFile, originalname: 'test.exe' };
      await expect(controller.createMaterial(dto, 1, badFile)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findManyMaterial', () => {
    it('should return an array of materials', async () => {
      const result = await controller.findManyMaterial('1');
      expect(result).toEqual([mockMaterial]);
      expect(service.findManyMaterial).toHaveBeenCalledWith(1);
    });
  });

  describe('findOneMaterial', () => {
    it('should download a material file', async () => {
      await controller.findOneMaterial('1', mockResponse);
      expect(service.findOneMaterial).toHaveBeenCalledWith(1);
      expect(mockResponse.download).toHaveBeenCalled();
    });

    it('should throw NotFoundException when material has no file', async () => {
      const materialWithoutFile = { ...mockMaterial, filename: null };
      jest.spyOn(service, 'findOneMaterial').mockResolvedValueOnce(materialWithoutFile as any);
      await expect(controller.findOneMaterial('1', mockResponse)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteMaterial', () => {
    it('should delete a material', async () => {
      await controller.deleteMaterial('1');
      expect(service.deleteMaterial).toHaveBeenCalledWith(1);
    });
  });
});

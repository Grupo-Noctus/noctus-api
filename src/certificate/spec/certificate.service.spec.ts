import { Test, TestingModule } from '@nestjs/testing';
import { CertificateService } from '../certificate.service';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('puppeteer', () => ({
  launch: jest.fn().mockImplementation(() => ({
    newPage: jest.fn().mockImplementation(() => ({
      setContent: jest.fn().mockResolvedValue(null),
      pdf: jest.fn().mockResolvedValue(Buffer.from('mock pdf')),
    })),
    close: jest.fn(),
  })),
}));

describe('CertificateService', () => {
  let service: CertificateService;
  let prismaService: PrismaService;

  const mockEnrollment = {
    id: 1,
    idStudent: 1,
    idCourse: 1,
    active: true,
    completed: true,
    expiresAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    student: {
      user: {
        name: 'John Doe'
      }
    },
    course: {
      name: 'Node.js Advanced'
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CertificateService,
        {
          provide: PrismaService,
          useValue: {
            enrollment: {
              findUnique: jest.fn().mockResolvedValue(mockEnrollment)
            }
          }
        }
      ],
    }).compile();

    service = module.get<CertificateService>(CertificateService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs.promises, 'readFile').mockResolvedValue('<html>{{name}}</html>');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findCertificate', () => {
    it('should generate a certificate successfully', async () => {
      const result = await service.findCertificate(1);
      expect(result).toBeInstanceOf(Buffer);
    });

    it('should throw BadRequestException when enrollment not found', async () => {
      jest.spyOn(prismaService.enrollment, 'findUnique').mockResolvedValue(null);
      await expect(service.findCertificate(1))
        .rejects
        .toThrow(new BadRequestException('Enrollment not found'));
    });

    it('should throw BadRequestException when course not completed', async () => {
      jest.spyOn(prismaService.enrollment, 'findUnique').mockResolvedValue({
        ...mockEnrollment,
        completed: false
      });
      await expect(service.findCertificate(1))
        .rejects
        .toThrow(new BadRequestException('Student has not completed the course'));
    });

    it('should throw error when template file not found', async () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);
      await expect(service.findCertificate(1))
        .rejects
        .toThrow();
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CertificateService } from './certificate.service';
import { BadRequestException } from '@nestjs/common';
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

  const mockStudentData = {
    name: 'John Doe',
    course: 'Node.js Advanced',
    date: '2024-03-15'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CertificateService],
    }).compile();

    service = module.get<CertificateService>(CertificateService);

    // Mock fs.existsSync
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    // Mock fs.promises.readFile
    jest.spyOn(fs.promises, 'readFile').mockResolvedValue('<html>{{name}}</html>');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateCertificate', () => {
    it('should generate a certificate successfully', async () => {
      const result = await service.generateCertificate(mockStudentData);
      expect(result).toBeInstanceOf(Buffer);
    });

    it('should throw BadRequestException for invalid name', async () => {
      const invalidData = { ...mockStudentData, name: '' };
      await expect(service.generateCertificate(invalidData))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid course', async () => {
      const invalidData = { ...mockStudentData, course: '' };
      await expect(service.generateCertificate(invalidData))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid date', async () => {
      const invalidData = { ...mockStudentData, date: 'invalid-date' };
      await expect(service.generateCertificate(invalidData))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw error when template file not found', async () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);
      await expect(service.generateCertificate(mockStudentData))
        .rejects
        .toThrow();
    });
  });
});

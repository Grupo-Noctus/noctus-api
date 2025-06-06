import { Test, TestingModule } from '@nestjs/testing';
import { CertificateController } from './certificate.controller';
import { CertificateService } from './certificate.service';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto';

describe('CertificateController', () => {
  let controller: CertificateController;
  let service: CertificateService;

  const mockCreateCertificateDto: CreateCertificateDto = {
    studentName: 'John Doe',
    courseName: 'Node.js Advanced',
    completionDate: '2024-03-15'
  };

  const mockPdfBuffer = Buffer.from('mock pdf content');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CertificateController],
      providers: [
        {
          provide: CertificateService,
          useValue: {
            generateCertificate: jest.fn().mockResolvedValue(mockPdfBuffer),
          },
        },
      ],
    }).compile();

    controller = module.get<CertificateController>(CertificateController);
    service = module.get<CertificateService>(CertificateService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateCertificate', () => {
    it('should generate certificate successfully', async () => {
      const result = await controller.generateCertificate(mockCreateCertificateDto);

      expect(result).toEqual({
        success: true,
        data: mockPdfBuffer,
        message: 'Certificate generated successfully'
      });

      expect(service.generateCertificate).toHaveBeenCalledWith({
        name: mockCreateCertificateDto.studentName,
        course: mockCreateCertificateDto.courseName,
        date: mockCreateCertificateDto.completionDate
      });
    });

    it('should pass through BadRequestException from service', async () => {
      const error = new BadRequestException('Validation error');
      jest.spyOn(service, 'generateCertificate').mockRejectedValue(error);

      await expect(controller.generateCertificate(mockCreateCertificateDto))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException for unknown errors', async () => {
      jest.spyOn(service, 'generateCertificate').mockRejectedValue(new Error('Unknown error'));

      await expect(controller.generateCertificate(mockCreateCertificateDto))
        .rejects
        .toThrow(InternalServerErrorException);
    });

    it('should log error when exception occurs', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(service, 'generateCertificate').mockRejectedValue(new Error('Test error'));

      await expect(controller.generateCertificate(mockCreateCertificateDto))
        .rejects
        .toThrow(InternalServerErrorException);

      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});

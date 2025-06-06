import { Test, TestingModule } from '@nestjs/testing';
import { CertificateController } from '../certificate.controller';
import { CertificateService } from '../certificate.service';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';

describe('CertificateController', () => {
  let controller: CertificateController;
  let service: CertificateService;

  const mockPdfBuffer = Buffer.from('mock pdf content');
  const mockResponse = {
    set: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CertificateController],
      providers: [
        {
          provide: CertificateService,
          useValue: {
            findCertificate: jest.fn().mockResolvedValue(mockPdfBuffer),
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

  describe('findCertificate', () => {
    it('should find certificate successfully', async () => {
      await controller.findCertificate('1', mockResponse);

      expect(service.findCertificate).toHaveBeenCalledWith(1);
      expect(mockResponse.set).toHaveBeenCalledWith({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="certificate.pdf"',
        'Content-Length': mockPdfBuffer.length,
      });
      expect(mockResponse.send).toHaveBeenCalledWith(mockPdfBuffer);
    });

    it('should pass through BadRequestException from service', async () => {
      const error = new BadRequestException('Validation error');
      jest.spyOn(service, 'findCertificate').mockRejectedValue(error);

      await expect(controller.findCertificate('1', mockResponse))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException for unknown errors', async () => {
      jest.spyOn(service, 'findCertificate').mockRejectedValue(new Error('Unknown error'));

      await expect(controller.findCertificate('1', mockResponse))
        .rejects
        .toThrow(InternalServerErrorException);
    });

    it('should log error when exception occurs', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(service, 'findCertificate').mockRejectedValue(new Error('Test error'));

      await expect(controller.findCertificate('1', mockResponse))
        .rejects
        .toThrow(InternalServerErrorException);

      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});

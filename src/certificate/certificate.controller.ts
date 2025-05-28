import { Controller, Post, Body, Res, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';

@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post('generate')
  async generateCertificate(
    @Body() studentData: CreateCertificateDto,
    @Res() res: Response,
  ) {
    try {
      const pdfBuffer = await this.certificateService.generateCertificate({
        name: studentData.name,
        course: studentData.course,
        date: studentData.date
      });

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate.pdf"`,
        'Content-Length': pdfBuffer.length,
      });

      return res.send(pdfBuffer);

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.error('Error generating certificate:', error);
      throw new InternalServerErrorException('Error generating certificate.');
    }
  }
}

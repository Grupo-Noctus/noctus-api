import { Controller, Post, Body, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';

@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post('generate')
  async generateCertificate(@Body() studentData: CreateCertificateDto) {
    try {
      const certificateData = {
        name: studentData.studentName,
        course: studentData.courseName,
        date: studentData.completionDate
      };

      const pdfBuffer = await this.certificateService.generateCertificate(certificateData);
      
      return {
        success: true,
        data: pdfBuffer,
        message: 'Certificate generated successfully'
      };

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.error('Error generating certificate:', error);
      throw new InternalServerErrorException('Error generating certificate.');
    }
  }
}


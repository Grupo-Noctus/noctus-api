import { Controller, Get, Param, Res, InternalServerErrorException, BadRequestException, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { CertificateService } from './certificate.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@ApiTags('Certificate')
@Controller('certificate')
@UseGuards(AuthGuard)
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Get(':enrollmentId')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get student certificate' })
  @ApiResponse({ status: 200, description: 'Certificate found and returned successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data or student has not completed the course' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findCertificate(
    @Param('enrollmentId') enrollmentId: string,
    @Res() res: Response
  ) {
    try {
      const pdfBuffer = await this.certificateService.findCertificate(parseInt(enrollmentId));

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
      throw new InternalServerErrorException('Error generating certificate');
    }
  }
}

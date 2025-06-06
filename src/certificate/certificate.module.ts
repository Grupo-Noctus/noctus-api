import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CertificateController],
  providers: [CertificateService, PrismaService],
})
export class CertificateModule {}

import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class CertificateService {
  constructor(private readonly prisma: PrismaService) {}

  async findCertificate(enrollmentId: number): Promise<Buffer> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: true,
        student: {
          include: {
            user: true
          }
        }
      }
    });

    if (!enrollment) {
      throw new BadRequestException('Enrollment not found');
    }

    if (!enrollment.completed) {
      throw new BadRequestException('Student has not completed the course');
    }

    const templatePath = path.join(process.cwd(), 'uploads', 'certificate', 'certificate.template.hbs');
    
    if (!fs.existsSync(templatePath)) {
      throw new InternalServerErrorException(`Template not found at: ${templatePath}`);
    }

    try {
      await fs.promises.access(templatePath, fs.constants.R_OK);
    } catch (error) {
      throw new InternalServerErrorException(`No permission to read file at: ${templatePath}`);
    }

    const templateHtml = await fs.promises.readFile(templatePath, 'utf8');
    const template = handlebars.compile(templateHtml);
    
    const certificateData = {
      name: enrollment.student.user.name,
      course: enrollment.course.name,
      date: new Date().toISOString()
    };

    const html = template(certificateData);

    const browser = await puppeteer.launch({
      headless: true
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const uint8Array = await page.pdf({
      format: 'A4',
      printBackground: true
    });
    
    await browser.close();
    return Buffer.from(uint8Array);
  }
}


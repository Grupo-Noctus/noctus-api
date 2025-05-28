import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

interface StudentCertificateData {
  name: string;
  course: string;
  date: string;
}

@Injectable()
export class CertificateService {
  async generateCertificate(studentData: StudentCertificateData): Promise<Buffer> {
    this.validateStudentData(studentData);

    const templatePath = path.join(__dirname, 'uploads', 'certificate', 'certificate.template.hbs');
    const templateHtml = await fs.promises.readFile(templatePath, 'utf8');
    const template = handlebars.compile(templateHtml);
    const html = template(studentData);

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

  private validateStudentData(data: StudentCertificateData): void {
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      throw new BadRequestException('Student name is required');
    }

    if (!data.course || typeof data.course !== 'string' || data.course.trim().length === 0) {
      throw new BadRequestException('Course name is required');
    }

    if (!data.date || !this.isValidDate(data.date)) {
      throw new BadRequestException('Invalid date');
    }
  }

  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }
}


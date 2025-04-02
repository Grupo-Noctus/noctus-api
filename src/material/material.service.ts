import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MaterialRequestDto } from './dto/material-resquest.dto';
import { MaterialResponseDto } from './dto/material-response.dto';
import { EncryptionService } from '../encryption/encryption.service';
import { MaterialPaginationResponseDto } from './dto/material-pagination-response.dto';

@Injectable()
export class MaterialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryptionService: EncryptionService
  ) {}

  async createMaterial(
    courseResponse: MaterialRequestDto, 
    userId: number, 
    file?: Express.Multer.File
  ): Promise<boolean> {
    try {
      const encryptedData = Object.fromEntries(
        Object.entries(courseResponse).map(([key, value]) => [
          key, 
          this.encryptionService.encrypt(String(value))
        ])
      );

      const filePath = file ? `/uploads/${file.filename}` : null;
      console.log('Saving material:', {
        ...encryptedData,
        userId,
        filePath,
      });

      return true;
    } catch (error) {
      console.error('Error while creating material:', error);
      throw new InternalServerErrorException('Failed to process request');
    }
  }


  async findManyMaterial(pageNumber: number): Promise<MaterialPaginationResponseDto>{
    try{
      const PAGE_SIZE = 10;
      const page = (PAGE_SIZE * (pageNumber - 1));

      const totalCount = await this.prisma.course.count(); 
      const totalPages = Math.ceil(totalCount / PAGE_SIZE);

      const materials = await this.prisma.$queryRaw<
        MaterialResponseDto[]
      >`
        SELECT c.name, c.description, c.image, c.startDate, c.endDate
        FROM Course c
        ORDER BY name ASC
        LIMIT ${PAGE_SIZE} OFFSET ${page}
      `;
      if(!materials || materials.length == 0){
        throw new NotFoundException('No courses found.');
      }
      return { materials, totalPages};
    } catch (error) {
      console.error (error);
      throw new NotFoundException();
    }
  }
  async findOneMaterial(id: number) {
    const material = await this.prisma.material.findUnique({
      where: { id },
    });

    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }
    try {
    return {
      ...material,
      name: this.encryptionService.decryptAES(material.name),
      description: this.encryptionService.decryptAES(material.description),
      filename: this.encryptionService.decryptAES(material.filename),
      link: this.encryptionService.decryptAES(material.link),
    };
  } catch (error) {
    console.error(error);
    throw new NotFoundException();
  }
}

  async deleteMaterial(id: number) {
    try {
      return await this.prisma.material.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }
  }
}

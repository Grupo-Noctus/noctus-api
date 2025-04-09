import {
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MaterialRequestDto } from './dto/material-resquest.dto';
import { MaterialResponseDto } from './dto/material-response.dto';
import { EncryptionService } from 'src/interceptors/encryption.service';
import { MaterialPaginationResponseDto } from './dto/material-pagination-response.dto';

@Injectable()
export class MaterialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryptionService: EncryptionService
  ) {}

  async createMaterial(
    materialResponse: MaterialRequestDto,
    user: {id: number},
    file: Express.Multer.File
  ): Promise<number> {
    console.log('user in controller:', user.id);
    try {
      const filePath = file ? file.filename : null;

      const encryptedData = {
        name: this.encryptionService.encrypt(materialResponse.name),
        description: this.encryptionService.encrypt(materialResponse.description),
        filename: filePath ? this.encryptionService.encrypt(filePath) : null,
        link: this.encryptionService.encrypt(materialResponse.link),
      };

      const createdMaterial = await this.prisma.material.create({
        data: {
          ...encryptedData,
          type: materialResponse.type,
          createdBy: user.id,
          updatedBy: user.id,
          course: {
            connect: { id: Number(materialResponse.idCourse) },
          },
        },
      });

      return createdMaterial.id;
    } catch (error) {
      throw new Error(`Error to create Material: ${error.message}`);
    }
  }

  async findManyMaterial(pageNumber: number): Promise<MaterialPaginationResponseDto> {
    try {
      const PAGE_SIZE = 10;
      const page = PAGE_SIZE * (pageNumber - 1);

      const totalCount = await this.prisma.course.count();
      const totalPages = Math.ceil(totalCount / PAGE_SIZE);

      const materials = await this.prisma.$queryRaw<MaterialResponseDto[]>`
        SELECT c.name, c.description, c.image, c.startDate, c.endDate
        FROM Course c
        ORDER BY name ASC
        LIMIT ${PAGE_SIZE} OFFSET ${page}
      `;

      if (!materials || materials.length === 0) {
        throw new NotFoundException('No courses found.');
      }

      return { materials, totalPages };
    } catch (error) {
      console.error(error);
      throw new NotFoundException();
    }
  }

  async findOneMaterial(id: number) {
    const material = await this.prisma.material.findUnique({ where: { id } });

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

  async deleteMaterial(id: number): Promise<MaterialResponseDto> {
    try {
      const material = await this.prisma.material.findUnique({ where: { id } });

      if (!material) {
        throw new NotFoundException(`Material with ID ${id} not found`);
      }

      await this.prisma.material.delete({ where: { id } });

      return {
        name: this.encryptionService.decryptAES(material.name),
        description: this.encryptionService.decryptAES(material.description),
        filename: this.encryptionService.decryptAES(material.filename),
        link: this.encryptionService.decryptAES(material.link),
        type: material.type,
        createdBy: material.createdBy,
        updatedBy: material.updatedBy,
        idCourse: material.idCourse,
        file: null,
      };
    } catch (error) {
      console.error('Error deleting material:', error);
      throw new InternalServerErrorException(`Error deleting material: ${error.message}`);
    }
  }
}

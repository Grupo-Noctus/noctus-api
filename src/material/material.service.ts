import {
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MaterialRequestDto } from './dto/material-resquest.dto';
import { MaterialResponseDto } from './dto/material-response.dto';
import { MaterialPaginationResponseDto } from './dto/material-pagination-response.dto';

@Injectable()
export class MaterialService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createMaterial(
    materialResponse: MaterialRequestDto,
    user: {id: number},
    file: Express.Multer.File
  ): Promise<number> {
    console.log('user in controller:', user.id);
    try {
      const filePath = file ? file.filename : null;

      const {idCourse, ...material} = materialResponse
      const createdMaterial = await this.prisma.material.create({
        data: {
          course: { connect: { id: idCourse } },
          ...material,
          filename: file.filename,
          createdBy: user.id,
          updatedBy: user.id,
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
    try {
    const material = await this.prisma.material.findUnique({ where: { id } });

    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }
    return material;
    
    } catch (error) {
      console.error(error);
      throw new NotFoundException();
    }
  }

  async deleteMaterial(id: number): Promise<void> {
    try {
      const material = await this.prisma.material.findUnique({ where: { id } });

      if (!material) {
        throw new NotFoundException(`Material with ID ${id} not found`);
      }

      await this.prisma.material.delete({ where: { id } });
    } catch (error) {
      console.error('Error deleting material:', error);
      throw new InternalServerErrorException(`Error deleting material: ${error.message}`);
    }
  }
}

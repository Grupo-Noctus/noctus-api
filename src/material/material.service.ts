import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MaterialRequestDto } from './dto/material-resquest.dto';
import { MaterialPaginationResponseDto } from './dto/material-pagination-response.dto';
import { FindMaterialDto } from './dto/find-material-dto';
import path from 'path';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class MaterialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async createMaterial(
    materialResponse: MaterialRequestDto,
    user: {id: number},
    file: Express.Multer.File
  ): Promise<number> {

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
  }

  async findManyMaterial(query: FindMaterialDto): Promise<MaterialPaginationResponseDto> {
      const { idCourse } = query;

      const materials = await this.prisma.material.findMany({
        where: {
          ...(idCourse ? {idCourse} : {}),
        },
      });
      return { materials};
  }

  async findOneMaterial(id: number) {
    const material = await this.prisma.material.findUnique({ where: { id } });

    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }
    return material;
  }

  async deleteMaterial(id: number): Promise<void> {
      const material = await this.prisma.material.findUnique({ where: { id } });
      if (!material) {
        throw new NotFoundException(`Material with ID ${id} not found`);
      }

      const filePath = path.join(__dirname, '..', '..', 'uploads', 'materials', material.filename);
      
      await this.uploadService.deleteFile(filePath);
      await this.prisma.material.delete({ where: { id } });
      
  }
}

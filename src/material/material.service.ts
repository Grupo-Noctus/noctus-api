import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MaterialRequestDto } from './dto/material-resquest.dto';
import { FindMaterialDto } from './dto/find-material-dto';
import * as path from 'path';
import { UploadService } from 'src/upload/upload.service';
import { MaterialResponseDto } from './dto/material-response.dto';
import { Material } from '@prisma/client';

@Injectable()
export class MaterialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async createMaterial(
    materialResponse: MaterialRequestDto,
    user: number,
    file: Express.Multer.File,
  ): Promise<number> {
    const { idCourse, ...material } = materialResponse;
    const createdMaterial = await this.prisma.material.create({
      data: {
        course: { connect: { id: Number(idCourse) } },
        ...material,
        filename: file.filename,
        createdBy: user,
        updatedBy: user,
      },
    });
    return createdMaterial.id;
  }

  async findManyMaterial(param: FindMaterialDto): Promise<MaterialResponseDto[]> {
    const { idCourse } = param;

    const materials = await this.prisma.material.findMany({
      where: {
        ...(idCourse ? { idCourse } : {}),
      },
    });

    return materials;
  }

  async findOneMaterial(id: number): Promise<Material>;
  async findOneMaterial(
    id: number,
    withMetadata: true,
  ): Promise<{ material: Material; fileMetadata: string }>;
  async findOneMaterial(id: number, withMetadata?: boolean) {
    const material = await this.prisma.material.findUnique({ where: { id } });

    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }

    if (withMetadata) {
      const mockFile = { filename: material.filename } as Express.Multer.File;
      const fileMetadata = await this.uploadService.uploadFileMetadata(
        mockFile,
        'uploads/materials',
      );
      return { material, fileMetadata };
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

import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialDto } from './dto/create-material.dto';

@Injectable()
export class MaterialService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMaterialDto: CreateMaterialDto) {
    try {
      return await this.prisma.material.create({
        data: {
          name: createMaterialDto.name,
          description: createMaterialDto.description,
          filename: createMaterialDto.filename,
          type: createMaterialDto.type,
          link: createMaterialDto.link,
          createdBy: createMaterialDto.createdBy,
          updatedBy: createMaterialDto.createdBy,
          course: {
            connect: { id: createMaterialDto.idCourse },
          },
        },
      });
    } catch (error) {
      throw new Error(`Error creating material: ${error.message}`);
    }
  }
  
  async findAll(title?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
  
    return this.prisma.material.findMany({
      where: title
        ? { name: { contains: title, mode: 'insensitive' } as any }
        : {},
      take: limit,
      skip: skip,
      orderBy: { createdAt: 'desc' },
    });
  }
  

  async findOne(id: number) {
    const material = await this.prisma.material.findUnique({
      where: { id },
    });

    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }

    return material;
  }

  async remove(id: number) {
    try {
      return await this.prisma.material.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { EncryptionService } from '../encryption/encryption.service';

@Injectable()
export class MaterialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryptionService: EncryptionService
  ) {}

  async create(createMaterialDto: CreateMaterialDto) {
    try {
      return await this.prisma.material.create({
        data: {
          name: this.encryptionService.encryptAES(createMaterialDto.name),
          description: this.encryptionService.encryptAES(createMaterialDto.description),
          filename: this.encryptionService.encryptAES(createMaterialDto.filename),
          type: createMaterialDto.type,
          link: this.encryptionService.encryptAES(createMaterialDto.link),
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
  
    // Buscar materiais criptografados
    const materials = await this.prisma.material.findMany({
      where: title
        ? { name: { contains: this.encryptionService.encryptAES(title) } }
        : {},
      take: limit,
      skip: skip,
      orderBy: { createdAt: 'desc' },
    });
  
    // Descriptografar os materiais antes de retornar
    return materials.map((material) => ({
      ...material,
      name: this.encryptionService.decryptAES(material.name),
      description: this.encryptionService.decryptAES(material.description),
      filename: this.encryptionService.decryptAES(material.filename),
      link: this.encryptionService.decryptAES(material.link),
    }));
  }

  async findOne(id: number) {
    const material = await this.prisma.material.findUnique({
      where: { id },
    });

    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }

    // Descriptografar os dados antes de retornar
    return {
      ...material,
      name: this.encryptionService.decryptAES(material.name),
      description: this.encryptionService.decryptAES(material.description),
      filename: this.encryptionService.decryptAES(material.filename),
      link: this.encryptionService.decryptAES(material.link),
    };
  }

  async update(id: number, updateMaterialDto: UpdateMaterialDto) {
    try {
      return await this.prisma.material.update({
        where: { id },
        data: {
          name: this.encryptionService.encryptAES(updateMaterialDto.name),
          description: this.encryptionService.encryptAES(updateMaterialDto.description),
          filename: this.encryptionService.encryptAES(updateMaterialDto.filename),
          link: this.encryptionService.encryptAES(updateMaterialDto.link),
          updatedBy: updateMaterialDto.updatedBy,
        },
      });
    } catch (error) {
      throw new Error(`Error updating material: ${error.message}`);
    }
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

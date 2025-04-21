import { BadRequestException, Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ModuleRequstDto } from './dto/module-request.dto';
import { ModuleUpdateDto } from './dto/module-update.dto';
import { ModuleResponseDto } from './dto/module-response.dto';
import { handlePrismaError } from 'src/utils/handle-prisma.error';
import { handleHttpError } from 'src/utils/handle-http.error';

@Injectable()
export class ModuleService {
  private readonly logger = new Logger(ModuleService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createModule(idCourse: number, moduleRequest: ModuleRequstDto, user: number): Promise<boolean> {
    try {
      const lastModule = await this.prisma.module.findFirst({
        where: { idCourse },
        orderBy: { order: 'desc' },
      });

      const newOrder = lastModule ? lastModule.order + 1 : 1;

      await this.prisma.module.create({
        data: {
          course: { connect: { id: idCourse } },
          ...moduleRequest,
          order: newOrder,
          createdBy: user,
          updatedBy: user,
        },
      });
      return true;
    } catch (error) {
      this.logger.error('Error while creating module', error);
      handlePrismaError(error);
      handleHttpError(error);
    }
  }

  async updateModule(idModule: number, moduleUpdate: ModuleUpdateDto, user: number): Promise<boolean> {
    try {
      await this.prisma.module.update({
        where: { id: idModule },
        data: {
          ...moduleUpdate,
          updatedBy: user,
        },
      });
      return true;
    } catch (error) {
      this.logger.error('Error while updating module', error);
      handlePrismaError(error);
      handleHttpError(error);
    }
  }

  async findOneModule(idModule: number): Promise<ModuleResponseDto> {
    try {
      const module = await this.prisma.module.findUnique({
        where: { id: idModule },
        select: {
          id: true,
          name: true,
          description: true,
          order: true,
        },
      });

      if (!module) {
        throw new NotFoundException('Module not found');
      }

      return module;
    } catch (error) {
      this.logger.error('Error while fetching module', error);
      handlePrismaError(error);
      handleHttpError(error);
    }
  }

  async deleteModule(idModule: number): Promise<void> {
    try {
      await this.prisma.module.delete({
        where: { id: idModule },
      });
    } catch (error) {
      this.logger.error('Error while deleting module', error);
      handlePrismaError(error);
      handleHttpError(error);
    }
  }

  async findManyModule(idCourse: number): Promise<ModuleResponseDto[] | []> {
    try {
      const modules = await this.prisma.module.findMany({
        where: { idCourse },
        select: {
          id: true,
          name: true,
          description: true,
          order: true,
        },
      });

      return modules;
    } catch (error) {
      this.logger.error('Error while fetching modules for course', error);
      handlePrismaError(error);
      handleHttpError(error);
    }
  }
}

import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ModuleRequstDto } from './dto/request/module-request.dto';
import { ModuleUpdateDto } from './dto/update/module-update.dto';
import { ModuleResponseDto } from './dto/response/module-response.dto';
import { handleAppError } from 'src/utils/handle-app-error.error';
import { ModuleWithVideosResponseDto } from './dto/response/module-and-video-response.dto';
import { Role } from '@prisma/client';
import { IModuleService } from './interface/module.interface';
import { IStreamingService } from 'src/streaming/interface/streaming.intercafe';

@Injectable()
export class ModuleService implements IModuleService {
  private readonly logger = new Logger(ModuleService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject('IStreamingService')
    private readonly streamingService: IStreamingService,
  ) {}

  async createModule(
    idCourse: number,
    moduleRequest: ModuleRequstDto,
    user: number,
  ): Promise<boolean> {
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
      throw handleAppError(error);
    }
  }

  async updateModule(
    idModule: number,
    moduleUpdate: ModuleUpdateDto,
    user: number,
  ): Promise<boolean> {
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
      throw handleAppError(error);
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
      throw handleAppError(error);
    }
  }

  async deleteModule(idModule: number): Promise<void> {
    try {
      await this.prisma.module.delete({
        where: { id: idModule },
      });
    } catch (error) {
      this.logger.error('Error while deleting module', error);
      throw handleAppError(error);
    }
  }

  async findModulesWithVideos(
    idCourse: number,
    idEnrollment: number,
    user: number,
    role: Role,
  ): Promise<ModuleWithVideosResponseDto[]> {
    try {
      const modules = await this.prisma.module.findMany({
        where: { idCourse },
        orderBy: { order: 'asc' },
      });

      const result: ModuleWithVideosResponseDto[] = [];

      for (const module of modules) {
        const videos = await this.streamingService.findManyVideos(
          idEnrollment,
          module.id,
          user,
          role,
        );

        result.push({
          id: module.id,
          name: module.name,
          description: module.description,
          order: module.order,
          videos: videos.map(video => ({
            id: video.id,
            name: video.name,
            description: video.description,
            duration: video.duration,
            idProgressVideo: (video as any).idProgressVideo ?? null,
            viewed: (video as any).viewed ?? null,
          })),
        });
      }

      return result;
    } catch (error) {
      this.logger.error('Error while fetching modules and videos', error);
      throw handleAppError(error);
    }
  }

  async getModulesOfCourse(idCourse: number): Promise<number[] | null> {
    try {
      const modules = await this.prisma.module.findMany({
        where: { idCourse },
        select: { id: true },
      });

      return modules.map(module => module.id);
    } catch (error) {
      this.logger.error('Error while fetching modules for course', error);
      throw handleAppError(error);
    }
  }
}

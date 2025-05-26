import { ModuleRequstDto } from '../dto/request/module-request.dto';
import { ModuleUpdateDto } from '../dto/update/module-update.dto';
import { ModuleResponseDto } from '../dto/response/module-response.dto';
import { ModuleWithVideosResponseDto } from '../dto/response/module-and-video-response.dto';
import { Role } from '@prisma/client';

export abstract class IModuleService {
  abstract createModule(
    idCourse: number,
    moduleRequest: ModuleRequstDto,
    user: number,
  ): Promise<boolean>;

  abstract updateModule(
    idModule: number,
    moduleUpdate: ModuleUpdateDto,
    user: number,
  ): Promise<boolean>;

  abstract findOneModule(idModule: number): Promise<ModuleResponseDto>;

  abstract deleteModule(idModule: number): Promise<void>;

  abstract findModulesWithVideos(
    idCourse: number,
    idEnrollment: number | null,
    user: number,
    role: Role,
  ): Promise<ModuleWithVideosResponseDto[]>;

  abstract getModulesOfCourse(idCourse: number): Promise<number[] | null>;
}

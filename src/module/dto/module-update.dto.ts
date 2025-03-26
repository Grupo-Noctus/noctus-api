import { PartialType } from '@nestjs/mapped-types';
import { ModuleRequstDto } from './module-request.dto';

export class ModuleUpdateDto extends PartialType(ModuleRequstDto) {}
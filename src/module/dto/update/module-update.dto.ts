import { PartialType } from '@nestjs/mapped-types';
import { ModuleRequstDto } from '../request/module-request.dto';

export class ModuleUpdateDto extends PartialType(ModuleRequstDto) {}

import { forwardRef, Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { StreamingModule } from 'src/streaming/streaming.module';

@Module({
  controllers: [ModuleController],
  providers: [ModuleService],
  imports: [forwardRef(() => StreamingModule)],
  exports: [ModuleService],
})
export class ModuleModule {}

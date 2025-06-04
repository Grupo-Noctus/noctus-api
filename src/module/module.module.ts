import { Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { StreamingModule } from 'src/streaming/streaming.module';

@Module({
  controllers: [ModuleController],
  providers: [
    {
      provide: 'IModuleService',
      useClass: ModuleService,
    },
  ],
  imports: [StreamingModule],
  exports: ['IModuleService'],
})
export class ModuleModule {}

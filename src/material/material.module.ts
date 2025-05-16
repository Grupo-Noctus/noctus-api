import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { UploadService } from 'src/upload/upload.service';

@Module({
  controllers: [MaterialController],
  providers: [MaterialService, UploadService],
  exports: [UploadService],
})
export class MaterialModule {}

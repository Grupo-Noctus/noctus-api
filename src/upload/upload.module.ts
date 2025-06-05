import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  providers: [
    UploadService,
    {
      provide: 'IUploadService',
      useClass: UploadService,
    },
  ],
  exports: [MulterModule, 'IUploadService'],
})
export class UploadModule {}

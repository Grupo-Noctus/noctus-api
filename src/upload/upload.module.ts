import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { IUploadService } from './interface/upload.interface';
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
      provide: IUploadService,
      useClass: UploadService,
    },
  ],
  exports: [MulterModule, IUploadService, UploadService],
})
export class UploadModule {}

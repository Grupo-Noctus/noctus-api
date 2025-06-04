import { Module } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { StreamingController } from './streaming.controller';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [StreamingController],
  providers: [
    {
      provide: 'IStreamingService',
      useClass: StreamingService,
    },
  ],
  exports: ['IStreamingService'],
})
export class StreamingModule {}

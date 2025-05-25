import { Module } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { StreamingController } from './streaming.controller';
import { UploadModule } from 'src/upload/upload.module';
import { StreamingProgressService } from './streaming-progress.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UploadModule, UserModule],
  controllers: [StreamingController],
  providers: [StreamingService, StreamingProgressService],
  exports: [StreamingService],
})
export class StreamingModule {}

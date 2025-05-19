import { Module } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { StreamingController } from './streaming.controller';
import { UploadModule } from 'src/upload/upload.module';
import { EnrollmentModule } from 'src/enrollment/enrollment.module';
import { StreamingProgressService } from './straming-progress.service';

@Module({
  imports: [UploadModule, EnrollmentModule],
  controllers: [StreamingController],
  providers: [
    StreamingService,
    StreamingProgressService,
  ],
  exports: [StreamingService]
})
export class StreamingModule {}

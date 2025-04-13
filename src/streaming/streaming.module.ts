import { Module } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { StreamingController } from './streaming.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule.register({
    dest: "./uploads/lectures"
  })],
  controllers: [StreamingController],
  providers: [StreamingService],
})
export class StreamingModule {}

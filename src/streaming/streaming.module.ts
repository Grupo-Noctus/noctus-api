import { Module } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { StreamingController } from './streaming.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { generateUniqueKey } from 'src/utils/genarate-unique-key';

@Module({
  imports: [MulterModule.register({
    storage: diskStorage({
        destination: '.uploads/lectures',
        filename: (req, file, callback) => {
          const uniqueKey = generateUniqueKey(file.originalname, file.mimetype);
          callback(null, uniqueKey);
        },
      }),
  })],
  controllers: [StreamingController],
  providers: [StreamingService],
})
export class StreamingModule {}

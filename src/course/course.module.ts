import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { generateUniqueKey } from 'src/utils/genarate-unique-key';
import * as path from 'path';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { EnrollmentModule } from 'src/enrollment/enrollment.module';

@Module({
  controllers: [CourseController],
  providers: [CourseService],
  imports:[
    EnrollmentModule,
    MulterModule.register({
      storage: diskStorage({
        destination: path.join(process.cwd(), 'uploads', 'images-courses'),
        filename: (req, file, callback) => {
          const uniqueKey = generateUniqueKey(file.originalname, file.mimetype);
          callback(null, uniqueKey);
        },
      }),
    })   
  ]
})
export class CourseModule {}

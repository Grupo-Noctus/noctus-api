import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { EnrollmentModule } from 'src/enrollment/enrollment.module';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  controllers: [CourseController],
  providers: [CourseService],
  imports:[
    EnrollmentModule,
    UploadModule,  
  ]
})
export class CourseModule {}

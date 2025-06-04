import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { EnrollmentModule } from 'src/enrollment/enrollment.module';
import { UploadModule } from 'src/upload/upload.module';
import { CourseAdminController } from './course-admin.controller';
import { ModuleModule } from 'src/module/module.module';

@Module({
  controllers: [CourseController, CourseAdminController],
  providers: [
    {
      provide: 'ICourseService',
      useClass: CourseService,
    },
  ],
  imports: [EnrollmentModule, ModuleModule, UploadModule],
})
export class CourseModule {}

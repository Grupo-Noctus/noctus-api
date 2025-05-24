import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { EnrolledCourseService } from './enrolled-course.service';
import { UserModule } from 'src/user/user.module';
import { EnrroledCourseController } from './enrolled-course.controller';

@Module({
  controllers: [
    EnrollmentController,
    EnrroledCourseController
  ],
  providers: [
    {
      provide: 'IEnrollmentService',
      useClass: EnrollmentService
    },
    {
      provide: 'IEnrolledCourseService',
      useClass: EnrolledCourseService
    },
  ],
  exports:[
    'IEnrolledCourseService',
    'IEnrollmentService'
  ],
  imports: [UserModule],
})
export class EnrollmentModule {}

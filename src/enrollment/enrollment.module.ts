import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { GetEnrolledCourseInfoService } from './get-enrolled-course-info.service';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [EnrollmentController],
  providers: [
    EnrollmentService,
    GetEnrolledCourseInfoService,
  ],
  exports:[GetEnrolledCourseInfoService],
  imports: [UserModule],
})
export class EnrollmentModule {}

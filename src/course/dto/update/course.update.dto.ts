import { PartialType } from '@nestjs/mapped-types';
import { CourseRequestDto } from '../request/course.request.dto';

export class CourseUpdateDto extends PartialType(CourseRequestDto) {}


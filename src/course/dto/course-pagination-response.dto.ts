import { ApiProperty } from '@nestjs/swagger';
import { CourseResponseDto } from './course-response.dto';

export class CoursePaginationResponseDto {
  @ApiProperty({
    description: 'List of courses in the current page.',
    type: [CourseResponseDto],
  })
  courses: CourseResponseDto[];

  @ApiProperty({
    description: 'Total number of pages based on the current page size.',
    example: 5,
  })
  totalPages: number;
}

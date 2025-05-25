import { ApiProperty } from '@nestjs/swagger';
import { ModuleWithVideosResponseDto } from 'src/module/dto/module-and-video-response.dto';

export class EnrolledCourseDto {
  @ApiProperty({ example: 12, description: 'Enrollment ID' })
  idEnrrolment: number;

  @ApiProperty({ example: false, description: 'Indicates whether the course has been completed' })
  completed: boolean;

  @ApiProperty({ example: '2025-12-31T23:59:59.000Z', description: 'Expiration date of course access' })
  expiresAt: Date;

  @ApiProperty({ example: 5, description: 'Course ID' })
  idCourse: number;

  @ApiProperty({ example: 'Introduction to Web Development', description: 'Course name' })
  nameCourse: string;

  @ApiProperty({ example: 'A complete beginner-friendly course to learn web development', description: 'Course description' })
  courseDescription: string;

  @ApiProperty({ example: 'https://example.com/course-image.jpg', description: 'URL of the course cover image' })
  imageCourse: string;

  @ApiProperty({
    type: [ModuleWithVideosResponseDto],
    description: 'List of course modules including their videos'
  })
  modules: ModuleWithVideosResponseDto[];
}

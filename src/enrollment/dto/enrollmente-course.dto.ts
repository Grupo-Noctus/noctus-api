import { ApiProperty } from '@nestjs/swagger';

export class EnrolledCourseDto {
  @ApiProperty({ example: 1 })
  enrollmentId: number;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({ example: false })
  completed: boolean;

  @ApiProperty({ example: '2024-01-10T00:00:00.000Z' })
  enrollmentExpiresAt: Date;

  @ApiProperty({ example: 3 })
  courseId: number;

  @ApiProperty({ example: 'Curso de Astrologia' })
  courseName: string;

  @ApiProperty({ example: 'Descubra os mistérios do zodíaco' })
  courseDescription: string;

  @ApiProperty({ example: 'https://cdn.example.com/image.jpg' })
  courseImage: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  expiresAt: Date;
}

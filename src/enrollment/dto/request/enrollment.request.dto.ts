import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class EnrollmentRequestDto {
  
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: 'Student\s ID',
    example: 123,
    type: Number,
  })
  idStudent: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: 'Course\s ID',
    example: 1,
    type: Number,
  })
  idCourse: number;
}

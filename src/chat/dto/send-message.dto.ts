import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString } from 'class-validator';

export class SendMessageDto {
  @IsInt()
  @ApiProperty({ description: 'Course ID', example: 123, type: Number })
  courseId: number;

  @IsInt()
  @ApiProperty({ description: 'User ID', example: 456, type: Number })
  userId: number;

  @IsString()
  @ApiProperty({ description: 'Name of the user', example: 'John Doe', type: String })
  userName: string;

  @IsString()
  @ApiProperty({
    description: 'message to be send',
    example: 'How can I solve this problem?',
    type: String,
  })
  message: string;

  @IsBoolean()
  @ApiProperty({ example: true, type: Boolean })
  admin: boolean;
}

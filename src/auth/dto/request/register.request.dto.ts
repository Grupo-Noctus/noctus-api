import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({ type: 'string', description: 'JSON stringified UserRegisterDto' })
  @IsString({ message: 'The user field must be a JSON string.' })
  @IsNotEmpty({ message: 'The user field cannot be empty.' })
  user: string;

  @ApiProperty({
    type: 'string',
    description: 'JSON stringified StudentRegisterDto',
    required: false,
  })
  @IsString({ message: 'The student field must be a JSON string.' })
  @IsOptional()
  student?: string;
}

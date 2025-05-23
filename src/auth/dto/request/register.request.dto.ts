import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequestDto {
  @ApiProperty({ type: 'string', description: 'JSON stringified UserRegisterDto' })
  user: string;

  @ApiProperty({ type: 'string', description: 'JSON stringified StudentRegisterDto', required: false })
  student: string;
}

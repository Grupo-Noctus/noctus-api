import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token for authenticated requests',
  })
  access_token: string;

  @ApiProperty({
    description: 'Payload information extracted from the JWT',
    example: {
      sub: 1,
      name: 'John Doe',
      username: 'john_doe',
      image: 'images-users/john-doe-uuid.jpeg',
      role: 'student',
      active: true,
    },
  })
  payload: {
    sub: number;
    name: string;
    username: string;
    image: string;
    role: Role;
    active: boolean;
  };
}

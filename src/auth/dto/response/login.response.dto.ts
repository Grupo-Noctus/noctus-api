import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty({
    example: {
      sub: 1,
      name: 'John Doe',
      username: 'johndoe',
      image: 'images-users/jonhjpg-5fdb9912-c1c8-44ec-bb83-64ded774053e.jpeg',
      role: 'student',
      active: true,
    },
  })
  payload: {
    sub: number;
    name: string;
    username: string;
    image: string;
    role: string;
    active: boolean;
  };
}

import { Type } from 'class-transformer';
import { ValidateNested, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRegisterDto } from './user-register.dto';
import { StudentRegisterDto } from './student-register.dto';

export class RegisterDto {
  @ApiProperty({ type: () => UserRegisterDto })
  @ValidateNested()
  @Type(() => UserRegisterDto)
  user: UserRegisterDto;

  @ApiPropertyOptional({ type: () => StudentRegisterDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => StudentRegisterDto)
  student?: StudentRegisterDto;
}

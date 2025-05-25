import { ApiProperty } from '@nestjs/swagger';
import { EnrollmentRequestDto } from '../request/enrollment.request.dto';
import { PartialType } from '@nestjs/mapped-types';

export class EnrollmentUpdateDto extends PartialType(EnrollmentRequestDto) {
  @ApiProperty({ description: 'Expiration date of the enrollment as a Unix timestamp' })
  expiresAt?: Date;
}

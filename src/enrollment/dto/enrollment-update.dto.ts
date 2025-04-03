import { ApiProperty } from '@nestjs/swagger';
import { EnrollmentRequestDto } from './enrollment-request.dto';
import { PartialType } from '@nestjs/mapped-types';

export class EnrollmentUpdateDto extends PartialType(EnrollmentRequestDto) {

}

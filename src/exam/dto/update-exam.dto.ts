import { PartialType } from '@nestjs/mapped-types';
import { ExamRequestDto } from './exam-request.dto';

export class UpdateExamDto extends PartialType(ExamRequestDto) {}

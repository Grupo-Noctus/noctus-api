import { PartialType } from '@nestjs/swagger';
import { QuestionRequestDto } from './question-request.dto';

export class UpdateQuestionDto extends PartialType(QuestionRequestDto) {}

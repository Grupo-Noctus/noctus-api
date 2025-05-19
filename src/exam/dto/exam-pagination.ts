import { ApiProperty } from "@nestjs/swagger";
import { ExamResponseDto } from "./exam-response.dto";

export class QuestionPaginationResponseDto {
    @ApiProperty({
        description: 'List of questions in the current page.',
        type: [ExamResponseDto],
    })
    questions: ExamResponseDto[];

    @ApiProperty({
        description: 'Total number of pages based on the current page size.',
        example: 5,
    })
    totalPages: number;
}
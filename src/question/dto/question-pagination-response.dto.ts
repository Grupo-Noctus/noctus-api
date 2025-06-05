import { ApiProperty } from "@nestjs/swagger";
import { QuestionResponseDto } from "./question-response.dto";

export class QuestionPaginationResponseDto {
    @ApiProperty({
        description: 'List of questions in the current page.',
        type: [QuestionResponseDto],
    })
    questions: QuestionResponseDto[];

    @ApiProperty({
        description: 'Total number of pages based on the current page size.',
        example: 5,
    })
    totalPages: number;
}
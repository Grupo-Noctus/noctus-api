import { ApiProperty } from "@nestjs/swagger";
import { EnrollmentResponseDto } from "./enrollment-response.dto";

export class EnrollmentPaginationResponseDto{
    @ApiProperty({
        description: 'List of enrollments in the current page.',
        type: [EnrollmentResponseDto],
    })
    enrollments: EnrollmentResponseDto[];

    @ApiProperty({
        description: 'Total number of pages.',
        example: 5,
    })
    totalPages: number;

}
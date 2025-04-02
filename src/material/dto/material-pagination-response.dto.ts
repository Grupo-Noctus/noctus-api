import { ApiProperty } from '@nestjs/swagger';
import { MaterialResponseDto } from './material-response.dto';

export class MaterialPaginationResponseDto {
    @ApiProperty({
        description: 'List of materials in the current page.',
        type: [MaterialResponseDto],
    })
    materials: MaterialResponseDto[];

    @ApiProperty({
        description: 'Total number of pages based on the current page size.',
        example: 5,
    })
    totalPages: number;
}
import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
    
    name?: string;

    @IsOptional()
    materials?: {
        connect?: { id: number }[];
        disconnect?: { id: number }[];
        update?: { where: { id: number }; data: Partial<CreateCourseDto> }[];
    };
}


import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateCourseDto {
    
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    image: string;

    @IsNotEmpty()
    @IsNumber()
    duration: number;

    @IsNotEmpty()
    certificateModel: string;

    @IsNotEmpty()
    @IsDate()
    createdAt: Date;
    
    @IsNotEmpty()
    @IsNumber()
    createdBy: number;

    @IsOptional()
    @IsDate()
    updatedAt: Date;

    @IsOptional()
    @IsNumber()
    updatedBy: number;
}

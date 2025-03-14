import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDate, Matches } from 'class-validator';

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
    /*@Matches(/^data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+$/, {
        message: 'imagem valida em base64...' */
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

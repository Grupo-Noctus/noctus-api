import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsString } from "class-validator";

export class QuestionOptionDto{

    @IsInt()
    id: number;

    @ApiProperty({ example: 'Option A' })
    @IsString()
    optionText: string;

    @ApiProperty({ example: true })
    @IsBoolean()
    correct: boolean;

}
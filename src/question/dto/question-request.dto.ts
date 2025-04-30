import { QuestionOptions, TypeQuestion } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Min, ValidateNested } from "class-validator";
import { QuestionOptionDto } from "./question-option.dto";

export class QuestionRequestDto {

    @IsInt()
    @IsOptional()
    @IsNotEmpty()
    id?: number;

    @IsInt()
    @IsOptional()
    @IsNotEmpty()
    idModule?: number;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    questionText: string;

    @IsEnum(TypeQuestion)
    @IsOptional()
    type?: TypeQuestion;

    @IsInt()
    @IsOptional()
    @Min(1)
    order?: number;

    @Type(() => Date)
    @IsDateString()
    @IsOptional()
    createdAt?: Date;

    @IsInt()
    @IsOptional()
    createdBy?: number;

    @Type(() => Date)
    @IsDateString()
    @IsOptional()
    updatedAt?: Date;

    @IsInt()
    @IsOptional()
    updatedBy?: number;

    options: QuestionOptionDto[]

  }


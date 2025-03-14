import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDate, Matches } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}


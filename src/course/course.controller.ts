import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CourseService } from './course.service';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCourseDto } from './dto/create-course.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
  
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create( createCourseDto );
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.courseService.findOneCourse( id );
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.updateCourse({
      where: { id: Number(id) },
      data: updateCourseDto,
    });
  }
}


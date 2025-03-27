import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CourseService } from './course.service';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { Roles } from 'src/auth/decorator/role.decorator';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
  
  @Post('create')
  @Roles('ADMIN')
  createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.createCourse( createCourseDto );
  }

  @Get('get/:id')
  @Roles('ADMIN')
  findOneCourse(@Param('id') id: number) {
    return this.courseService.findOneCourse( id );
  }

  @Put('update/:id')
  @Roles('ADMIN')
  updateCourse(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.updateCourse({
      where: { id: Number(id) },
      data: updateCourseDto,
    });
  }
  
  @Delete('delete/:id')
  @Roles('ADMIN')
  deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourse({ id: Number(id) });
  }
}


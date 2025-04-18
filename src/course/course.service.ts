import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourseRequestDto } from './dto/course-request.dto';
import { CourseUpdateDto } from './dto/course-update.dto';
import { CourseResponseDto } from './dto/course-response.dto';
import { CoursePaginationResponseDto } from './dto/course-pagination-response.dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async createCourse(courseResponse: CourseRequestDto, user: {id: number}): Promise<boolean> {
    try {
      await this.prisma.course.create({
        data: {
          ...courseResponse,
          createdBy: user.id,
          updatedBy: user.id,
        }
      }); 
      return true;
    } catch (error) {
      console.error(error);
      throw new BadRequestException();
    }
  }

  async updateCourse(idCourse: number, updateCourse: CourseUpdateDto, user: number): Promise<boolean> {
    try {
      await this.prisma.course.update({
        where: { id: idCourse},
        data: {
          ...updateCourse,
          updatedBy:user
        },
      });
      return true;
    } catch (error) {
      console.error(error);
      throw new BadRequestException();
    }
  }
  

  async deleteCourse(idCourse: number): Promise<void> {
    try {
      await this.prisma.course.delete({
        where: {id: idCourse}
      });
    } catch (error) {
      console.error(error);
      throw new NotFoundException();
    }
  }

  async findOneCourse(idCourse: number): Promise<CourseResponseDto> {
    try{
      return await this.prisma.course.findUnique({
        where: {id: idCourse},
        select: {
          name: true,
          description: true,
          image: true,
          startDate: true,
          endDate: true,
        }
      });
    } catch (error) {
      console.error(error);
      throw new NotFoundException();
    }
  }

  async findManyCourse( limit: number,pageNumber: number): Promise<CoursePaginationResponseDto>{
    try{
      const page = (limit * (pageNumber - 1)); 

      const totalCount = await this.prisma.course.count();
      const totalPages = Math.ceil(totalCount / limit);

      const courses = await this.prisma.$queryRaw<
        CourseResponseDto[]
      >`
        SELECT c.name, c.description, c.image, c.startDate, c.endDate
        FROM Course c
        ORDER BY name ASC
        LIMIT ${limit} OFFSET ${page}
      `;
      if(!courses || courses.length === 0){
        throw new NotFoundException('No courses found.');
      }
      return {courses, totalPages};
    }catch (error){
      console.error (error);
      throw new NotFoundException();
    }
  }
}

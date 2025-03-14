import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Course, Prisma } from '@prisma/client';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create( data: Prisma.CourseCreateInput): Promise<Course> {
    return this.prisma.course.create({ data });
  }

  async updateCourse(params: {
    where: Prisma.CourseWhereUniqueInput;
    data: Prisma.CourseUpdateInput;
  }): Promise<Course> {
    const { where, data } = params;
  
    return this.prisma.course.update({
      where,
      data,
    });
  }
  

  async deleteCourse(where: Prisma.CourseWhereUniqueInput): Promise<Course> {
    try {
      return await this.prisma.course.delete({ where });
    } catch (error) {
      throw new Error(`Curso não encontrado com ID: ${where.id}`);
    }
  }

  async findOneCourse(id: number): Promise<Course> {
  const course = await this.prisma.course.findUnique({ where: { id } });
  if (!course) {
    throw new Error(`Curso com ID ${id} não encontrado`);
  }
  return course;
  }

}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Course, Prisma } from '@prisma/client';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async createCourse( data: Prisma.CourseCreateInput): Promise<Course> {
    try {
    return this.prisma.course.create({ data }); 
    } catch(error) {
      throw new Error(`Error in create for course: ${error.message}`);
    }
  }

  async updateCourse(params: {
    where: Prisma.CourseWhereUniqueInput;
    data: Prisma.CourseUpdateInput;
  }): Promise<Course> {
    const { where, data } = params;
    try {
    return this.prisma.course.update({
      where,
      data,
    });
    } catch (error) {
      throw new Error(`Error in searching/update for course: ${error.message}`);
    }
  }
  

  async deleteCourse(where: Prisma.CourseWhereUniqueInput): Promise<Course> {
    try {
      return await this.prisma.course.delete({ where });
    } catch (error) {
      throw new Error(`Error in searching/delete for course: ${error.message}`);
    }
  }

  async findOneCourse(id: number): Promise<Course> {
  const course = await this.prisma.course.findUnique({ where: { id: Number(id) }, include: {materials: true  },});
  if (!course) {
    throw new Error(`Error in searching the Course by Id: ${id}`);
  }
  return course;
  }

}

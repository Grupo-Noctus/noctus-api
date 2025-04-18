import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourseRequestDto } from './dto/course-request.dto';
import { CourseUpdateDto } from './dto/course-update.dto';
import { CourseResponseDto } from './dto/course-response.dto';
import { CoursePaginationResponseDto } from './dto/course-pagination-response.dto';
import { generateUniqueKey } from 'src/utils/genarate-unique-key';
import { EnrollmentService } from 'src/enrollment/enrollment.service';

@Injectable()
export class CourseService {
  constructor(
    private prisma: PrismaService,
    private enrollmentService: EnrollmentService
  ) {}

  async createCourse(courseResponse: CourseRequestDto, user: number, image: Express.Multer.File): Promise<boolean> {
    try {
      if (image){
        var { filename, mimetype, size, path } = image;    
        //if (size > que alguma coisa){otimiza}
        var uniqueKey = generateUniqueKey(filename, mimetype);
        var pathS3 = uniqueKey; //adicionar url gerada após salvar na s3
      } else {
        pathS3 = null;
      }
      await this.prisma.course.create({
        data: {
          ...courseResponse,
          image: path,
          createdBy: user,
          updatedBy: user
        }
      }); 
      return true;
    } catch (error) {
      console.error(error);
      throw new BadRequestException();
    }
  }

  async updateCourse(idCourse: number, updateCourse: CourseUpdateDto, user: number, image: Express.Multer.File): Promise<boolean> {
    try {
      if (image) {
        const { filename, mimetype, size, path } = image;
        const imageUrl = `/uploads/images-courses/${filename}`
        updateCourse.image = imageUrl;
      }
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
          id: true,
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

  async findManyCoursePagination(pageNumber: number): Promise<CoursePaginationResponseDto>{
    try{
      const PAGE_SIZE = 10;
      const page = (PAGE_SIZE * (pageNumber - 1));

      const totalCount = await this.prisma.course.count(); 
      const totalPages = Math.ceil(totalCount / PAGE_SIZE);

      const courses = await this.prisma.$queryRaw<
        CourseResponseDto[]
      >`
        SELECT c.name, c.description, c.image, c.startDate, c.endDate
        FROM Course c
        ORDER BY name ASC
        LIMIT ${PAGE_SIZE} OFFSET ${page}
      `;
      return {courses, totalPages};
    }catch (error){
      console.error (error);
      throw new NotFoundException();
    }
  }

  async findManyCourse (user: number): Promise<CourseResponseDto[]> {
    try {
      const enrolledCourses = await this.enrollmentService.findCoursePerEnrollment(user);

      const enrolledCoursesIds = enrolledCourses.map((courses) => courses.courseId)
      return await this.prisma.course.findMany({
        where: {
          id: {notIn: enrolledCoursesIds}
        },
        select: {
          id:true,
          name: true,
          description: true,
          image: true,
          startDate: true,
          endDate: true,
        }
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}

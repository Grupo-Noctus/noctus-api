import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from '../course.controller';
import { ICourseService } from '../interface/course.service.interface';
import { Role } from '@prisma/client';
import { coursePreviewDto } from '../dto/response/course-preview.response';
import { CourseResponseDto } from '../dto/response/course.response.dto';
import { CoursePaginationResponseDto } from '../dto/response/course-pagination.response.dto';

describe('CourseController', () => {
  let controller: CourseController;
  let courseService: jest.Mocked<ICourseService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        {
          provide: 'ICourseService',
          useValue: {
            findManyCourse: jest.fn(),
            findManyCoursePagination: jest.fn(),
            findOneCoursePreview: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CourseController>(CourseController);
    courseService = module.get('ICourseService');
  });

  describe('findManyCourse', () => {
    it('should return array of courses', async () => {
      const userId = 1;
      const courses: CourseResponseDto[] = [
        {
          id: 1,
          name: 'Test Course',
          description: 'Desc',
          image: 'http://img.com',
          duration: 10,
        },
      ];
      courseService.findManyCourse.mockResolvedValue(courses);

      const result = await controller.findManyCourse(userId);
      expect(courseService.findManyCourse).toHaveBeenCalledWith(userId);
      expect(result).toEqual(courses);
    });
  });

  describe('findManyCoursePagination', () => {
    it('should return paginated courses', async () => {
      const userId = 1;
      const page = 2;
      const limit = 5;
      const paginatedResult: CoursePaginationResponseDto = {
        courses: [
          {
            id: 2,
            name: 'Another Course',
            description: 'Desc2',
            image: 'http://img2.com',
            duration: 20,
          },
        ],
        totalPages: 3,
      };

      courseService.findManyCoursePagination.mockResolvedValue(paginatedResult);

      const result = await controller.findManyCoursePagination(userId, page, limit);
      expect(courseService.findManyCoursePagination).toHaveBeenCalledWith(userId, limit, page);
      expect(result).toEqual(paginatedResult);
    });

    it('should use default pagination params', async () => {
      const userId = 1;
      const defaultPage = 1;
      const defaultLimit = 10;
      const paginatedResult: CoursePaginationResponseDto = {
        courses: [],
        totalPages: 0,
      };

      courseService.findManyCoursePagination.mockResolvedValue(paginatedResult);

      const result = await controller.findManyCoursePagination(userId);
      expect(courseService.findManyCoursePagination).toHaveBeenCalledWith(userId, defaultLimit, defaultPage);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findOneCourse', () => {
    it('should return course preview dto', async () => {
      const userId = 1;
      const role: Role = Role.STUDENT;
      const courseIdStr = '42';
      const courseIdNum = 42;

      const coursePreview: coursePreviewDto = {
        id: courseIdNum,
        name: 'Preview Course',
        description: 'Preview desc',
        image: 'http://image.com',
        modules: [],
        countModules: 0,
        durationVideos: 0,
        countVideos: 0,
      };

      courseService.findOneCoursePreview.mockResolvedValue(coursePreview);

      const result = await controller.findOneCourse(courseIdStr, userId, role);
      expect(courseService.findOneCoursePreview).toHaveBeenCalledWith(courseIdNum, userId, role);
      expect(result).toEqual(coursePreview);
    });
  });
});

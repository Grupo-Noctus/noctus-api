import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { CourseRequestDto } from './dto/course-request.dto';
import { CourseUpdateDto } from './dto/course-update.dto';
import { CourseResponseDto } from './dto/course-response.dto';
import { CoursePaginationResponseDto } from './dto/course-pagination-response.dto';

describe('CourseController', () => {
  let controller: CourseController;
  let service: CourseService;

  const mockService = {
    createCourse: jest.fn(),
    findOneCourse: jest.fn(),
    updateCourse: jest.fn(),
    deleteCourse: jest.fn(),
    findManyCourse: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [{ provide: CourseService, useValue: mockService }],
    }).compile();

    controller = module.get<CourseController>(CourseController);
    service = module.get<CourseService>(CourseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCourse', () => {
    it('should call service and return true', async () => {
      const dto: CourseRequestDto = {
        name: 'Test Course',
        description: 'Test Description',
        image: 'https://image.url',
        startDate: new Date(),
        endDate: new Date(),
        certificateModel: '<html></html>',
      };
      mockService.createCourse.mockResolvedValue(true);

      const result = await controller.createCourse(dto, 1);
      expect(service.createCourse).toHaveBeenCalledWith(dto, 1);
      expect(result).toBe(true);
    });
  });

  describe('findOneCourse', () => {
    it('should return a course', async () => {
      const course: CourseResponseDto = {
        name: 'Course',
        description: 'Description',
        image: 'https://image.url',
        startDate: new Date(),
        endDate: new Date(),
      };
      mockService.findOneCourse.mockResolvedValue(course);

      const result = await controller.findOneCourse('1');
      expect(service.findOneCourse).toHaveBeenCalledWith(1);
      expect(result).toEqual(course);
    });
  });

  describe('updateCourse', () => {
    it('should update and return true', async () => {
      const dto: CourseUpdateDto = {
        name: 'Updated',
      };
      mockService.updateCourse.mockResolvedValue(true);

      const result = await controller.updateCourse('1', dto, 1);
      expect(service.updateCourse).toHaveBeenCalledWith(1, dto, 1);
      expect(result).toBe(true);
    });
  });

  describe('deleteCourse', () => {
    it('should call deleteCourse', async () => {
      mockService.deleteCourse.mockResolvedValue(undefined);

      await controller.deleteCourse('1');
      expect(service.deleteCourse).toHaveBeenCalledWith(1);
    });
  });

  describe('findManyCourse', () => {
    it('should return paginated courses', async () => {
      const mockPagination: CoursePaginationResponseDto = {
        courses: [],
        totalPages: 1,
      };
      mockService.findManyCourse.mockResolvedValue(mockPagination);

      const result = await controller.findManyCourse(10, 1);
      expect(service.findManyCourse).toHaveBeenCalledWith(10, 1);
      expect(result).toEqual(mockPagination);
    });
  });
});

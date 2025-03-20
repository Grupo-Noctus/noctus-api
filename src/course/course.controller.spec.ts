import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

describe('CourseController', () => {
  let controller: CourseController;
  let service: CourseService;

  const mockCourseService = {
    create: jest.fn((dto) => ({ ...dto })),
    findOneCourse: jest.fn((id) => ({
      id,
      name: 'Test Course',
      description: 'Test Description',
      image: 'test.jpg',
      duration: 10,
      certificateModel: 'Basic',
      createdAt: new Date(),
      createdBy: 1,
      updatedAt: new Date(),
      updatedBy: 2,
    })),
    updateCourse: jest.fn((data) => ({ id: data.where.id, ...data.data })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        {
          provide: CourseService,
          useValue: mockCourseService,
        },
      ],
    }).compile();

    controller = module.get<CourseController>(CourseController);
    service = module.get<CourseService>(CourseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a course', async () => {
    const dto: CreateCourseDto = {
      id: 1,
      name: 'NestJS Course',
      description: 'A complete NestJS course',
      image: 'course.jpg',
      duration: 20,
      certificateModel: 'Advanced',
      createdAt: new Date(),
      createdBy: 1,
      updatedAt: new Date(),
      updatedBy: 2,
    };

    expect(await controller.createCourse(dto)).toEqual({ ...dto });
    expect(service.createCourse).toHaveBeenCalledWith(dto);
  });

  it('should return a course by id', async () => {
    expect(await controller.findOneCourse(1)).toEqual({
      id: 1,
      name: 'Test Course',
      description: 'Test Description',
      image: 'test.jpg',
      duration: 10,
      certificateModel: 'Basic',
      createdAt: expect.any(Date),
      createdBy: 1,
      updatedAt: expect.any(Date),
      updatedBy: 2,
    });

    expect(service.findOneCourse).toHaveBeenCalledWith(1);
  });

  it('should update a course', async () => {
    const dto: UpdateCourseDto = {
      name: 'Updated Course',
      description: 'Updated Description',
      image: 'updated.jpg',
      duration: 25,
      certificateModel: 'Expert',
      updatedAt: new Date(),
      updatedBy: 3,
    };

    expect(await controller.updateCourse('1', dto)).toEqual({ id: 1, ...dto });
    expect(service.updateCourse).toHaveBeenCalledWith({
      where: { id: 1 },
      data: dto,
    });
  });

  describe('deleteCourse', () => {
    it('should delete a course and return deleted course data', async () => {
      const mockDeletedCourse = {
        id: 1,
        name: 'NestJS Course',
        description: 'Learn NestJS',
        image: 'image-url.jpg',
        duration: 40,
        certificateModel: 'basic',
        createdAt: new Date(),
        createdBy: 1,
        updatedAt: null,
        updatedBy: null,
      };

      jest.spyOn(service, 'deleteCourse').mockResolvedValue(mockDeletedCourse);

      const result = await controller.deleteCourse('1');

      expect(result).toEqual(mockDeletedCourse);
      expect(service.deleteCourse).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an error if course does not exist', async () => {
      jest.spyOn(service, 'deleteCourse').mockRejectedValue(new Error('Course not found'));

      await expect(controller.deleteCourse('999')).rejects.toThrow('Course not found');
    });
  });
});

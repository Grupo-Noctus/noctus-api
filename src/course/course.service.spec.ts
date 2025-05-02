import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { handlePrismaError } from 'src/utils/handle-prisma.error';
import { handleHttpError } from 'src/utils/handle-http.error';

jest.mock('src/utils/handle-prisma.error');
jest.mock('src/utils/handle-http.error');

const mockPrisma = () => ({
  course: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    findMany: jest.fn(),
  },
  $queryRaw: jest.fn(),
});

const mockUploadService = () => ({
  deleteFile: jest.fn(),
});

const mockEnrollmentService = () => ({
  findCoursePerEnrollment: jest.fn(),
});

describe('CourseService', () => {
  let service: CourseService;
  let prisma: any;
  let uploadService: any;
  let enrollmentService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        { provide: PrismaService, useFactory: mockPrisma },
        { provide: UploadService, useFactory: mockUploadService },
        { provide: EnrollmentService, useFactory: mockEnrollmentService },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
    prisma = module.get(PrismaService);
    uploadService = module.get(UploadService);
    enrollmentService = module.get(EnrollmentService);

    jest.clearAllMocks();
  });

  describe('createCourse', () => {
    const dto = { name: 'Test', description: 'desc', durationInDays: 10 };
    const user = 1;
    const image = 'img.png';

    it('should create a course successfully', async () => {
      prisma.course.create.mockResolvedValueOnce(undefined);
      const result = await service.createCourse(dto, user, image);
      expect(prisma.course.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          durationInDays: dto.durationInDays,
          image,
          createdBy: user,
          updatedBy: user,
        },
      });
      expect(result).toBe(true);
    });

    it('should call deleteFile and handle errors on failure', async () => {
      prisma.course.create.mockRejectedValueOnce(new Error('fail'));
      await service.createCourse(dto, user, image);
      expect(uploadService.deleteFile).toHaveBeenCalledWith(image);
      expect(handlePrismaError).toHaveBeenCalled();
      expect(handleHttpError).toHaveBeenCalled();
    });
  });

  describe('updateCourse', () => {
    const dto = { name: 'Updated', durationInDays: 5 };
    const user = 1;
    const image = 'new.png';

    it('should update course successfully', async () => {
      prisma.course.findUnique.mockResolvedValueOnce({ id: 1 });
      prisma.course.update.mockResolvedValueOnce(undefined);

      const result = await service.updateCourse(1, dto, user, image);
      expect(result).toBe(true);
      expect(prisma.course.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...dto,
          image,
          updatedBy: user,
        },
      });
    });

    it('should throw NotFoundException if course not found', async () => {
      prisma.course.findUnique.mockResolvedValueOnce(null);
      await expect(service.updateCourse(1, dto, user, image)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteCourse', () => {
    it('should delete course with image', async () => {
      prisma.course.findUnique.mockResolvedValueOnce({ image: 'img.png' });
      prisma.course.delete.mockResolvedValueOnce(undefined);

      await service.deleteCourse(1);
      expect(uploadService.deleteFile).toHaveBeenCalledWith('img.png');
      expect(prisma.course.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if course not found', async () => {
      prisma.course.findUnique.mockResolvedValueOnce(null);
      await expect(service.deleteCourse(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneCourse', () => {
    it('should return one course', async () => {
      const course = { id: 1, name: 'A', description: '', image: '', durationInDays: 10 };
      prisma.course.findUnique.mockResolvedValueOnce(course);

      const result = await service.findOneCourse(1);
      expect(result).toEqual(course);
    });

    it('should throw NotFoundException if not found', async () => {
      prisma.course.findUnique.mockResolvedValueOnce(null);
      await expect(service.findOneCourse(2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findManyCoursePagination', () => {
    it('should throw if params are invalid', async () => {
      await expect(service.findManyCoursePagination(0, 0)).rejects.toThrow(BadRequestException);
    });

    it('should return paginated courses', async () => {
      prisma.course.count.mockResolvedValueOnce(10);
      prisma.$queryRaw.mockResolvedValueOnce([{ id: 1, name: 'A', description: '', image: '', durationInDays: 10 }]);

      const result = await service.findManyCoursePagination(5, 1);
      expect(result).toEqual({
        courses: [{ id: 1, name: 'A', description: '', image: '', durationInDays: 10 }],
        totalPages: 2,
      });
    });
  });

  describe('findManyCourse', () => {
    it('should return courses not enrolled by user', async () => {
      enrollmentService.findCoursePerEnrollment.mockResolvedValueOnce([{ courseId: 1 }]);
      prisma.course.findMany.mockResolvedValueOnce([]);

      const result = await service.findManyCourse(1);
      expect(result).toEqual([]);
    });
  });
});

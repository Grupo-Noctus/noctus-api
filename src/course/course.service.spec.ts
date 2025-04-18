import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CourseRequestDto } from './dto/course-request.dto';
import { CourseUpdateDto } from './dto/course-update.dto';

describe('CourseService', () => {
  let service: CourseService;
  let prisma: PrismaService;

  const mockPrisma = {
    course: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCourse', () => {
    it('should create a course and return true', async () => {
      mockPrisma.course.create.mockResolvedValueOnce(true);

      const dto: CourseRequestDto = {
        name: 'Test Course',
        description: 'Description',
        image: 'https://img.com/test.png',
        startDate: new Date(),
        endDate: new Date(),
        certificateModel: '',
      };

      const result = await service.createCourse(dto, {id: 1});

      expect(result).toBe(true);
      expect(mockPrisma.course.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          userId: 1,
        },
      });
    });

    it('should throw BadRequestException if Prisma throws', async () => {
      mockPrisma.course.create.mockRejectedValueOnce(new Error('fail'));

      await expect(
        service.createCourse({} as any, {id: 1}),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateCourse', () => {
    it('should update a course and return true', async () => {
      mockPrisma.course.update.mockResolvedValueOnce(true);

      const dto: CourseUpdateDto = { name: 'Updated' };

      const result = await service.updateCourse(1, dto, 1);
      expect(result).toBe(true);
      expect(mockPrisma.course.update).toHaveBeenCalledWith({
        where: {
          id_userId: {
            id: 1,
            userId: 1,
          },
        },
        data: dto,
      });
    });

    it('should throw BadRequestException on error', async () => {
      mockPrisma.course.update.mockRejectedValueOnce(new Error('fail'));

      await expect(
        service.updateCourse(1, {} as any, 1),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteCourse', () => {
    it('should delete a course', async () => {
      mockPrisma.course.delete.mockResolvedValueOnce(undefined);

      await expect(service.deleteCourse(1)).resolves.toBeUndefined();
      expect(mockPrisma.course.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException on error', async () => {
      mockPrisma.course.delete.mockRejectedValueOnce(new Error('fail'));

      await expect(service.deleteCourse(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneCourse', () => {
    it('should return course data', async () => {
      const courseData = {
        name: 'Test',
        description: 'desc',
        image: '',
        startDate: new Date(),
        endDate: new Date(),
      };
      mockPrisma.course.findUnique.mockResolvedValueOnce(courseData);

      const result = await service.findOneCourse(1);
      expect(result).toEqual(courseData);
      expect(mockPrisma.course.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException on error', async () => {
      mockPrisma.course.findUnique.mockRejectedValueOnce(new Error('fail'));

      await expect(service.findOneCourse(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findManyCourse', () => {
    it('should return paginated course list', async () => {
      mockPrisma.course.count.mockResolvedValueOnce(20);
      mockPrisma.$queryRaw.mockResolvedValueOnce([
        {
          name: 'A',
          description: '',
          image: '',
          startDate: new Date(),
          endDate: new Date(),
        },
      ]);
      const result = await service.findManyCourse(10, 1);

      expect(result).toHaveProperty('courses');
      expect(result).toHaveProperty('totalPages');
      expect(result.totalPages).toBe(2);
      expect(mockPrisma.course.count).toHaveBeenCalled();
      expect(mockPrisma.$queryRaw).toHaveBeenCalled();
    });

    it('should throw NotFoundException if no courses found', async () => {
      mockPrisma.course.count.mockResolvedValueOnce(0);
      mockPrisma.$queryRaw.mockResolvedValueOnce([]);

      await expect(service.findManyCourse(10, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException on query error', async () => {
      mockPrisma.course.count.mockResolvedValueOnce(10);
      mockPrisma.$queryRaw.mockRejectedValueOnce(new Error('fail'));

      await expect(service.findManyCourse(10, 1)).rejects.toThrow(NotFoundException);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Course } from '@prisma/client';

describe('CourseService', () => {
  let service: CourseService;
  let prisma: PrismaService;

  const mockPrismaService = {
    course: {
      create: jest.fn((data) => Promise.resolve({ id: 1, ...data })),
      update: jest.fn((params) => Promise.resolve({ id: params.where.id, ...params.data })),
      delete: jest.fn((where) => Promise.resolve({ id: where.id })),
      findUnique: jest.fn((where) =>
        where.where.id === 1
          ? Promise.resolve({
              id: 1,
              name: 'Test Course',
              description: 'Test Description',
              image: 'test.jpg',
              duration: 10,
              certificateModel: 'Basic',
              createdAt: new Date(),
              createdBy: 1,
              updatedAt: new Date(),
              updatedBy: 2,
            })
          : Promise.resolve(null),
      ),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a course', async () => {
    const data: Prisma.CourseCreateInput = {
      name: 'NestJS Course',
      description: 'A complete NestJS course',
      image: 'course.jpg',
      duration: 20,
      certificateModel: 'Advanced',
      createdAt: new Date(),
      createdBy: 1,
      updatedBy: 1,
    };
    await expect(service.createCourse(data)).resolves.toEqual({ id: 1, ...data });
    expect(prisma.course.create).toHaveBeenCalledWith({ data });
  });
  

  it('should update a course', async () => {
    const params = {
      where: { id: 1 },
      data: {
        name: 'Updated Course',
        description: 'Updated Description',
        image: 'updated.jpg',
        duration: 25,
        certificateModel: 'Expert',
        updatedAt: new Date(),
        updatedBy: 3,
      },
    };
    await expect(service.updateCourse(params)).resolves.toEqual({ id: 1, ...params.data });
    expect(prisma.course.update).toHaveBeenCalledWith(params);
  });

  it('should delete a course', async () => {
    await expect(service.deleteCourse({ id: 1 })).resolves.toEqual({ id: 1 });
    expect(prisma.course.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should find a course by id', async () => {
    await expect(service.findOneCourse(1)).resolves.toEqual({
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
    expect(prisma.course.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should throw an error when course is not found', async () => {
    await expect(service.findOneCourse(99)).rejects.toThrow('Course with ID 99 not found');
    expect(prisma.course.findUnique).toHaveBeenCalledWith({ where: { id: 99 } });
  });
});
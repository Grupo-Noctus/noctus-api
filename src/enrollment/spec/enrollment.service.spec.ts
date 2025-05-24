import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentService } from './enrollment.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('EnrollmentService', () => {
  let service: EnrollmentService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrollmentService, PrismaService],
    }).compile();

    service = module.get<EnrollmentService>(EnrollmentService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createEnrollment', () => {
    it('should create an enrollment and return true', async () => {
      jest.spyOn(prisma.enrollment, 'create').mockResolvedValueOnce(true as any);

      await expect(
        service.createEnrollment({ idStudent: 1, idCourse: 1, active: true, completed: false, startDate: new Date(), endDate: new Date() }, 1)
      ).resolves.toBe(true);
    });

    it('should throw BadRequestException on error', async () => {
      jest.spyOn(prisma.enrollment, 'create').mockRejectedValueOnce(new Error());

      await expect(
        service.createEnrollment({ idStudent: 1, idCourse: 1, active: true, completed: false, startDate: new Date(), endDate: new Date() }, 1)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getEnrollmentById', () => {
    it('should return enrollment details', async () => {
      const mockEnrollment = [{ name: 'John Doe', active: true, completed: false, startDate: new Date(), endDate: new Date(), nameCourse: 'Math' }];
      jest.spyOn(prisma, '$queryRaw').mockResolvedValueOnce(mockEnrollment);

      await expect(service.getEnrollmentById(1)).resolves.toEqual({
        name: 'John Doe',
        active: true,
        completed: false,
        startDate: expect.any(Date),
        endDate: expect.any(Date),
        nameCourse: 'Math',
      });
    });

    it('should throw BadRequestException if no enrollments are found', async () => {
      jest.spyOn(prisma, '$queryRaw').mockResolvedValueOnce([]);
      await expect(service.findManyEnrollment(1)).rejects.toThrow(BadRequestException);
    });    
  });

  describe('updateEnrollment', () => {
    it('should update an enrollment and return true', async () => {
      jest.spyOn(prisma.enrollment, 'update').mockResolvedValueOnce(true as any);

      await expect(service.updateEnrollment(1, { active: false, completed: true }, 1)).resolves.toBe(true);
    });

    it('should throw BadRequestException on error', async () => {
      jest.spyOn(prisma.enrollment, 'update').mockRejectedValueOnce(new Error());
      await expect(service.updateEnrollment(1, { active: false, completed: true }, 1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteEnrollment', () => {
    it('should delete an enrollment without errors', async () => {
      jest.spyOn(prisma.enrollment, 'delete').mockResolvedValueOnce(true as any);
      await expect(service.deleteEnrollment(1)).resolves.toBeUndefined();
    });

    it('should throw BadRequestException on error', async () => {
      jest.spyOn(prisma.enrollment, 'delete').mockRejectedValueOnce(new Error());
      await expect(service.deleteEnrollment(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findManyEnrollment', () => {
    it('should return paginated enrollments', async () => {
      const mockEnrollments = [{ student_name: 'John Doe', active: true, completed: false, startDate: new Date(), endDate: new Date(), course_name: 'Math' }];
      jest.spyOn(prisma, '$queryRaw').mockResolvedValueOnce(mockEnrollments);
      jest.spyOn(prisma.enrollment, 'count').mockResolvedValueOnce(1);

      await expect(service.findManyEnrollment(1)).resolves.toEqual({ enrollments: mockEnrollments, totalPages: 1 });
    });

    it('should throw BadRequestException if no enrollments are found', async () => {
      jest.spyOn(prisma, '$queryRaw').mockResolvedValueOnce([]);
      await expect(service.findManyEnrollment(1)).rejects.toThrow(BadRequestException);
    });    
  });
});

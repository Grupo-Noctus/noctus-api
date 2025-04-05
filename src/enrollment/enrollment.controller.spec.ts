import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentRequestDto } from './dto/enrollment-request.dto';
import { EnrollmentUpdateDto } from './dto/enrollment-update.dto';
import { EnrollmentResponseDto } from './dto/enrollment-response.dto';
import { EnrollmentPaginationResponseDto } from './dto/enrollment-pagination-response.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('EnrollmentController', () => {
  let controller: EnrollmentController;
  let service: EnrollmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentController],
      providers: [
        {
          provide: EnrollmentService,
          useValue: {
            createEnrollment: jest.fn(),
            getEnrollmentById: jest.fn(),
            updateEnrollment: jest.fn(),
            deleteEnrollment: jest.fn(),
            findManyEnrollment: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EnrollmentController>(EnrollmentController);
    service = module.get<EnrollmentService>(EnrollmentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createEnrollment', () => {
    it('should create an enrollment', async () => {
      jest.spyOn(service, 'createEnrollment').mockResolvedValue(true);
      
      await expect(
        controller.createEnrollment({ idStudent: 1, idCourse: 1, active: true, completed: false, startDate: new Date(), endDate: new Date() }, 1)
      ).resolves.toBe(true);
    });
  });

  describe('getEnrollmentById', () => {
    it('should return enrollment details', async () => {
      const mockResponse: EnrollmentResponseDto = { name: 'John Doe', active: true, completed: false, startDate: new Date(), endDate: new Date(), nameCourse: 'Math' };
      jest.spyOn(service, 'getEnrollmentById').mockResolvedValue(mockResponse);
      
      await expect(controller.getEnrollmentById('1')).resolves.toEqual(mockResponse);
    });

    it('should throw NotFoundException if enrollment not found', async () => {
      jest.spyOn(service, 'getEnrollmentById').mockRejectedValue(new NotFoundException());
      
      await expect(controller.getEnrollmentById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateEnrollment', () => {
    it('should update an enrollment', async () => {
      jest.spyOn(service, 'updateEnrollment').mockResolvedValue(true);
      
      await expect(controller.updateEnrollment('1', { active: false, completed: true }, 1)).resolves.toBe(true);
    });
  });

  describe('deleteEnrollment', () => {
    it('should delete an enrollment', async () => {
      jest.spyOn(service, 'deleteEnrollment').mockResolvedValue(undefined);
      
      await expect(controller.deleteEnrollment('1')).resolves.toBeUndefined();
    });
  });

  describe('findManyEnrollment', () => {
    it('should return paginated enrollments', async () => {
      const mockResponse: EnrollmentPaginationResponseDto = { enrollments: [], totalPages: 1 };
      jest.spyOn(service, 'findManyEnrollment').mockResolvedValue(mockResponse);
      
      await expect(controller.findManyEnrollment(1)).resolves.toEqual(mockResponse);
    });
  });
});

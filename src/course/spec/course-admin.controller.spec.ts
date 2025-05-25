import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { CourseAdminController } from '../course-admin.controller';
import { UploadService } from 'src/upload/upload.service';
import { ICourseService } from '../interface/course.service.interface';
import { CourseRequestDto } from '../dto/request/course.request.dto';
import { CourseUpdateDto } from '../dto/update/course.update.dto';
import { validateOrReject } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import * as classValidator from 'class-validator';

jest.spyOn(classValidator, 'validateOrReject');

describe('CourseAdminController', () => {
  let controller: CourseAdminController;
  let courseService: jest.Mocked<ICourseService>;
  let uploadService: jest.Mocked<UploadService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseAdminController],
      providers: [
        {
          provide: 'ICourseService',
          useValue: {
            createCourse: jest.fn(),
            updateCourse: jest.fn(),
            toggleCourseVisibility: jest.fn(),
          },
        },
        {
          provide: UploadService,
          useValue: {
            uploadFileMetadata: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CourseAdminController>(CourseAdminController);
    courseService = module.get('ICourseService');
    uploadService = module.get(UploadService);
  });

  describe('createCourse', () => {
    it('should create a course with image', async () => {
      const file = { originalname: 'course.jpg' } as Express.Multer.File;
      const dto = new CourseRequestDto();
      const user = 1;

      uploadService.uploadFileMetadata.mockResolvedValue('image-key');
      (validateOrReject as jest.Mock).mockResolvedValue(undefined);
      courseService.createCourse.mockResolvedValue(true);

      const result = await controller.createCourse(file, dto, user);

      expect(uploadService.uploadFileMetadata).toHaveBeenCalled();
      expect(courseService.createCourse).toHaveBeenCalledWith(dto, user, 'image-key');
      expect(result).toBe(true);
    });

    it('should create a course without image', async () => {
      const dto = new CourseRequestDto();
      const user = 1;

      (validateOrReject as jest.Mock).mockResolvedValue(undefined);
      courseService.createCourse.mockResolvedValue(true);

      const result = await controller.createCourse(undefined, dto, user);

      expect(courseService.createCourse).toHaveBeenCalledWith(dto, user, null);
      expect(result).toBe(true);
    });

    it('should throw error when validation fails', async () => {
      const dto = new CourseRequestDto();
      const user = 1;

      (validateOrReject as jest.Mock).mockRejectedValue(new BadRequestException());

      await expect(controller.createCourse(undefined, dto, user)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateCourse', () => {
    it('should update a course with image', async () => {
      const file = { originalname: 'course.jpg' } as Express.Multer.File;
      const dto = new CourseUpdateDto();
      const user = 1;

      uploadService.uploadFileMetadata.mockResolvedValue('image-key');
      (validateOrReject as jest.Mock).mockResolvedValue(undefined);
      courseService.updateCourse.mockResolvedValue(true);

      const result = await controller.updateCourse('1', dto, user, file);

      expect(uploadService.uploadFileMetadata).toHaveBeenCalled();
      expect(courseService.updateCourse).toHaveBeenCalledWith(1, dto, user, 'image-key');
      expect(result).toBe(true);
    });

    it('should update a course without image', async () => {
      const dto = new CourseUpdateDto();
      const user = 1;

      (validateOrReject as jest.Mock).mockResolvedValue(undefined);
      courseService.updateCourse.mockResolvedValue(true);

      const result = await controller.updateCourse('1', dto, user, undefined);

      expect(courseService.updateCourse).toHaveBeenCalledWith(1, dto, user, null);
      expect(result).toBe(true);
    });

    it('should throw error when validation fails', async () => {
      const dto = new CourseUpdateDto();
      const user = 1;

      (validateOrReject as jest.Mock).mockRejectedValue(new BadRequestException());

      await expect(controller.updateCourse('1', dto, user, undefined)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('toggleCourseVisibility', () => {
    it('should call toggle visibility method', async () => {
      await controller.toggleCourseVisibility('1');
      expect(courseService.toggleCourseVisibility).toHaveBeenCalledWith(1);
    });
  });
});

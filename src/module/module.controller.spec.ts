import { Test, TestingModule } from '@nestjs/testing';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';
import { ModuleRequstDto } from './dto/module-request.dto';
import { ModuleResponseDto } from './dto/module-response.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ModuleController', () => {
  let controller: ModuleController;
  let service: ModuleService;

  const mockModuleService = {
    createModule: jest.fn(),
    updateModule: jest.fn(),
    findOneModule: jest.fn(),
    deleteCourse: jest.fn(),
    findManyModule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModuleController],
      providers: [
        {
          provide: ModuleService,
          useValue: mockModuleService,
        },
      ],
    }).compile();

    controller = module.get<ModuleController>(ModuleController);
    service = module.get<ModuleService>(ModuleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createModule', () => {
    it('should create a module and return true', async () => {
      const dto: ModuleRequstDto = {
        idCourse: 1,
        name: 'Test Module',
        description: 'Module description',
        order: 1,
      };

      mockModuleService.createModule.mockResolvedValueOnce(true);
      const result = await controller.createModule(dto, 1);
      
      expect(result).toBe(true);
      expect(mockModuleService.createModule).toHaveBeenCalledWith(dto, 1);
    });

    it('should throw BadRequestException if service fails', async () => {
      mockModuleService.createModule.mockRejectedValueOnce(new BadRequestException());

      await expect(controller.createModule({} as any, 1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateModule', () => {
    it('should update a module and return true', async () => {
      const dto: ModuleRequstDto = { idCourse: 1, name: 'Updated Module', description: 'Module description', order: 1 };

      mockModuleService.updateModule.mockResolvedValueOnce(true);
      const result = await controller.updateModule('1', dto, 1);
      
      expect(result).toBe(true);
      expect(mockModuleService.updateModule).toHaveBeenCalledWith(1, dto, 1);
    });

    it('should throw BadRequestException if service fails', async () => {
      mockModuleService.updateModule.mockRejectedValueOnce(new BadRequestException());

      await expect(controller.updateModule('1', {} as any, 1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOneModule', () => {
    it('should return module data', async () => {
      const moduleData: ModuleResponseDto = { name: 'Test Module', description: 'Module description', order: 1 };

      mockModuleService.findOneModule.mockResolvedValueOnce(moduleData);
      const result = await controller.findOneModule('1');
      
      expect(result).toEqual(moduleData);
      expect(mockModuleService.findOneModule).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if module not found', async () => {
      mockModuleService.findOneModule.mockRejectedValueOnce(new NotFoundException());

      await expect(controller.findOneModule('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteCourse', () => {
    it('should delete a module', async () => {
      mockModuleService.deleteCourse.mockResolvedValueOnce(undefined);

      await expect(controller.deleteCourse('1')).resolves.toBeUndefined();
      expect(mockModuleService.deleteCourse).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if module not found', async () => {
      mockModuleService.deleteCourse.mockRejectedValueOnce(new NotFoundException());

      await expect(controller.deleteCourse('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findManyCourse', () => {
    it('should return an array of modules', async () => {
      const modules: ModuleResponseDto[] = [
        { name: 'Module 1', description: 'Desc', order: 1 },
        { name: 'Module 2', description: 'Desc', order: 2 },
      ];

      mockModuleService.findManyModule.mockResolvedValueOnce(modules);
      const result = await controller.findManyCourse('1');
      
      expect(result).toEqual(modules);
      expect(mockModuleService.findManyModule).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if no modules found', async () => {
      mockModuleService.findManyModule.mockRejectedValueOnce(new NotFoundException());

      await expect(controller.findManyCourse('1')).rejects.toThrow(NotFoundException);
    });
  });
});

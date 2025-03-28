import { Test, TestingModule } from '@nestjs/testing';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

describe('MaterialController', () => {
  let controller: MaterialController;
  let service: MaterialService;

  const mockMaterialService = {
    create: jest.fn((dto) => ({ id: 1, ...dto })),
    findAll: jest.fn(() => [{ id: 1, name: 'Test Material' }]),
    findOne: jest.fn((id) => ({ id, name: 'Test Material' })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn((id) => ({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialController],
      providers: [{ provide: MaterialService, useValue: mockMaterialService }],
    }).compile();

    controller = module.get<MaterialController>(MaterialController);
    service = module.get<MaterialService>(MaterialService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a material', async () => {
    const dto: CreateMaterialDto = { 
      name: 'Test Material',
      description: 'Test Description',
      filename: 'test.pdf',
      type: 'PDF',
      link: 'http://example.com',
      createdBy: 1,
      idCourse: 1,
      updatedBy: null,
    };
    expect(await controller.uploadMaterial(dto)).toEqual({ id: 1, ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all materials', async () => {
    expect(await controller.findAllMaterial()).toEqual([{ id: 1, name: 'Test Material' }]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a material by id', async () => {
    expect(await controller.findOneMaterial('1')).toEqual({ id: 1, name: 'Test Material' });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should delete a material', async () => {
    expect(await controller.removeMaterial('1')).toEqual({ id: 1 });
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});

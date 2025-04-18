import { Test, TestingModule } from '@nestjs/testing';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';
import { MaterialResponseDto } from './dto/material-response.dto';
import { MaterialPaginationResponseDto } from './dto/material-pagination-response.dto';

describe('MaterialController', () => {
  let controller: MaterialController;
  let service: MaterialService;

  const mockMaterialService = {
    create: jest.fn((dto) => ({ id: 1, ...dto })),
    findAllMaterial: jest.fn(),
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

    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'test.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      buffer: Buffer.from('mock file content'),
      size: 1024,
      destination: '',
      filename: 'test.pdf',
      path: '',
      stream: null,
    } as Express.Multer.File;

    const dto: MaterialResponseDto = { 
      name: 'Test Material',
      description: 'Test Description',
      filename: 'test.pdf',
      type: 'PDF',
      link: 'http://example.com',
      createdBy: 1,
      idCourse: 1,
      updatedBy: null,
      file: mockFile,
    };
    const userId = 1;
    
    
    expect(await controller.createMaterial(dto, {id: userId}, mockFile)).toEqual({ id: 1, ...dto });

    expect(service.createMaterial).toHaveBeenCalledWith(dto);
  });

  describe('findManyMaterial', () => {
      it('should return paginated courses', async () => {
        const mockPagination: MaterialPaginationResponseDto = {
          materials: [],
          totalPages: 1,
        };
        mockMaterialService.findAllMaterial.mockResolvedValue(mockPagination);
        
      const result = await controller.findManyMaterial(1);
      expect(service.findManyMaterial).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPagination);
    });
  });


  it('should return a material by id', async () => {
    expect(await controller.findOneMaterial('1')).toEqual({ id: 1, name: 'Test Material' });
    expect(service.findOneMaterial).toHaveBeenCalledWith(1);
  });

  it('should delete a material', async () => {
    expect(await controller.deleteMaterial('1')).toEqual({ id: 1 });
    expect(service.deleteMaterial).toHaveBeenCalledWith(1);
  });
});

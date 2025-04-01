import { Test, TestingModule } from '@nestjs/testing';
import { StreamingService } from './streaming.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import getVideoDurationInSeconds from 'get-video-duration';

// Mocking the PrismaService
const mockPrismaService = {
  videoLecture: {
    create: jest.fn(),
  },
};

// Mocking the external dependencies
jest.mock('get-video-duration', () => ({
  __esModule: true,
  default: jest.fn(),  // Mocka a função default do módulo
}));

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('unique-uuid'), // Mock do UUID
}));

describe('StreamingService', () => {
  let service: StreamingService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StreamingService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<StreamingService>(StreamingService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createVideoLecture', () => {
    it('should successfully create a video lecture', async () => {
      // Mockando a função default do get-video-duration
      const mockDuration = 120;  // Mockando a duração do vídeo
      (getVideoDurationInSeconds as jest.Mock).mockResolvedValue(mockDuration);

      // Mock do arquivo com o tipo correto
      const mockFile: Express.Multer.File = {
        fieldname: 'video',
        originalname: 'intro-to-nestjs.mp4',
        encoding: '7bit',
        mimetype: 'video/mp4',
        size: 1024000,
        stream: {} as any, // Mock vazio para stream
        destination: '/uploads',
        filename: 'intro-to-nestjs.mp4',
        path: '/path/to/video',
        buffer: Buffer.from(''), // Buffer vazio
      };

      const streamingRequest = {
        idModule: 1,
        name: 'Introduction to NestJS',
        description: 'This video covers the basics of NestJS framework.',
        order: 1,
      };
      const user = 1;

      mockPrismaService.videoLecture.create.mockResolvedValue(true);

      const result = await service.createVideoLecture(mockFile, streamingRequest, user);

      expect(result).toBe(true);
      expect(mockPrismaService.videoLecture.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          module: { connect: { id: 1 } },
          name: 'Introduction to NestJS',
          description: 'This video covers the basics of NestJS framework.',
          order: 1,
          duration: mockDuration,
          key: 'intro-to-nestjsmp4-unique-uuid',
          url: '/path/to/video',
          mimetype: 'video/mp4',
          size: 1024000,
          createdBy: 1,
          updatedBy: 1,
        }),
      });
    });

    it('should throw BadRequestException if an error occurs', async () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'video',
        originalname: 'intro-to-nestjs.mp4',
        encoding: '7bit',
        mimetype: 'video/mp4',
        size: 1024000,
        stream: {} as any,
        destination: '/uploads',
        filename: 'intro-to-nestjs.mp4',
        path: '/path/to/video',
        buffer: Buffer.from(''),
      };

      const streamingRequest = {
        idModule: 1,
        name: 'Introduction to NestJS',
        description: 'This video covers the basics of NestJS framework.',
        order: 1,
      };
      const user = 1;

      mockPrismaService.videoLecture.create.mockRejectedValue(new Error('Something went wrong'));

      await expect(service.createVideoLecture(mockFile, streamingRequest, user)).rejects.toThrow(BadRequestException);
    });
  });
});

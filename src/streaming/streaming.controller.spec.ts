import { Test, TestingModule } from '@nestjs/testing';
import { StreamingController } from './streaming.controller';
import { StreamingService } from './streaming.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { StreamingRequest } from './dto/streaming-request.dto';
import { StreamingUpdate } from './dto/streaming-update.dto';

describe('StreamingController', () => {
  let controller: StreamingController;
  let service: StreamingService;

  const mockStreamingService = {
    createVideoLecture: jest.fn(),
    updateVideoData: jest.fn(),
    findManyVideos: jest.fn(),
    findVideo: jest.fn(),
    deleteVideo: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StreamingController],
      providers: [
        {
          provide: StreamingService,
          useValue: mockStreamingService,
        },
      ],
    }).compile();

    controller = module.get<StreamingController>(StreamingController);
    service = module.get<StreamingService>(StreamingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should successfully create a video lecture', async () => {
      const file = { originalname: 'intro-to-nestjs.mp4', mimetype: 'video/mp4', size: 1024000, path: '/path/to/file' };
      const streamingRequest: StreamingRequest = { idModule: 1, name: 'Introduction to NestJS', description: 'This video covers the basics of NestJS framework.', order: 1 };
      const user = 1;

      mockStreamingService.createVideoLecture.mockResolvedValue(true);

      const result = await controller.uploadFile(file as any, streamingRequest, user);

      expect(result).toBe(true);
      expect(mockStreamingService.createVideoLecture).toHaveBeenCalledWith(file, streamingRequest, user);
    });

    it('should throw BadRequestException if an error occurs', async () => {
      const file = { originalname: 'intro-to-nestjs.mp4', mimetype: 'video/mp4', size: 1024000, path: '/path/to/file' };
      const streamingRequest: StreamingRequest = { idModule: 1, name: 'Introduction to NestJS', description: 'This video covers the basics of NestJS framework.', order: 1 };
      const user = 1;

      mockStreamingService.createVideoLecture.mockRejectedValue(new BadRequestException());

      try {
        await controller.uploadFile(file as any, streamingRequest, user);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('updateVideoData', () => {
    it('should update video data successfully', async () => {
      const idVideo = 1;
      const streamingUpdate: StreamingUpdate = { name: 'Updated Name', description: 'Updated description' };
      const user = 1;

      mockStreamingService.updateVideoData.mockResolvedValue(true);

      const result = await controller.updateVideoData(idVideo, streamingUpdate, user);

      expect(result).toBe(true);
      expect(mockStreamingService.updateVideoData).toHaveBeenCalledWith(idVideo, streamingUpdate, user);
    });

    it('should throw BadRequestException if update fails', async () => {
      const idVideo = 1;
      const streamingUpdate: StreamingUpdate = { name: 'Updated Name', description: 'Updated description' };
      const user = 1;

      mockStreamingService.updateVideoData.mockRejectedValue(new BadRequestException());

      try {
        await controller.updateVideoData(idVideo, streamingUpdate, user);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('deleteVideoLecture', () => {
    it('should delete video lecture successfully', async () => {
      const idVideo = 1;

      mockStreamingService.deleteVideo.mockResolvedValue(true);

      await controller.deleteVideoLecture(idVideo);

      expect(mockStreamingService.deleteVideo).toHaveBeenCalledWith(idVideo);
    });

    it('should throw NotFoundException if delete fails', async () => {
      const idVideo = 1;

      mockStreamingService.deleteVideo.mockRejectedValue(new NotFoundException());

      try {
        await controller.deleteVideoLecture(idVideo);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('findManyVideos', () => {
    it('should return a list of video lectures', async () => {
      const idModule = 1;
      const mockResponse = [
        { id: 1, name: 'Video 1', description: 'Video description 1', duration: 120, order: 1 },
        { id: 2, name: 'Video 2', description: 'Video description 2', duration: 240, order: 2 },
      ];

      mockStreamingService.findManyVideos.mockResolvedValue(mockResponse);

      const result = await controller.findManyVideos(idModule);

      expect(result).toEqual(mockResponse);
      expect(mockStreamingService.findManyVideos).toHaveBeenCalledWith(idModule);
    });
  });
});

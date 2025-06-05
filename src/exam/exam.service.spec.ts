import { Test, TestingModule } from '@nestjs/testing';
import { ExamService } from './exam.service';
import { PrismaService } from '../prisma/prisma.service';
import { ExamRequestDto } from './dto/exam-request.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { NotFoundException } from '@nestjs/common';

describe('ExamService', () => {
  let service: ExamService;
  let prisma: PrismaService;

  const mockPrismaService = {
    exam: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
    module: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ExamService>(ExamService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createExam', () => {
    it('should create an exam', async () => {
      const examDto: ExamRequestDto = {
        idModule: 1,
        title: 'Test Exam',
        description: 'This is a test exam',
      };

      mockPrismaService.module.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.exam.create.mockResolvedValue({});

      const result = await service.createExam(1, 1, examDto, 1);
      expect(result).toBe(true);
      expect(prisma.exam.create).toHaveBeenCalled();
    });
  });

  describe('updateExam', () => {
    it('should update an existing exam', async () => {
      const updateDto: UpdateExamDto = {
        title: 'Updated Exam',
        description: 'Updated description',
      };

      mockPrismaService.exam.findFirst.mockResolvedValue({ id: 1 });
      mockPrismaService.exam.update.mockResolvedValue({});

      const result = await service.updateExam(1, 1, updateDto, 1);
      expect(result).toBe(true);
      expect(prisma.exam.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if exam does not exist', async () => {
      mockPrismaService.exam.findFirst.mockResolvedValue(null);

      await expect(
        service.updateExam(1, 999, { title: 'Fail' }, 1),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findManyExams', () => {
    it('should return an array of exams', async () => {
      const mockData = [
        {
          id: 1,
          idModule: 1,
          title: 'Exam 1',
          description: 'Desc',
          questions: [],
        },
      ];

      mockPrismaService.exam.findMany.mockResolvedValue(mockData);
      const result = await service.findManyExams(1);
      expect(result).toEqual(mockData);
      expect(prisma.exam.findMany).toHaveBeenCalled();
    });
  });

  describe('findOneExam', () => {
    it('should return a single exam', async () => {
      const exam = {
        id: 1,
        idModule: 1,
        title: 'Java Exam',
        description: 'Theory',
        questions: [],
      };

      mockPrismaService.exam.findUnique.mockResolvedValue(exam);
      const result = await service.findOneExam(1, 1);
      expect(result).toEqual(exam);
    });

    it('should throw NotFoundException if exam not found', async () => {
      mockPrismaService.exam.findUnique.mockResolvedValue(null);
      await expect(service.findOneExam(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteExam', () => {
    it('should delete an exam', async () => {
      mockPrismaService.exam.findFirst.mockResolvedValue({ id: 1 });
      mockPrismaService.exam.delete.mockResolvedValue({});

      await service.deleteExam(1, 1);
      expect(prisma.exam.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if exam does not exist', async () => {
      mockPrismaService.exam.findFirst.mockResolvedValue(null);

      await expect(service.deleteExam(1, 999)).rejects.toThrow(NotFoundException);
    });
  });
});

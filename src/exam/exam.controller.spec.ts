import { Test, TestingModule } from '@nestjs/testing';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { ExamRequestDto } from './dto/exam-request.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ExamResponseDto } from './dto/exam-response.dto';

describe('ExamController', () => {
  let examController: ExamController;
  let examService: ExamService;

  const fixedDate = new Date('2025-01-01T00:00:00.000Z');

  function mockExamResponse(overrides = {}): ExamResponseDto {
    return {
      id: 1,
      title: 'Exam 1',
      idModule: 1,
      description: 'Mock description',
      createdAt: fixedDate,
      updatedAt: fixedDate,
      updatedBy: 1,
      questions: [],
      ...overrides,
    };
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamController],
      providers: [
        {
          provide: ExamService,
          useValue: {
            createExam: jest.fn().mockResolvedValue(true),
            updateExam: jest.fn().mockResolvedValue(true),
            findManyExams: jest.fn().mockResolvedValue([mockExamResponse()]),
            findOneExam: jest.fn().mockResolvedValue(mockExamResponse()),
            deleteExam: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    examController = module.get<ExamController>(ExamController);
    examService = module.get<ExamService>(ExamService);
  });

  describe('createExam', () => {
    it('should create an exam', async () => {
      const dto: ExamRequestDto = { idModule: 1, title: 'Test Exam', description: 'desc' };
      const result = await examController.createExam('1', '1', dto, 1);
      expect(result).toBe(true);
      expect(examService.createExam).toHaveBeenCalledWith(1, 1, dto, 1);
    });
  });

  describe('updateExam', () => {
    it('should update an exam', async () => {
      const dto: UpdateExamDto = { title: 'Updated Exam', description: 'updated desc' };
      const result = await examController.updateExam('1', '1', dto, 1);
      expect(result).toBe(true);
      expect(examService.updateExam).toHaveBeenCalledWith(1, 1, dto, 1);
    });
  });

  describe('findManyExams', () => {
    it('should return an array of exams', async () => {
      const result = await examController.findManyExams('1', '1');
      expect(result).toEqual([mockExamResponse()]);
      expect(examService.findManyExams).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('findOneExam', () => {
    it('should return one exam', async () => {
      const result = await examController.findOneExam('1', '1');
      expect(result).toEqual(mockExamResponse());
      expect(examService.findOneExam).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('deleteExam', () => {
    it('should delete an exam', async () => {
      await expect(examController.deleteExam('1', '1')).resolves.toBeUndefined();
      expect(examService.deleteExam).toHaveBeenCalledWith(1, 1);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { QuestionRequestDto } from './dto/question-request.dto';
import { TypeQuestion } from '@prisma/client';

describe('QuestionController', () => {
  let controller: QuestionController;
  let questionService: Partial<QuestionService>;

  beforeEach(async () => {
    questionService = {
      createQuestion: jest.fn().mockResolvedValue(true),
      updateQuestion: jest.fn(),
      findManyQuestion: jest.fn(),
      findOneQuestion: jest.fn(),
      deleteQuestion: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [
        {
          provide: QuestionService,
          useValue: questionService,
        },
      ],
    }).compile();

    controller = module.get<QuestionController>(QuestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('createQuestion should call service with correct params and return true', async () => {
    const dto: QuestionRequestDto = {
      idExam: 1,
      questionText: 'Qual é a capital da França?',
      type: TypeQuestion.MULTIPLE_CHOICE,
      options: [
        { id: 1, optionText: 'Paris', correct: true },
        { id: 2, optionText: 'Londres', correct: false },
      ],
    };

    const userId = 42;

    const result = await controller.createQuestion('1', '2', dto, userId);

    expect(questionService.createQuestion).toHaveBeenCalledWith(1, 2, dto, userId);
    expect(result).toBe(true);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('QuestionService', () => {
  let service: QuestionService;

  // Mock básico do PrismaService, só os métodos usados no service
  const mockPrismaService = {
    exam: {
      findFirst: jest.fn(),
    },
    module: {
      findUnique: jest.fn(),
    },
    question: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    questionOptions: {
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


});

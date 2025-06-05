import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QuestionRequestDto } from './dto/question-request.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionResponseDto } from './dto/question-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuestionService {
  private readonly logger = new Logger(QuestionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createQuestion(
    idModule: number,
    idExam: number,
    questionRequest: QuestionRequestDto,
    user: number,
  ): Promise<boolean> {
    try {
      const exam = await this.prisma.exam.findFirst({
        where: {
          id: idExam,
          idModule: idModule,
        },
      });

      if (!exam) {
        throw new NotFoundException('Exam not found in this module');
      }

      await this.prisma.question.create({
        data: {
          questionText: questionRequest.questionText,
          type: questionRequest.type,
          order: questionRequest.order,
          idExam: idExam,
          createdBy: user,
          updatedBy: user,
          options: {
            create: questionRequest.options.map(opt => ({
              optionText: opt.optionText,
              correct: opt.correct,
              createdBy: user,
              updatedBy: user,
            })),
          },
        },
      });

      return true;
    } catch (error) {
      this.logger.error('Error while creating question', error);
    }
  }

  async updateQuestion(
    idModule: number,
    idExam: number,
    idQuestion: number,
    updateQuestion: UpdateQuestionDto,
    user: number,
  ): Promise<boolean> {
    try {
      const module = await this.prisma.module.findUnique({
        where: { id: idModule },
      });
      if (!module) throw new NotFoundException('Module not found');

      const exam = await this.prisma.exam.findFirst({
        where: {
          id: idExam,
          idModule: idModule,
        },
      });
      if (!exam) throw new NotFoundException('Exam not found');

      const question = await this.prisma.question.findFirst({
        where: {
          id: idQuestion,
          idExam: idExam,
        },
      });
      if (!question) {
        throw new NotFoundException('Question not found');
      }

      await this.prisma.question.update({
        where: { id: idQuestion },
        data: {
          questionText: updateQuestion.questionText,
          type: updateQuestion.type,
          order: updateQuestion.order,
          updatedBy: user,
        },
      });

      return true;
    } catch (error) {
      this.logger.error('Error while updating question', error);
    }
  }

  async findManyQuestion(idModule: number, idExam: number): Promise<QuestionResponseDto[]> {
    try {
      const module = await this.prisma.module.findUnique({
        where: { id: idModule },
      });
      if (!module) throw new NotFoundException('Module not found');

      const exam = await this.prisma.exam.findFirst({
        where: {
          id: idExam,
          idModule: idModule,
        },
      });
      if (!exam) throw new NotFoundException('Exam not found');

      const questions = await this.prisma.question.findMany({
        where: {
          idExam: idExam,
        },
        include: {
          options: true,
        },
      });

      return questions;
    } catch (error) {
      this.logger.error('Error while searching for questions', error);
    }
  }

  async findOneQuestion(
    idModule: number,
    idExam: number,
    idQuestion: number,
  ): Promise<QuestionResponseDto> {
    try {
      const module = await this.prisma.module.findUnique({
        where: { id: idModule },
      });
      if (!module) throw new NotFoundException('Module not found');

      const exam = await this.prisma.exam.findFirst({
        where: {
          id: idExam,
          idModule: idModule,
        },
      });
      if (!exam) throw new NotFoundException('Exam not found');

      const question = await this.prisma.question.findUnique({
        where: { id: idQuestion },
        include: {
          options: true,
        },
      });

      if (!question) {
        throw new NotFoundException('Question not found');
      }

      return question;
    } catch (error) {
      this.logger.error('Error while fetching question', error);
    }
  }

  async deleteQuestion(idModule: number, idExam: number, idQuestion: number): Promise<void> {
    try {
      const module = await this.prisma.module.findUnique({
        where: { id: idModule },
      });
      if (!module) throw new NotFoundException('Module not found');

      const exam = await this.prisma.exam.findFirst({
        where: {
          id: idExam,
          idModule: idModule,
        },
      });
      if (!exam) throw new NotFoundException('Exam not found');

      const question = await this.prisma.question.findFirst({
        where: {
          id: idQuestion,
          idExam: idExam,
        },
      });
      if (!question)
        throw new NotFoundException('Question not found or does not belong to this exam');

      await this.prisma.questionOptions.deleteMany({
        where: {
          idQuestion: idQuestion,
        },
      });

      await this.prisma.question.delete({
        where: { id: idQuestion },
      });
    } catch (error) {
      this.logger.error('Error while deleting question', error);
    }
  }
}

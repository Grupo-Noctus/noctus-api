import { BadRequestException, Injectable } from '@nestjs/common';
import { QuestionRequestDto } from './dto/question-request.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuestionService {
  constructor(private readonly prisma: PrismaService) {}

  async createQuestion ( dto: QuestionRequestDto, user: number): Promise<boolean> {
    try{
      await this.prisma.question.create({
        
      })

    } catch (error){
      console.error(error);
      throw new BadRequestException();
    }
  }

  findAll() {
    return `This action returns all question`;
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}

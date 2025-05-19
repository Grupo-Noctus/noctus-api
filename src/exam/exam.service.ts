import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ExamRequestDto } from './dto/exam-request.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { handleHttpError } from 'src/utils/handle-http.error';
import { handlePrismaError } from 'src/utils/handle-prisma.error';
import { ExamResponseDto } from './dto/exam-response.dto';

@Injectable()
export class ExamService {
  private readonly logger = new Logger(ExamService.name);

  constructor(private readonly prisma: PrismaService){}

  async createExam(idExam: number, idModule: number,examRequestDto: ExamRequestDto, user: number): Promise<boolean> {
    try{
      
      const module = await this.prisma.module.findUnique({
        where: { id: examRequestDto.idModule }
      });

      if (!module) {
        throw new Error('Module not found');
      }
      
      await this.prisma.exam.create({
        data: { 
          ...examRequestDto,
          createdBy: user, 
          updatedBy: user,
      },
    });
    
    return true;
    } catch (error){
      this.logger.error('Error while creating exam', error);
      handlePrismaError(error);
      handleHttpError(error);      
    }
  }

  async updateExam(idModule: number,idExam: number, updateExamDto: UpdateExamDto, user: number): Promise <boolean> {
    try{
      const exam = await this.prisma.exam.findFirst({
        where: {
          id: idExam,
          idModule: idModule,
        },
      });

      if (!exam) {
        throw new NotFoundException('Exam not found in the specified module');
      }

      await this.prisma.exam.update({
        where: { id: idExam},
        data:{
          ...updateExamDto,
          updatedBy: user
        },
      });

      return true;
    } catch(error){
      this.logger.error('Error while updating exam', error);
      handlePrismaError(error);
      handleHttpError(error);
    }
  } 

  async findManyExams(idModule: number, idExam: number):Promise <ExamResponseDto[]> {
    try{
      const exams = await this.prisma.exam.findMany({
        where: {
          id: idExam,
          idModule: idModule,
        },
        include:{
          questions:{
            include:{
              options: true,
            },
          },
        },
      });

      return exams;
    } catch(error){
    this.logger.error('Error while fetching for exams', error);
    handlePrismaError(error);
    handleHttpError(error);     
    }
  }

  async findOneExam(idModule: number, idExam: number):Promise <ExamResponseDto> {
    try{
      const exams = await this.prisma.exam.findUnique({
        where: { id: idExam },
        include: {
          questions: {
            include: { options: true },
          },
        },
      });

      if(!exams){
        throw new NotFoundException('Exam no found');
      }

      return exams;
    } catch(error){
      this.logger.error('Error while fetching question', error);
      handlePrismaError(error);
      handleHttpError(error);   
    }
  }


  async deleteExam(idModule: number, idExam: number): Promise<void> {
    try{
      const exam = await this.prisma.exam.findFirst({
        where: {
          id: idExam,
          idModule: idModule,
          },
        });

      if (!exam) {
        throw new NotFoundException('Exam not found in this module');
      }

      await this.prisma.exam.delete({
        where: {
          id: idExam
        },
      });

    } catch (error){
      this.logger.error('Error while deleting exam', error);
      handlePrismaError(error);
      handleHttpError(error);     
    }
  }
}

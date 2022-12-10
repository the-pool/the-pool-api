import { Injectable } from '@nestjs/common';
import { prisma, Question, QuestionCategory } from '@prisma/client';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { QuestionDto } from '../dtos/question.dto';

@Injectable()
export class QuestionService {
  constructor(private readonly prismaService: PrismaService) { }

  createQuestion(
    question: QuestionDto,
    memberId: number
  ): Promise<Question> {
    return this.prismaService.question.create({
      data: { ...question, memberId }
    });
  }

  getQuestionCategoryList(): Promise<QuestionCategory[]> {
    return this.prismaService.questionCategory.findMany();
  }


  // getQuestionList(): Promise<[Number, Question[]]> {
  //   return Promise.all([
  //     this.prismaService.question.count(),
  //     this.prismaService.question.findMany({
  //       take: 5,
  //       cursor: {
  //         id: 0,
  //       }
  //     })
  //   ]);
  // }
}

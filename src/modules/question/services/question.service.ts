import { Injectable } from '@nestjs/common';
import { prisma, Question, QuestionCategory } from '@prisma/client';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { CreateQuestionDto } from '../dtos/create-question.dto';

@Injectable()
export class QuestionService {
  constructor(private readonly prismaService: PrismaService) { }

  createQuestion(
    question: CreateQuestionDto,
    memberId: number
  ): Promise<Question> {
    return this.prismaService.question.create({
      data: { ...question, memberId }
    });
  }

  getQuestionList(): Promise<[Number, Question[]]> {
    return this.prismaService.$transaction([
      this.prismaService.question.count(),
      this.prismaService.question.findMany({
        take: 5,
        cursor: {
          id: 0,
        }
      })
    ]);
  }

  getQuestionCategoryList(): Promise<QuestionCategory[]> {
    return this.prismaService.questionCategory.findMany();
  }
}

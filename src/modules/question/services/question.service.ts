import { Injectable } from '@nestjs/common';
import { QuestionCategory } from '@prisma/client';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { CreateQuestionRequestBodyDto } from '../dtos/create-question-request-body.dto';
import { QuestionCategoryEntity } from '../entities/question-category.entity';
import { QuestionEntity } from '../entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    private readonly prismaService: PrismaService
  ) { }

  /**
   * QnA 카테고리 불러오기
   */
  findQuestionCategoryList(): Promise<QuestionCategoryEntity[]> {
    return this.prismaService.questionCategory.findMany();
  }

  /**
   * Question 생성
   */
  createQuestion(
    question: CreateQuestionRequestBodyDto,
    memberId: number
  ): Promise<QuestionEntity> {
    return this.prismaService.question.create({
      data: {
        ...question,
        memberId
      }
    })
  }
}
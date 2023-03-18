import { Injectable } from '@nestjs/common';
import { QuestionCategory } from '@prisma/client';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { QuestionCategoryEntity } from '../entities/question-category.entity';

@Injectable()
export class QuestionService {
  constructor(
    private readonly prismaService: PrismaService
  ) { }

  findQuestionCategoryList(): Promise<QuestionCategoryEntity[]> {
    return this.prismaService.questionCategory.findMany();
  }
}
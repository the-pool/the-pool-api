import { Injectable } from '@nestjs/common';
import { QuestionCategory } from '@prisma/client';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';

@Injectable()
export class QuestionService {
  constructor(
    private readonly prismaService: PrismaService
  ) { }

  getQuestionCategoryList(): Promise<QuestionCategory[]> {
    return this.prismaService.questionCategory.findMany();
  }
}
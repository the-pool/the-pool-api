import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { QuestionCategoryEntity } from '@src/modules/question/entities/question-category.entity';

@Injectable()
export class QuestionService {
  constructor(private readonly prismaService: PrismaService) {}

  findQuestionCategoryList(): Promise<QuestionCategoryEntity[]> {
    return this.prismaService.questionCategory.findMany();
  }
}

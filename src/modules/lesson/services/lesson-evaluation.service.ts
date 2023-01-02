import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';

@Injectable()
export class LessonEvaluationService {
  constructor(private readonly prismaService: PrismaService) {}

  createEvaluation(lessonId: number, memberId: number, levelId: number) {
    return this.prismaService.lessonLevelEvaluation.create({
      data: {
        lessonId,
        memberId,
        levelId,
      },
    });
  }
}

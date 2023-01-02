import { Injectable } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonEvaluationEntity } from '../entities/lesson-evaluation.entity';

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

  async updateEvaluation(
    lessonId: number,
    levelId: number,
    memberId: number,
  ): Promise<LessonEvaluationEntity | {}> {
    await this.prismaService.lessonLevelEvaluation.deleteMany({
      where: {
        lessonId,
        memberId,
      },
    });

    return isNil(levelId)
      ? {}
      : this.createEvaluation(lessonId, memberId, levelId);
  }
}

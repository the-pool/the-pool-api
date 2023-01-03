import { Injectable } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonLevelEvaluationEntity } from '../entities/lesson-level-evaluation.entity';
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
    levelId: number | null,
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

  async readEvaluation(
    lessonId: number,
  ): Promise<LessonLevelEvaluationEntity[]> {
    const countedEvaluations =
      await this.prismaService.lessonLevelEvaluation.groupBy({
        by: ['levelId'],
        _count: {
          lessonId: true,
        },
        where: {
          lessonId,
        },
      });

    const lessonEvaluations: LessonLevelEvaluationEntity[] = [];

    countedEvaluations.forEach((countedEvaluation) => {
      const obj = <LessonLevelEvaluationEntity>{};

      obj['count'] = countedEvaluation._count.lessonId;
      obj['levelId'] = countedEvaluation.levelId;

      lessonEvaluations.push(obj);
    });

    return lessonEvaluations;
  }

  readMemberEvaluation(
    lessonId: number,
    memberId: number | null,
  ): Promise<LessonEvaluationEntity | null> | null {
    if (memberId === null) {
      return null;
    }

    return this.prismaService.lessonLevelEvaluation.findFirst({
      where: { lessonId, memberId },
    });
  }
}

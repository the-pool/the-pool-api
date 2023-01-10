import { Injectable } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonLevelEvaluationEntity } from '../entities/lesson-level-evaluation.entity';
import { LessonEvaluationEntity } from '../entities/lesson-evaluation.entity';
import { LessonEvaluationQueryDto } from '../dtos/evaluation/lesson-evaluation-query.dto';

@Injectable()
export class LessonEvaluationService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * lesson의 체감 난이도 생성
   */
  createEvaluation(lessonId: number, memberId: number, levelId: number) {
    return this.prismaService.lessonLevelEvaluation.create({
      data: {
        lessonId,
        memberId,
        levelId,
      },
    });
  }

  /**
   * lesson의 체감 난이도 변경
   */
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

  /**
   * lesson의 체감 난이도 조회
   */
  async readCountedEvaluation(
    lessonId: number,
  ): Promise<LessonLevelEvaluationEntity[]> {
    const lessonEvaluations =
      await this.prismaService.lessonLevelEvaluation.groupBy({
        by: ['levelId'],
        _count: {
          lessonId: true,
        },
        where: {
          lessonId,
        },
      });

    const countedEvaluation: LessonLevelEvaluationEntity[] = [];

    lessonEvaluations.forEach((lessonEvaluation) => {
      const obj = <LessonLevelEvaluationEntity>{};

      obj['levelId'] = lessonEvaluation.levelId;
      obj['count'] = lessonEvaluation._count.lessonId;

      countedEvaluation.push(obj);
    });

    return countedEvaluation;
  }

  /**
   * lesson의 체감 난이도를 생성한 유저의 체감난이도 조회
   */
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

  readManyEvaluation(
    lessonId: number,
    { memberId, levelId }: LessonEvaluationQueryDto,
  ) {
    return this.prismaService.lessonLevelEvaluation.findMany({
      where: { lessonId, memberId, levelId },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonEvaluationEntity } from '../entities/lesson-evaluation.entity';
import { LessonEvaluationQueryDto } from '../dtos/evaluation/lesson-evaluation-query.dto';
import { LESSON_LEVEL } from '@src/constants/constant';
import { CountEvaluationDto } from '../dtos/evaluation/count-evaluation.dto';

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
  ): Promise<LessonEvaluationEntity | Record<string, never>> {
    await this.prismaService.lessonLevelEvaluation.deleteMany({
      where: {
        memberId,
        lessonId,
      },
    });

    return isNil(levelId)
      ? {}
      : this.createEvaluation(lessonId, memberId, levelId);
  }

  /**
   * lesson의 체감 난이도 조회
   */
  async readCountedEvaluation(lessonId: number): Promise<CountEvaluationDto> {
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

    return lessonEvaluations.reduce((acc, cur) => {
      acc[LESSON_LEVEL[cur.levelId]] = cur._count.lessonId;

      return acc;
    }, <CountEvaluationDto>{});
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
  ): Promise<LessonEvaluationEntity[]> {
    return this.prismaService.lessonLevelEvaluation.findMany({
      where: { lessonId, memberId, levelId },
    });
  }
}

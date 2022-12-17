import { Injectable } from '@nestjs/common';
import { LessonLevelId } from '@src/constants/enum';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { SimilarLessonEntity } from '../entities/similar-lesson.entity';
import { ReadOneLessonDto } from '../dtos/read-one-lesson.dto';
import { SimilarLessonQueryDto } from '../dtos/similar-lesson.dto';
import { Prisma } from '@prisma/client';
import { LessonEntity } from '../entities/lesson.entity';
import { LessonLevelEvaluationEntity } from '../entities/lesson-level-evaluation.entity';

@Injectable()
export class LessonRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 과제 상세 정보 조회 query
   *
   */
  async readOneLesson(
    lessonId: number,
    memberId: number,
  ): Promise<Omit<ReadOneLessonDto, 'lessonLevelEvaluation'>> {
    const result = await this.prismaService.$queryRaw<
      [Omit<ReadOneLessonDto, 'lessonLevelEvaluation'>]
    >`
    SELECT 
        "Lesson"."title" ,
        "Lesson"."description",
        "Lesson"."hit" ,
        "Lesson"."updatedAt",
        "Member"."id" AS "memberId",
        "Member"."nickname",
        "Lesson"."levelId",
        COUNT("LessonSolution"."lessonId") as "solutionCount",
        EXISTS(SELECT "LessonBookmark"."id" 
               FROM "LessonBookmark" 
               WHERE "LessonBookmark"."lessonId" = ${lessonId} AND "LessonBookmark"."memberId" = ${memberId}) AS "isBookmark",
        EXISTS(SELECT "LessonLike"."id" 
               FROM "LessonLike" 
               WHERE "LessonLike"."lessonId" = ${lessonId} AND "LessonLike"."memberId" = ${memberId}) AS "isLike"
    FROM "Lesson"   
    LEFT JOIN "Member" 
      ON "Member"."id" = "Lesson"."memberId"
    LEFT JOIN "LessonSolution"
      ON "LessonSolution"."lessonId" = "Lesson"."id" 
    WHERE "Lesson"."id" = ${lessonId}
    GROUP BY "Lesson"."id","Member"."id"
    `;

    return result[0];
  }

  /**
   * 과제를 수행한 멤버들의 과제 난이도 평가 정보 조회 query
   */
  async readLessonLevelEvaluation(
    lessonId: number,
  ): Promise<LessonLevelEvaluationEntity> {
    const result = await this.prismaService.$queryRaw<
      [LessonLevelEvaluationEntity]
    >`
    SELECT 
    	COUNT(1) FILTER(WHERE "LessonLevelEvaluation"."levelId" = ${LessonLevelId.Top}) AS "top",
    	COUNT(1) FILTER(WHERE "LessonLevelEvaluation"."levelId" =  ${LessonLevelId.Middle}) AS  "middle",
    	COUNT(1) FILTER(WHERE "LessonLevelEvaluation"."levelId" =  ${LessonLevelId.Bottom}) AS  "bottom"
    FROM "LessonLevelEvaluation" 
    WHERE "LessonLevelEvaluation"."lessonId" = ${lessonId}
    `;

    return result[0];
  }

  /**
   * 과제 해시태그 조회 query
   */
  async readLessonHashtag(
    lessonId: number,
  ): Promise<Pick<LessonEntity, 'hashtags'>> {
    const result = await this.prismaService.$queryRaw<
      [Pick<LessonEntity, 'hashtags'>]
    >`
    SELECT 
      ARRAY_AGG(DISTINCT "LessonHashtag"."tag") AS "hashtag" 
    FROM "LessonHashtag" 
    WHERE "LessonHashtag"."lessonId" = ${lessonId}`;

    return result[0];
  }

  /**
   * 유사 과제 조회 query
   */
  async readSimilarLesson(
    lessonId: number,
    memberId: number,
    { sortBy, orderBy, page, pageSize }: SimilarLessonQueryDto,
  ): Promise<SimilarLessonEntity[]> {
    return await this.prismaService.$queryRaw<SimilarLessonEntity[]>`
    SELECT 
      "Lesson"."id",
      "Lesson"."title",
      "Lesson"."hit",
      "LessonBookmark"."memberId" AS "isBookmark",
      COUNT("LessonSolution"."lessonId") as "solutionCount" 
    FROM "Lesson"
    LEFT JOIN "LessonSolution"
      ON "LessonSolution"."lessonId" = "Lesson"."id"
    LEFT JOIN "the-pool-local"."LessonBookmark" 
      ON "Lesson"."id" = "LessonBookmark"."lessonId" and "LessonBookmark"."memberId" = ${memberId}
    WHERE "Lesson"."categoryId" 
      = (SELECT
          "Lesson"."categoryId"
          FROM "Lesson"
          WHERE "Lesson"."id" = ${lessonId}
        ) AND "Lesson"."id" != ${lessonId}
    GROUP BY "Lesson"."id","LessonBookmark"."memberId"
    ORDER BY  ${Prisma.raw(sortBy)} ${Prisma.raw(orderBy)}  
    LIMIT ${pageSize}
    OFFSET ${page} * ${pageSize}
    `;
  }
}

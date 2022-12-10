import { Injectable } from '@nestjs/common';
import { SIMILAR_LESSON } from '@src/constants/constant';
import { LessonLevelId } from '@src/constants/enum';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { SimilarLessonEntity } from '../entities/similar-lesson.entity';
import { LessonLevelEvaluationType } from '../types/lesson.type';
import { ReadOneLessonDto } from '../dtos/read-one-lesson.dto';

/**
 * 이 클레스의 메서드들이 다 raw 쿼리를 사용하고 있는데 우선 any 로 타입에러 대응
 * 작업자가 나중에 타입 만들어서 넣어주길 바람
 */
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
    (BigInt.prototype as any).toJSON = function () {
      return Number(this);
    };

    const result: any = await this.prismaService.$queryRaw`
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
  ): Promise<LessonLevelEvaluationType> {
    const result: any = await this.prismaService.$queryRaw`
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
  async readLessonHashtag(lessonId: number): Promise<string[]> {
    const result: any = await this.prismaService.$queryRaw`
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
  ): Promise<SimilarLessonEntity[]> {
    (BigInt.prototype as any).toJSON = function () {
      return Number(this);
    };
    return await this.prismaService.$queryRaw`
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
    ORDER BY "Lesson"."id" ASC    
    LIMIT ${SIMILAR_LESSON.LIMIT}
    `;
  }
}

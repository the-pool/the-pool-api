import { Injectable } from '@nestjs/common';
import { LessonLevelId } from '@src/constants/enum';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';

@Injectable()
export class LessonRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 과제 상세 정보 조회 query
   */
  readOneLesson(lessonId: number, memberId: number): Promise<any> {
    (BigInt.prototype as any).toJSON = function () {
      return Number(this);
    };

    return this.prismaService.$queryRaw`
    SELECT 
        "Lesson"."title" ,
        "Lesson"."description",
        "Lesson"."hit" ,
        "Lesson"."updatedAt",
        "Member"."id" AS "memberId",
        "Member"."nickname",
        "Lesson"."levelId",
        COUNT("LessonSolution"."lessonId") as "solutionCount",
        ARRAY_AGG(DISTINCT "LessonHashtag"."tag") AS "hashtag",
        EXISTS(SELECT "LessonBookmark"."id" 
               FROM "LessonBookmark" 
               WHERE "LessonBookmark"."lessonId" = ${lessonId} AND "LessonBookmark"."memberId" = ${memberId}) AS "isBookmark",
        EXISTS(SELECT "LessonLike"."id" 
               FROM "LessonLike" 
               WHERE "LessonLike"."lessonId" = ${lessonId} AND "LessonLike"."memberId" = ${memberId}) AS "isLike"
    FROM "Lesson"   
    LEFT JOIN "LessonHashtag"
        ON "LessonHashtag"."lessonId" = "Lesson"."id"
    LEFT JOIN "Member" 
        ON "Member"."id" = "Lesson"."memberId"
    LEFT JOIN "LessonSolution"
        ON "LessonSolution"."lessonId" = "Lesson"."id" 
    WHERE 
        "Lesson"."id" = ${lessonId}
    GROUP BY "Lesson"."id","Member"."id"
    `;
  }

  /**
   * 과제를 수행한 멤버들의 과제 난이도 평가 정보 조회 query
   */
  async lessonLevelEvaluation(lessonId: number): Promise<any> {
    return await this.prismaService.$queryRaw`
    SELECT 
    	COUNT(1) FILTER(WHERE "LessonLevelEvaluation"."levelId" = ${LessonLevelId.Top}) AS "top",
    	COUNT(1) FILTER(WHERE "LessonLevelEvaluation"."levelId" =  ${LessonLevelId.Middle}) AS  "middle",
    	COUNT(1) FILTER(WHERE "LessonLevelEvaluation"."levelId" =  ${LessonLevelId.Bottom}) AS  "bottom"
    FROM "LessonLevelEvaluation" 
    WHERE "LessonLevelEvaluation"."lessonId" = ${lessonId}
    `;
  }
}

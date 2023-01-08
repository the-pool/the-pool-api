import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { SimilarLessonEntity } from '../entities/similar-lesson.entity';
import { ReadOneLessonDto } from '../dtos/lesson/read-one-lesson.dto';
import { SimilarLessonQueryDto } from '../dtos/lesson/similar-lesson-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class LessonRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 과제 상세 정보 조회 query
   *
   */
  async readOneLesson(
    lessonId: number,
    memberId: number | null,
  ): Promise<ReadOneLessonDto> {
    const result = await this.prismaService.$queryRaw<[ReadOneLessonDto]>`
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
   * 유사 과제 조회 query
   */
  readSimilarLesson(
    lessonId: number,
    memberId: number | null,
    { sortBy, orderBy, page, pageSize }: SimilarLessonQueryDto,
  ): Promise<SimilarLessonEntity[]> {
    return this.prismaService.$queryRaw<SimilarLessonEntity[]>`
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

import { Injectable } from '@nestjs/common';
import { LessonLevelId } from '@src/constants/enum';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';

@Injectable()
export class LessonRepository {
  constructor(private readonly prismaService: PrismaService) {}
  readOneLesson(id: number) {
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
        ARRAY_AGG(DISTINCT "LessonHashtag"."tag") AS "hashtag"
    FROM "Lesson"   
    LEFT JOIN "LessonHashtag"
        ON "LessonHashtag"."lessonId" = "Lesson"."id"
    LEFT JOIN "Member" 
        ON "Member"."id" = "Lesson"."memberId"
    LEFT JOIN "LessonSolution"
        ON "LessonSolution"."lessonId" = "Lesson"."id" 
    WHERE 
        "Lesson"."id" = ${id}
    GROUP BY "Lesson"."id","Member"."id"
    `;
  }

  async lessonLevelEvaluation(id: number): Promise<any> {
    return await this.prismaService.$queryRaw`
    select 
    	count(1) filter(where "LessonLevelEvaluation"."levelId" = ${LessonLevelId.Top}) as "top",
    	count(1) filter(where "LessonLevelEvaluation"."levelId" =  ${LessonLevelId.Middle}) as  "middle",
    	count(1) filter(where "LessonLevelEvaluation"."levelId" =  ${LessonLevelId.Bottom}) as  "bottom"
    from "LessonLevelEvaluation" 
    where "LessonLevelEvaluation"."lessonId" = ${id}
    `;
  }

  async lessonLevelEvaluationTest(id: number): Promise<any> {
    return await this.prismaService.$queryRaw`
    select 
	    "LessonLevelEvaluation"."levelId",
    	count("LessonLevelEvaluation"."id") as "count"
    from "LessonLevelEvaluation" 
    where "LessonLevelEvaluation"."lessonId" = ${id}
    group by "LessonLevelEvaluation"."levelId";
    `;
  }
}

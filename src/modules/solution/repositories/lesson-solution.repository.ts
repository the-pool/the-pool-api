import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonSolutionStatisticsResponseBodyDto } from '@src/modules/solution/dtos/lesson-solution-statistics-response-body.dto';

@Injectable()
export class LessonSolutionRepository extends PrismaService {
  findStatisticsByMemberId(
    memberId: number,
  ): Promise<LessonSolutionStatisticsResponseBodyDto[]> {
    return this.$queryRaw<LessonSolutionStatisticsResponseBodyDto[]>`
    select
      SUM (
        case
          when "ls2"."count1" > 0
          then 1
          else 0
          end
      ) as total_day,
      SUM (
        case
          when "ls2"."count2" > 0
          then 1
          else 0
          end
      ) as specific_month_day,
      SUM (
      "ls2"."count1"
      ) as total_count,
      SUM (
      "ls2"."count2"
      ) as specific_month_count
    from
    (
    select
      COUNT(ls.id) as count1,
      COUNT(*) filter (
        where DATE_TRUNC('month', "ls"."createdAt") = DATE_TRUNC('month', CURRENT_DATE)
      ) as count2
    from
      "LessonSolution" as ls
    where
      "ls"."memberId" = ${memberId}
    and
      "ls"."deletedAt" is null
    group by
      DATE_TRUNC('day', "ls"."createdAt")
    ) as ls2;`;
  }
}

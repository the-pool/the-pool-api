import { applyDecorators, SetMetadata, UseInterceptors } from "@nestjs/common";
import { INCREASE_ACTION, MEMBER_STATISTICS_INCREASE_FIELD_NAME } from "@src/constants/constant";
import { MemberStatisticsEntity } from "@src/modules/member-statistics/entities/member-statistics.entity";
import { IncreaseAction } from "@src/types/type";
import { MemberStatistics } from '@prisma/client';
import { IncreaseMemberStatisticsInterceptor } from "@src/interceptors/increase-member-statistics.interceptor";


export const IncreaseMemberSolutionCountInterceptor = (
  action: IncreaseAction
) => {
  return applyDecorators(
    UseInterceptors(IncreaseMemberStatisticsInterceptor),
    SetMetadata(MEMBER_STATISTICS_INCREASE_FIELD_NAME, 'solutionCount'),
    SetMetadata(INCREASE_ACTION, action)
  )
}
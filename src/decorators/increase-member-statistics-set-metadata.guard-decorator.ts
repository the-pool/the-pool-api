import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import {
  INCREASE_ACTION,
  MEMBER_STATISTICS_INCREASE_FIELD_NAME,
} from '@src/constants/constant';
import { IncreaseMemberStatisticsInterceptor } from '@src/interceptors/increase-member-statistics.interceptor';
import { MemberStatisticsIncrementFieldName } from '@src/modules/member-statistics/types/member-statistics.type';
import { IncreaseAction } from '@src/types/type';

/**
 * IncreaseMemberStatisticsInterceptor 를 사용하기 위해 fieldName 메타데이터를 추가해주는 기능을 추가한 데코레이터
 * 1. lesson 작성, 삭제
 * 2. feedback 작성, 삭제
 * 3. comment 작성, 삭제
 *
 * 데코레이터 추가해주세요
 */
export const IncreaseMemberStatisticsSetMetadataGuard = (
  memberReportIncrementFieldName: MemberStatisticsIncrementFieldName,
  action: IncreaseAction,
) => {
  return applyDecorators(
    SetMetadata(
      MEMBER_STATISTICS_INCREASE_FIELD_NAME,
      memberReportIncrementFieldName,
    ),
    SetMetadata(INCREASE_ACTION, action),
    UseInterceptors(IncreaseMemberStatisticsInterceptor),
  );
};

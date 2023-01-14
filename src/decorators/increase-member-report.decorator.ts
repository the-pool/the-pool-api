import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import {
  INCREASE_ACTION,
  MEMBER_REPORT_INCREASE_FIELD_NAME,
} from '@src/constants/constant';
import { IncreaseMemberReportInterceptor } from '@src/interceptors/increase-member-report.interceptor';
import { MemberReportIncrementFieldName } from '@src/modules/member-report/types/member-report.type';
import { IncreaseAction } from '@src/types/type';

/**
 * IncreaseMemberReportInterceptor 를 사용하기 위해 fieldName 메타데이터를 추가해주는 기능을 추가한 데코레이터
 * 1. lesson 작성, 삭제
 * 2. feedback 작성, 삭제
 * 3. comment 작성, 삭제
 *
 * 데코레이터 추가해주세요
 */
export const IncreaseMemberReport = (
  memberReportIncrementFieldName: MemberReportIncrementFieldName,
  action: IncreaseAction,
) => {
  return applyDecorators(
    SetMetadata(
      MEMBER_REPORT_INCREASE_FIELD_NAME,
      memberReportIncrementFieldName,
    ),
    SetMetadata(INCREASE_ACTION, action),
    UseInterceptors(IncreaseMemberReportInterceptor),
  );
};

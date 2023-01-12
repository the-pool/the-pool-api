import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { MEMBER_REPORT_INCREMENT_FIELD_NAME } from '@src/constants/constant';
import { IncrementMemberReportInterceptor } from '@src/interceptors/increment-member-report.interceptor';

/**
 * IncrementMemberReportInterceptor 를 사용하기 위해 fieldName 메타데이터를 추가해주는 기능을 추가한 데코레이터
 */
export const incrementMemberReport = (
  memberReportIncrementFieldName: keyof Omit<
    Prisma.MemberReportUpdateInput,
    'rank' | 'count' | 'member'
  >,
) => {
  return applyDecorators(
    SetMetadata(
      MEMBER_REPORT_INCREMENT_FIELD_NAME,
      memberReportIncrementFieldName,
    ),
    UseInterceptors(IncrementMemberReportInterceptor),
  );
};

import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiSuccessResponse } from '@src/decorators/api-success-response.decorator';
import { MemberReportEntity } from '@src/modules/member-report/entities/member-report.entity';

export const ApiFindAll = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(
      HttpStatus.OK,
      {
        memberReports: {
          type: MemberReportEntity,
          isArray: true,
        },
      },
      {
        totalCount: {
          type: 'number',
        },
      },
    ),
  );
};

export const ApiFindOne = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(HttpStatus.OK, {
      memberReport: {
        type: MemberReportEntity,
      },
    }),
  );
};

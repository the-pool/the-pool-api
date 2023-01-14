import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiSuccessResponse } from '@src/decorators/api-success-response.decorator';
import { MemberInterestEntity } from '@src/modules/member-interest/entities/member-interest.entity';

export const ApiFindAll = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(HttpStatus.OK, {
      memberInterests: {
        type: MemberInterestEntity,
        isArray: true,
      },
    }),
  );
};

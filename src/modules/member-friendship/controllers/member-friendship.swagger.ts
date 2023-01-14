import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiSuccessResponse } from '@src/decorators/api-success-response.decorator';
import { MemberEntity } from '@src/modules/member/entities/member.entity';

export const FindAllFollowers = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(
      HttpStatus.OK,
      {
        followers: {
          type: MemberEntity,
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

export const FindAllFollowings = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(
      HttpStatus.OK,
      {
        followings: {
          type: MemberEntity,
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

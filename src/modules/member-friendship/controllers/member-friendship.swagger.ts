import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { ApiSuccessResponse } from '@src/decorators/api-success-response.decorator';
import { MemberEntity } from '@src/modules/member/entities/member.entity';

export const ApiFindAllFollowers = (summary: string) => {
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

export const ApiFindAllFollowings = (summary: string) => {
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

export const ApiCreateFollowing = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth(),
    ApiSuccessResponse(HttpStatus.OK, {}),
    ApiFailureResponse(HttpStatus.BAD_REQUEST, []),
  );
};

import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { ApiSuccessResponse } from '@src/decorators/api-success-response.decorator';
import { MemberFollowEntity } from '@src/modules/member-friendship/entities/member-follow.entity';
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
    ApiSuccessResponse(HttpStatus.OK, {
      memberFollow: {
        type: MemberFollowEntity,
      },
    }),
    ApiFailureResponse(HttpStatus.UNAUTHORIZED, ['유효하지 않은 토큰입니다.']),
    ApiFailureResponse(HttpStatus.FORBIDDEN, [
      '본인 정보는 접근 불가능합니다.',
      'Active 상태의 유저만 접근 가능합니다.',
      'following 할 멤버가 활성 상태가 아닙니다.',
    ]),
    ApiFailureResponse(HttpStatus.NOT_FOUND, [
      "{memberId} doesn't exist id in member",
      'following 할 멤버가 존재하지 않습니다.',
    ]),
    ApiFailureResponse(HttpStatus.CONFLICT, ['이미 follow 중입니다.']),
  );
};

import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { ApiSuccessResponse } from '@src/decorators/api-success-response.decorator';
import { MemberEntity } from '@src/modules/member/entities/member.entity';

export const ApiGetAccessTokenForDevelop = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiParam({
      name: 'id',
      type: 'string',
    }),
  );
};

export const ApiFindOne = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(HttpStatus.OK, {
      member: {
        type: MemberEntity,
      },
    }),
  );
};

export const ApiLoginOrSignUp = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(
      HttpStatus.CREATED,
      {
        member: {
          type: MemberEntity,
        },
      },
      {
        accessToken: {
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTI1LCJpYXQiOjE2NjQ4OTA4ODcsImV4cCI6MTk4MDQ2Njg4N30.BRWIIE2pv1L0lzmw4KlCqRZZZo3CT8bsgHekpfzUe38',
          description: 'the-pool 고유 accessToken',
          type: 'string',
        },
      },
    ),
    ApiFailureResponse(HttpStatus.BAD_REQUEST, ['이미 존재하는 유저입니다.']),
    ApiFailureResponse(HttpStatus.UNAUTHORIZED, ['유효하지 않은 토큰입니다.']),
    ApiFailureResponse(HttpStatus.FORBIDDEN, [
      'pending 상태의 유저 입니다.',
      '비활성된 유저입니다.',
    ]),
    ApiFailureResponse(HttpStatus.NOT_FOUND, ['존재하지 않는 member 입니다.']),
  );
};

export const ApiUpdateFromPatch = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth(),
    ApiSuccessResponse(HttpStatus.OK, {
      member: {
        type: MemberEntity,
      },
    }),
    ApiFailureResponse(HttpStatus.UNAUTHORIZED, ['Unauthorized']),
  );
};

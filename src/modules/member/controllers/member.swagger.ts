import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { ApiSuccessResponse } from '@src/decorators/api-success-response.decorator';
import { MajorEntityV2 } from '@src/modules/major/entities/major.entity.v2';
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
    ApiFailureResponse(HttpStatus.BAD_REQUEST, [
      '활성중인 유저거나 활성 상태로 변경하려는 유저만 업데이트 가능합니다.',
    ]),
    ApiFailureResponse(HttpStatus.UNAUTHORIZED, ['Unauthorized']),
    ApiFailureResponse(HttpStatus.FORBIDDEN, [
      '본인 정보만 접근 가능합니다.',
      'Pending, Active 상태의 유저만 접근 가능합니다.',
    ]),
    ApiFailureResponse(HttpStatus.CONFLICT, ['해당 nickname 은 사용중입니다.']),
  );
};

export const ApiMappingMajor = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth(),
    ApiExtraModels(MajorEntityV2),
    ApiCreatedResponse({
      schema: {
        properties: {
          member: {
            $ref: getSchemaPath(MemberEntity),
            properties: {
              major: {
                $ref: getSchemaPath(MajorEntityV2),
              },
            },
          },
        },
      },
    }),
  );
};

export const ApiMappingMajorSkill = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth(),
    ApiSuccessResponse(
      HttpStatus.CREATED,
      {},
      {
        count: {
          type: 'number',
          description: 'member 와 연결 성공된 majorSkill 개수',
          minimum: 1,
        },
      },
    ),
    ApiFailureResponse(HttpStatus.BAD_REQUEST, [
      'majorSkill 중 major 에 속하지 않은 skill 이 존재합니다.',
      '이미 존재하는 member 의 majorSkill 이 존재합니다.',
    ]),
    ApiFailureResponse(HttpStatus.UNAUTHORIZED, ['유효하지 않은 토큰입니다.']),
    ApiFailureResponse(HttpStatus.FORBIDDEN, [
      '본인 정보만 접근 가능합니다.',
      'Pending, Active 상태의 유저만 접근 가능합니다.',
      '유저의 major 와 다른 major 는 접근이 불가능합니다.',
    ]),
    ApiFailureResponse(
      HttpStatus.NOT_FOUND,
      '존재하지 않는 majorSkill 이 존재합니다.',
    ),
  );
};

export const ApiMappingMemberInterests = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth(),
    ApiSuccessResponse(
      HttpStatus.CREATED,
      {},
      {
        count: {
          type: 'number',
          description: 'member 와 연결 성공된 memberInterest 개수',
          minimum: 1,
        },
      },
    ),
    ApiFailureResponse(HttpStatus.BAD_REQUEST, [
      '이미 존재하는 member 의 memberInterest 가 존재합니다.',
    ]),
    ApiFailureResponse(HttpStatus.UNAUTHORIZED, ['유효하지 않은 토큰입니다.']),
    ApiFailureResponse(HttpStatus.FORBIDDEN, [
      '본인 정보만 접근 가능합니다.',
      'Active 상태의 유저만 접근 가능합니다.',
    ]),
    ApiFailureResponse(
      HttpStatus.NOT_FOUND,
      "{memberInterestIds} doesn't exist id in majorInterest",
    ),
  );
};

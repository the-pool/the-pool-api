import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { HTTP_ERROR_MESSAGE } from '@src/constants/constant';
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { LessonLikeEntity } from '../entities/lesson-like.entity';

export const ApiCreateLike = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiExtraModels(LessonLikeEntity),
    ApiCreatedResponse({
      schema: {
        properties: {
          lessonLike: {
            $ref: getSchemaPath(LessonLikeEntity),
          },
        },
      },
    }),
    ApiFailureResponse(
      HttpStatus.BAD_REQUEST,
      'lessonLike에 중복된 관계를 추가할 수 없습니다.',
    ),
    ApiFailureResponse(
      HttpStatus.FORBIDDEN,
      'Active 상태의 유저만 접근 가능합니다.',
    ),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
};

export const ApiDeleteLike = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      schema: {
        properties: {
          lessonLike: {
            $ref: getSchemaPath(LessonLikeEntity),
          },
        },
      },
    }),
    ApiFailureResponse(
      HttpStatus.FORBIDDEN,
      'Active 상태의 유저만 접근 가능합니다.',
    ),
    ApiFailureResponse(HttpStatus.NOT_FOUND, [
      HTTP_ERROR_MESSAGE.NOT_FOUND,
      'lessonLike에 존재하지 않는 관계 입니다.',
    ]),
  );
};

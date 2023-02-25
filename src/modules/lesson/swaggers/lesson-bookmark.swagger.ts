import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { HTTP_ERROR_MESSAGE } from '@src/constants/constant';
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { LessonBookmarkEntity } from '../entities/lesson-bookmark.entity';

export const ApiCreateBookmark = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiExtraModels(LessonBookmarkEntity),
    ApiCreatedResponse({
      schema: {
        properties: {
          lessonBookmark: {
            $ref: getSchemaPath(LessonBookmarkEntity),
          },
        },
      },
    }),
    ApiFailureResponse(
      HttpStatus.BAD_REQUEST,
      'lessonBookmark에 중복된 관계를 추가할 수 없습니다.',
    ),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
};

export const ApiDeleteBookmark = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiCreatedResponse({
      schema: {
        properties: {
          lessonBookmark: {
            $ref: getSchemaPath(LessonBookmarkEntity),
          },
        },
      },
    }),
    ApiFailureResponse(HttpStatus.NOT_FOUND, [
      HTTP_ERROR_MESSAGE.NOT_FOUND,
      'lessonBookmark에 존재하지 않는 관계 입니다.',
    ]),
  );
};

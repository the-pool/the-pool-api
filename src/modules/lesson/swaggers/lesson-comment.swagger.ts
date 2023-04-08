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
import { ApiSuccessResponse } from '@src/decorators/api-success-response.decorator';
import { LessonCommentEntity } from '../entities/lesson-comment.entity';

export const ApiCreateComment = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiExtraModels(LessonCommentEntity),
    ApiCreatedResponse({
      schema: {
        properties: {
          lessonComment: {
            $ref: getSchemaPath(LessonCommentEntity),
          },
        },
      },
    }),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
};

export const ApiDeleteComment = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiExtraModels(LessonCommentEntity),
    ApiOkResponse({
      schema: {
        properties: {
          lessonComment: {
            $ref: getSchemaPath(LessonCommentEntity),
          },
        },
      },
    }),
    ApiFailureResponse(HttpStatus.FORBIDDEN, [
      HTTP_ERROR_MESSAGE.FORBIDDEN,
      'Active 상태의 유저만 접근 가능합니다.',
    ]),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
};

export const ApiUpdateComment = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiExtraModels(LessonCommentEntity),
    ApiOkResponse({
      schema: {
        properties: {
          lessonComment: {
            $ref: getSchemaPath(LessonCommentEntity),
          },
        },
      },
    }),
    ApiFailureResponse(HttpStatus.FORBIDDEN, [
      HTTP_ERROR_MESSAGE.FORBIDDEN,
      'Active 상태의 유저만 접근 가능합니다.',
    ]),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
};

export const ApiReadManyComment = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiExtraModels(LessonCommentEntity),
    ApiSuccessResponse(HttpStatus.OK, {
      lessonComments: { type: LessonCommentEntity, isArray: true },
    }),
  );
};

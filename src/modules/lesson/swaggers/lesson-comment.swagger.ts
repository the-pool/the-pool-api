import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { HTTP_ERROR_MESSAGE } from '@src/constants/constant';
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { LessonCommentEntity } from '../entities/lesson-comment.entity';

export const ApiCreateComment = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiExtraModels(LessonCommentEntity),
    ApiCreatedResponse({
      schema: {
        properties: {
          comment: {
            $ref: getSchemaPath(LessonCommentEntity),
          },
        },
      },
    }),
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
  );
};

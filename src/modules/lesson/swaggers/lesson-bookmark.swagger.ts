import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
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
    ApiFailureResponse(HttpStatus.NOT_FOUND, HTTP_ERROR_MESSAGE.NOT_FOUND),
    ApiFailureResponse(HttpStatus.CONFLICT, HTTP_ERROR_MESSAGE.CONFLICT),
  );
};

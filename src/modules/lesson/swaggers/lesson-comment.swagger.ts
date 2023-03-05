import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
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
  );
};

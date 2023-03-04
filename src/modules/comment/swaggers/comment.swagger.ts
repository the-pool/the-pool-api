import { applyDecorators } from '@nestjs/common';
import { Reflector, RouterModule } from '@nestjs/core';
import {
  ApiCreatedResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { LessonCommentEntity } from '../entities/lesson-comment.entity';

export const ApiCreateComment = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
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

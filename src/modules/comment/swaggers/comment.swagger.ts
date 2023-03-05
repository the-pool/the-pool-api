import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOperation,
} from '@nestjs/swagger';
import { LessonCommentEntity } from '../entities/lesson-comment.entity';

const lessonComment: LessonCommentEntity = {
  id: 1,
  memberId: 1,
  lessonId: 1,
  description: '과제의 댓글',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
} as const;

export const ApiCreateComment = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiCreatedResponse({
      description: '댓글 생성 성공 응답',
      content: {
        'application/json': {
          examples: {
            LessonComment: {
              value: {
                comment: lessonComment,
              },
            },
          },
        },
      },
    }),
  );
};

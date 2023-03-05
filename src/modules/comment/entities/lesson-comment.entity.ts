import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { LessonComment } from '@prisma/client';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';
import { CommentEntity } from './comment.entity';

export class LessonCommentEntity
  extends IntersectionType(
    IntersectionType(IdResponseType, DateResponseType),
    CommentEntity,
  )
  implements LessonComment
{
  @ApiProperty({
    description: '댓글이 달린 과제 고유 ID',
    example: 1,
  })
  lessonId: number;
}

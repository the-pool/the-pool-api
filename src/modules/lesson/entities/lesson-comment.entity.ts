import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { LessonComment } from '@prisma/client';
import { CommentBaseEntity } from '@src/modules/comment/entities/comment.entity';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class LessonCommentEntity
  extends IntersectionType(
    IntersectionType(IdResponseType, DateResponseType),
    CommentBaseEntity,
  )
  implements LessonComment
{
  @ApiProperty({
    description: '댓글이 달린 과제 고유 ID',
    example: 1,
  })
  lessonId: number;
}

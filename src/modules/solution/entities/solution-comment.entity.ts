import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { LessonSolutionComment } from '@prisma/client';
import { CommentBaseEntity } from '@src/modules/comment/entities/comment.entity';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class SolutionCommentEntity
  extends IntersectionType(
    IntersectionType(IdResponseType, DateResponseType),
    CommentBaseEntity,
  )
  implements LessonSolutionComment
{
  @ApiProperty({
    description: '댓글이 달린 문제-풀이 고유 ID',
    example: 1,
  })
  lessonSolutionId: number;
}

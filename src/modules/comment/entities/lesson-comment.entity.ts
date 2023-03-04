import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { LessonComment } from '@prisma/client';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class LessonCommentEntity
  extends IntersectionType(IdResponseType, DateResponseType)
  implements LessonComment
{
  @ApiProperty({
    description: '과제에 달린 댓글',
    example: '댓글입니다.',
  })
  description: string;

  @ApiProperty({
    description: '댓글을 작성한 멤버 고유 ID',
    example: 1,
  })
  memberId: number;

  @ApiProperty({
    description: '댓글이 달린 과제 고유 ID',
    example: 1,
  })
  lessonId: number;
}

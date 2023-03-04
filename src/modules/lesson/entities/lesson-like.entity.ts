import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { LessonLike } from '@prisma/client';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class LessonLikeEntity
  extends IntersectionType(
    IdResponseType,
    PickType(DateResponseType, ['createdAt']),
  )
  implements LessonLike
{
  @ApiProperty({
    description: '과제를 좋아요한 멤버 고유 ID',
    example: 1,
  })
  memberId: number;

  @ApiProperty({
    example: 1,
    description: 'lesson의 고유 ID',
  })
  lessonId: number;
}

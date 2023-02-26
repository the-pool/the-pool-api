import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { LessonBookmark } from '@prisma/client';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class LessonBookmarkEntity
  extends IntersectionType(
    IdResponseType,
    PickType(DateResponseType, ['createdAt']),
  )
  implements LessonBookmark
{
  @ApiProperty({
    description: '과제를 북마크한 멤버 고유 ID',
    example: 1,
  })
  memberId: number;

  @ApiProperty({
    example: 1,
    description: 'lesson의 고유 ID',
  })
  lessonId: number;
}

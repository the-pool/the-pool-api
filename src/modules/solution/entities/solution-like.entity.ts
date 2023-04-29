import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { LessonSolutionLike } from '@prisma/client';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class SolutionLikeEntity
  extends IntersectionType(
    IdResponseType,
    PickType(DateResponseType, ['createdAt']),
  )
  implements LessonSolutionLike
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
  lessonSolutionId: number;
}

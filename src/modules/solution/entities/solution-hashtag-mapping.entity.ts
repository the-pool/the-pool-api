import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { LessonSolutionHashtagMapping } from '@prisma/client';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class SolutionHashtagMappingEntity
  extends IntersectionType(
    IdResponseType,
    PickType(DateResponseType, ['createdAt']),
  )
  implements LessonSolutionHashtagMapping
{
  @ApiProperty({
    description: '연결된 문제-해결 고유 id',
  })
  lessonSolutionId: number;

  @ApiProperty({
    description: '연결된 해시태그 고유 id',
  })
  lessonSolutionHashtagId: number;
}

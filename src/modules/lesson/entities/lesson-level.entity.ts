import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { LessonLevel } from '@prisma/client';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class LessonLevelEntity
  extends IntersectionType(
    IdResponseType,
    PickType(DateResponseType, ['createdAt']),
  )
  implements LessonLevel
{
  @ApiProperty({
    description: '과제의 난이도',
    example: '상, 중, 하',
  })
  level: string;
}

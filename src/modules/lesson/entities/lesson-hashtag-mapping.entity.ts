import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { LessonHashtagMapping } from '@prisma/client';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class LessonHashtagMappingEntity
  extends IntersectionType(
    IdResponseType,
    PickType(DateResponseType, ['createdAt']),
  )
  implements LessonHashtagMapping
{
  @ApiProperty({
    example: 1,
    description: 'lesson hashtag에 해당하는 tag의 고유 ID',
  })
  lessonHashtagId: number;

  @ApiProperty({
    example: 1,
    description: 'lesson의 고유 ID',
  })
  lessonId: number;
}

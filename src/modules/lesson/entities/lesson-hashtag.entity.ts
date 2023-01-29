import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { LessonHashtag } from '@prisma/client';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class LessonHashtagEntity
  extends IntersectionType(
    IdResponseType,
    PickType(DateResponseType, ['createdAt']),
  )
  implements LessonHashtag
{
  @ApiProperty({
    example: 'the-pool',
    description: 'hashtag의 tag 이름',
  })
  tag: string;
}

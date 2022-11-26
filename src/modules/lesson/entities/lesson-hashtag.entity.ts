import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { LessonHashtag } from '@prisma/client';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class LessonHashtagEntity
  extends IntersectionType(IdResponseType, DateResponseType)
  implements LessonHashtag
{
  @ApiProperty({
    example: 1,
    description: 'hashtag에 해당하는 lesson의 고유 ID',
  })
  lessonId: number;

  @ApiProperty({
    example: 'the-pool',
    description: 'hashtag',
  })
  tag: string;
}

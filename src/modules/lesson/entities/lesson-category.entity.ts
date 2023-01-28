import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { LessonCategory } from '@prisma/client';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class LessonCategoryEntity
  extends IntersectionType(
    IdResponseType,
    PickType(DateResponseType, ['createdAt']),
  )
  implements LessonCategory
{
  @ApiProperty({
    example: '백엔드개발',
    description: '과제 카테고리 이름',
  })
  name: string;
}

import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { LessonLevelEvaluation } from '@prisma/client';
import { getEntriesByEnum } from '@src/common/common';
import { LessonLevelId } from '@src/constants/enum';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class LessonEvaluationEntity
  extends IntersectionType(IdResponseType, DateResponseType)
  implements LessonLevelEvaluation
{
  @ApiProperty({
    example: 1,
    description: '과제를 수행한 member의 고유 ID',
  })
  memberId: number;

  @ApiProperty({
    example: 1,
    description: '수행된 lesson의 고유 ID',
  })
  lessonId: number;

  @ApiProperty({
    description: '과제를 풀이한 사람이 느끼는 난이도',
    example: LessonLevelId.Top,
    enum: getEntriesByEnum(LessonLevelId),
  })
  levelId: number;
}

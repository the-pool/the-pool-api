import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { LessonSolution, LessonSolutionHashtag } from '@prisma/client';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';

export class SolutionHashtagEntity
  extends IntersectionType(IdResponseType, DateResponseType)
  implements LessonSolutionHashtag
{
  @ApiProperty({
    description: '태그 고유 Id',
  })
  tag: string;
}

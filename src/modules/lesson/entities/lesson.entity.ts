import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { getValueByEnum } from '@src/common/common';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';
import { Lesson as LessonModel } from '@prisma/client';
import { LessonLevelId } from '@src/constants/enum';

export class LessonEntity
  extends IntersectionType(IdResponseType, DateResponseType)
  implements LessonModel
{
  @ApiProperty({
    example: 1,
    description: '출제자가 생각한 과제의 난이도 {상 : 1, 중 : 2, 하 : 3}',
    required: true,
    type: 'number',
    enum: getValueByEnum(LessonLevelId, 'number'),
  })
  levelId: number;

  @ApiProperty({
    example: 'title',
    description: '과제의 제목',
    required: true,
    type: 'string',
  })
  title: string;

  @ApiProperty({
    example: 'description',
    description: '과제의 설명',
    required: true,
    type: 'string',
  })
  description: string;

  @ApiProperty({
    example: 100,
    description: '과제의 조회수',
    required: false,
    type: 'number',
  })
  hit: number;
}

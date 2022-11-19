import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';
import { getEntriesByEnum } from '@src/common/common';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';
import { Lesson } from '@prisma/client';
import { LessonLevelId } from '@src/constants/enum';
import { LessonHashtagEntity } from './lesson-hashtag.entity';
import { titleLength } from '@src/constants/constant';

export class LessonEntity
  extends IntersectionType(IdResponseType, DateResponseType)
  implements Lesson
{
  @ApiProperty({
    description: '출제자가 생각한 과제의 난이도',
    example: LessonLevelId.Top,
    enum: getEntriesByEnum(LessonLevelId),
  })
  levelId: LessonLevelId;

  @ApiProperty({
    description: '과제의 제목',
    example: 'title',
    minLength: titleLength.MIN,
    maxLength: titleLength.MAX,
  })
  title: string;

  @ApiProperty({
    description: '과제의 설명',
    example: 'description',
  })
  description: string;

  @ApiProperty({
    description: '과제의 조회수',
    example: 100,
  })
  hit: number;

  @ApiPropertyOptional({
    description: '과제의 썸네일',
    example: 'the-pool.png',
  })
  thumbnail: string;

  @ApiProperty({
    description: '과제를 생성한 멤버 고유 ID',
    example: 1,
  })
  memberId: number;

  @ApiPropertyOptional({
    description: '과제의 hashtag entity',
  })
  tags?: LessonHashtagEntity[];
}

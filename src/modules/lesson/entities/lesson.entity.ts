import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';
import { Lesson } from '@prisma/client';
import { getEntriesByEnum } from '@src/common/common';
import { LESSON_TITLE_LENGTH } from '@src/constants/constant';
import { LessonCategoryId, LessonLevelId } from '@src/constants/enum';
import { DateResponseType } from '@src/types/date-response.type';
import { IdResponseType } from '@src/types/id-response-type';
import { LessonHashtagEntity } from './lesson-hashtag.entity';

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
    minLength: LESSON_TITLE_LENGTH.MIN,
    maxLength: LESSON_TITLE_LENGTH.MAX,
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

  @ApiProperty({
    description: '과제의 썸네일',
    example: 'the-pool.png',
  })
  thumbnail: string | null;

  @ApiProperty({
    description: '과제를 생성한 멤버 고유 ID',
    example: 1,
  })
  memberId: number;

  @ApiProperty({
    description: '과제의 카테고리 고유 ID',
    example: LessonCategoryId.Backend,
    enum: getEntriesByEnum(LessonCategoryId),
  })
  categoryId: LessonCategoryId;

  @ApiPropertyOptional({
    description: '과제의 hashtag entity',
    example: [{ name: 'a' }, { name: 'b' }, { name: 'c' }],
  })
  hashtags?: { id: number; name: string }[];
}

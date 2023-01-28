import { ApiProperty } from '@nestjs/swagger';
import { setObjectValuesToNumber } from '@src/common/common';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { LESSON_VIRTUAL_COLUMN_FOR_READ_MANY } from '../../constants/lesson.const';
import { LessonCategoryEntity } from '../../entities/lesson-category.entity';
import { LessonEntity } from '../../entities/lesson.entity';

export class ReadManyLessonDto extends LessonEntity {
  @ApiProperty({
    description: '과제 출제자',
    type: MemberEntity,
  })
  member: MemberEntity;

  @ApiProperty({
    description: '과제의 카테고리',
    type: LessonCategoryEntity,
  })
  lessonCategory: LessonCategoryEntity;

  @ApiProperty({
    description: '과제의 좋아요, 댓글, 과제물 수',
    example: setObjectValuesToNumber(
      LESSON_VIRTUAL_COLUMN_FOR_READ_MANY,
      1,
      100,
    ),
  })
  _count: {
    [key in keyof typeof LESSON_VIRTUAL_COLUMN_FOR_READ_MANY]: number;
  };
}

import { ApiProperty, PickType } from '@nestjs/swagger';
import { LessonLevelId } from '@src/constants/enum';
import { LessonBookmarkEntity } from '@src/modules/lesson/entities/lesson-bookmark.entity';
import { LessonCategoryEntity } from '@src/modules/lesson/entities/lesson-category.entity';
import { LessonLevelEntity } from '@src/modules/lesson/entities/lesson-level.entity';
import { LessonLikeEntity } from '@src/modules/lesson/entities/lesson-like.entity';
import { LessonEntity } from '@src/modules/lesson/entities/lesson.entity';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { Exclude, Expose } from 'class-transformer';

export class ReadOneLessonDto extends PickType(LessonEntity, [
  'title',
  'description',
  'hit',
  'createdAt',
  'updatedAt',
  'deletedAt',
]) {
  @Exclude()
  memberId: number;

  @ApiProperty({
    description: '과제 출제자 정보',
    type: MemberEntity,
  })
  member: MemberEntity;

  @Exclude()
  categoryId: number;

  @ApiProperty({
    description: '과제의 카테고리',
    type: LessonCategoryEntity,
  })
  lessonCategory: LessonCategoryEntity;

  @Exclude()
  levelId: LessonLevelId;

  @ApiProperty({
    description: '과제의 난이도',
    type: LessonLevelEntity,
  })
  lessonLevel: LessonLevelEntity;

  @Exclude({ toPlainOnly: true })
  lessonBookMarks?: LessonBookmarkEntity[] | null;
  @Exclude({ toPlainOnly: true })
  lessonLikes?: LessonLikeEntity[] | null;

  @ApiProperty({
    example: true,
    description: '멤버의 과제 북마크 여부',
  })
  @Expose()
  get isBookmark(): boolean {
    return !!this.lessonBookMarks?.length;
  }

  @ApiProperty({
    example: true,
    description: '멤버의 과제 좋아요 여부',
  })
  @Expose()
  get isLike(): boolean {
    return !!this.lessonLikes?.length;
  }
}

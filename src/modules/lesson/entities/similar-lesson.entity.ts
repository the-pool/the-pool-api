import { ApiProperty, PickType } from '@nestjs/swagger';
import { LessonEntity } from '@src/modules/lesson/entities/lesson.entity';
import { Transform, Type } from 'class-transformer';

export class SimilarLessonEntity extends PickType(LessonEntity, [
  'title',
  'hit',
  'id',
]) {
  @ApiProperty({
    example: true,
    description: '멤버의 과제 북마크 여부',
  })
  @Transform(({ value }) => !!value)
  isBookmark: boolean | number;

  @ApiProperty({
    example: 10,
    description: '제출된 과제물 수',
  })
  @Type(() => Number)
  solutionCount: number;
}

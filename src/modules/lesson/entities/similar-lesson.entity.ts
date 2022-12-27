import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { LessonEntity } from './lesson.entity';

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

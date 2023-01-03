import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { LessonEntity } from '../../entities/lesson.entity';

export class ReadOneLessonDto extends PickType(LessonEntity, [
  'title',
  'description',
  'hit',
  'updatedAt',
  'memberId',
]) {
  @ApiProperty({
    example: 'the-pool',
    description: '멤버 닉네임',
  })
  nickname: string;

  @ApiProperty({
    example: 10,
    description: '제출된 과제물 수',
  })
  @Type(() => Number)
  solutionCount: number;

  @ApiProperty({
    example: 1,
    description: '출제자가 생각한 과제의 난이도',
  })
  levelId: number;

  @ApiProperty({
    example: true,
    description: '멤버의 과제 북마크 여부',
  })
  isBookmark: boolean;

  @ApiProperty({
    example: true,
    description: '멤버의 과제 좋아요 여부',
  })
  isLike: boolean;
}

import { ApiProperty, PickType } from '@nestjs/swagger';
import { LessonEntity } from '../../entities/lesson.entity';

export class ReadOneLessonResponseType extends PickType(LessonEntity, [
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
  solutionCount: number;

  @ApiProperty({
    example: ['a', 'b', 'c'],
    description: '과제의 해시태그',
  })
  tags: string[];

  @ApiProperty({
    example: '중',
    description: '출제자가 생각한 과제의 난이도',
  })
  level: string;

  @ApiProperty({
    example: {
      상: 1,
      중: 5,
      하: 10,
    },
    description: '과제를 완료한 사람이 평가한 과제의 난이도',
  })
  lessonLevelEvaluation: any;
}

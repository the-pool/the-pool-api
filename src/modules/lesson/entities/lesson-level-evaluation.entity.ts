import { ApiProperty, PickType } from '@nestjs/swagger';
import { LessonEvaluationEntity } from './lesson-evaluation.entity';

export class LessonLevelEvaluationEntity extends PickType(
  LessonEvaluationEntity,
  ['levelId'],
) {
  @ApiProperty({
    example: 10,
    description: '평가된 갯수',
  })
  count: number;
}

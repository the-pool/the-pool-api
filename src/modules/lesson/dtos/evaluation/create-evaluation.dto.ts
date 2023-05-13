import { PickType } from '@nestjs/swagger';
import { LessonLevelId } from '@src/constants/enum';
import { LessonEvaluationEntity } from '@src/modules/lesson/entities/lesson-evaluation.entity';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateEvaluationDto extends PickType(LessonEvaluationEntity, [
  'levelId',
]) {
  @IsEnum(LessonLevelId)
  @IsNotEmpty()
  levelId: LessonLevelId;
}

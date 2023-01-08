import { PickType } from '@nestjs/swagger';
import { LessonLevelId } from '@src/constants/enum';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { LessonEvaluationEntity } from '../../entities/lesson-evaluation.entity';

export class CreateEvaluationDto extends PickType(LessonEvaluationEntity, [
  'levelId',
]) {
  @IsEnum(LessonLevelId)
  @IsNotEmpty()
  levelId: LessonLevelId;
}

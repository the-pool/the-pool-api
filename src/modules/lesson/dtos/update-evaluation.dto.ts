import { LessonLevelId } from '@src/constants/enum';
import { IsOptional } from 'class-validator';
import { CreateEvaluationDto } from './create-evaluation.dto';

export class UpdateEvaluationDto extends CreateEvaluationDto {
  @IsOptional()
  levelId: LessonLevelId;
}

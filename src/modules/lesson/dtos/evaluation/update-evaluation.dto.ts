import { ApiPropertyOptional } from '@nestjs/swagger';
import { getEntriesByEnum } from '@src/common/common';
import { LessonLevelId } from '@src/constants/enum';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateEvaluationDto } from './create-evaluation.dto';

export class UpdateEvaluationDto extends CreateEvaluationDto {
  @ApiPropertyOptional({
    example: LessonLevelId.Top,
    description: '과제를 수행한 member가 느끼는 과제의 난이도',
    enum: getEntriesByEnum(LessonLevelId),
  })
  @IsEnum(LessonLevelId)
  @IsOptional()
  levelId: LessonLevelId;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { getEntriesByEnum, getValueByEnum } from '@src/common/common';
import { LessonLevelId } from '@src/constants/enum';
import { IsEnum, IsIn, IsOptional } from 'class-validator';

export class UpdateEvaluationDto {
  @ApiPropertyOptional({
    example: LessonLevelId.Top,
    description: '과제를 수행한 member가 느끼는 과제의 난이도',
    enum: getEntriesByEnum(LessonLevelId),
  })
  @IsEnum(LessonLevelId)
  @IsOptional()
  levelId: LessonLevelId | null = null;
}

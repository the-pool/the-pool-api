import { ApiProperty } from '@nestjs/swagger';
import { getEntriesByEnum } from '@src/common/common';
import { LessonLevelId } from '@src/constants/enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateEvaluationDto {
  @ApiProperty({
    description: '과제를 풀이한 사람이 느끼는 난이도',
    example: LessonLevelId.Top,
    enum: getEntriesByEnum(LessonLevelId),
  })
  @IsEnum(LessonLevelId)
  @IsNotEmpty()
  levelId: LessonLevelId;
}

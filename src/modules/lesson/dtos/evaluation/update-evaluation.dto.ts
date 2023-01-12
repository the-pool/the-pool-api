import { ApiProperty } from '@nestjs/swagger';
import { LessonLevelId } from '@src/constants/enum';
import { IsOptional } from 'class-validator';
import { CreateEvaluationDto } from './create-evaluation.dto';

export class UpdateEvaluationDto extends CreateEvaluationDto {
  @ApiProperty({
    example: 1,
    description: '과제를 수행한 member가 느끼는 과제의 난이도',
  })
  @IsOptional()
  levelId: LessonLevelId;
}

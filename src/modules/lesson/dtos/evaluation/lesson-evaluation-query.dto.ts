import { ApiPropertyOptional } from '@nestjs/swagger';
import { Member } from '@prisma/client';
import { getValueByEnum } from '@src/common/common';
import { LessonLevelId } from '@src/constants/enum';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class LessonEvaluationQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description: '과제를 수행한 member의 고유 ID',
  })
  @IsOptional()
  @IsRecord<Member>({ model: 'member', field: 'id' }, true)
  @Min(1)
  @IsInt()
  @Type(() => Number)
  memberId?: number;

  @ApiPropertyOptional({
    description: '과제를 풀이한 사람이 느끼는 난이도 Top:1, Middle:2, Bottom:3',
    enum: getValueByEnum(LessonLevelId, 'number'),
  })
  @IsOptional()
  @IsEnum(LessonLevelId)
  @Type(() => Number)
  levelId?: LessonLevelId;
}

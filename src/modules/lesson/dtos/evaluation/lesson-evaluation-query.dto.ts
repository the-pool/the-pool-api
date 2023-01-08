import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Member } from '@prisma/client';
import { LessonLevelId } from '@src/constants/enum';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, Min } from 'class-validator';
import { LessonEvaluationEntity } from '../../entities/lesson-evaluation.entity';

export class LessonEvaluationQueryDto extends PickType(LessonEvaluationEntity, [
  'memberId',
  'levelId',
]) {
  @IsOptional()
  @Min(1)
  @IsRecord<Member>({ model: 'member', field: 'id' }, true)
  @Type(() => Number)
  memberId: number;

  @IsOptional()
  @IsEnum(LessonLevelId)
  @Type(() => Number)
  levelId: LessonLevelId;
}

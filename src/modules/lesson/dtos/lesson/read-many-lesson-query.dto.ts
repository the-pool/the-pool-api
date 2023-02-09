import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { LessonCategory } from '@prisma/client';
import { getStrMapByEnum, getValueByEnum } from '@src/common/common';
import {
  EntityDate,
  EntityId,
  LessonCategoryId,
  ModelName,
} from '@src/constants/enum';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { LESSON_VIRTUAL_COLUMN_FOR_READ_MANY } from '../../constants/lesson.const';
import { LessonDto } from './lesson.dto';

export class ReadManyLessonQueryDto extends PickType(LessonDto, [
  'page',
  'pageSize',
  'orderBy',
]) {
  @ApiPropertyOptional({
    description: getStrMapByEnum(LessonCategoryId),
    enum: getValueByEnum(LessonCategoryId, 'number'),
  })
  @IsRecord<LessonCategory>(
    { model: ModelName.LessonCategory, field: 'id' },
    true,
  )
  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional({
    description: '과제 목록의 정렬에 사용될 필드',
    enum: getValueByEnum(
      {
        ...LESSON_VIRTUAL_COLUMN_FOR_READ_MANY,
        ...EntityId,
        [EntityDate.CreatedAt]: EntityDate.CreatedAt,
      },
      'string',
    ),
  })
  @IsEnum({
    ...LESSON_VIRTUAL_COLUMN_FOR_READ_MANY,
    ...EntityId,
    [EntityDate.CreatedAt]: EntityDate.CreatedAt,
  })
  @IsOptional()
  sortBy: string = 'id';
}

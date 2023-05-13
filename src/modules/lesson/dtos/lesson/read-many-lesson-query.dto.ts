import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { LessonCategory, Member } from '@prisma/client';
import {
  getStrMapByEnum,
  getValueByEnum,
  StringBooleanTransform,
} from '@src/common/common';
import {
  EntityDate,
  EntityId,
  LessonCategoryId,
  ModelName,
} from '@src/constants/enum';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { LESSON_VIRTUAL_COLUMN_FOR_READ_MANY } from '@src/modules/lesson/constants/lesson.const';
import { LessonDto } from '@src/modules/lesson/dtos/lesson/lesson.dto';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, Min } from 'class-validator';

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
    description: 'memberId 필터링',
  })
  @IsRecord<Member>({ model: ModelName.Member, field: 'id' }, true)
  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  memberId?: number;

  @ApiPropertyOptional({
    description:
      '북마크 여부 필터링 <br />' +
      'true 일 경우 로그인 한 사용자 기준으로 북마크한 목록만 불러옵니다.<br />' +
      '로그인 하지 않았다면 해당 필드를 무시합니다.',
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(StringBooleanTransform)
  isBookMark = false;

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
  sortBy = 'id';
}

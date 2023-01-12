import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { getValueByEnum } from '@src/common/common';
import { LessonOrderBy } from '@src/constants/enum';
import { IsEnum, IsIn, IsOptional } from 'class-validator';
import { LessonDto } from './lesson.dto';

export class ReadManyLessonQueryDto extends PickType(LessonDto, [
  'page',
  'sortBy',
  'pageSize',
  'categoryId',
]) {
  @ApiPropertyOptional({
    description: '과제 목록의 정렬 기준',
    enum: getValueByEnum(LessonOrderBy, 'string'),
  })
  @IsOptional()
  @IsEnum(LessonOrderBy)
  orderBy: LessonOrderBy;
}

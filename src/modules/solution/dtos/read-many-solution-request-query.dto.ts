import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { getValueByEnum } from '@src/common/common';
import { EntityId } from '@src/constants/enum';
import { PageDto } from '@src/dtos/page.dto';
import { SortDto } from '@src/dtos/sort.dto';
import { SOLUTION_VIRTUAL_COLUMN_FOR_READ_MANY } from '@src/modules/solution/constants/solution.const';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

export class ReadManySolutionRequestQueryDto extends IntersectionType(
  PageDto,
  SortDto,
) {
  @ApiProperty({
    description: '연관된 문제 고유 Id',
    required: false,
    type: 'number',
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  lessonId?: number;

  @ApiProperty({
    description: '유저 고유 Id',
    required: false,
    type: 'number',
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  memberId?: number;

  @ApiProperty({
    description: '특정 유저가 좋아요한 풀이로 필터링',
    required: false,
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  likedMemberId?: number;

  @ApiProperty({
    description: '풀이 정렬 조건',
    enum: getValueByEnum(
      {
        ...SOLUTION_VIRTUAL_COLUMN_FOR_READ_MANY,
        ...EntityId,
      },
      'string',
    ),
  })
  @IsEnum({
    ...SOLUTION_VIRTUAL_COLUMN_FOR_READ_MANY,
    ...EntityId,
  })
  @IsOptional()
  sortBy = 'id';
}

/*
  filter - lessonId, memberId (없으면 전체)
  sortBy - 최신순(id), 댓글순(comments), 좋아요순(likes)
  orderBy - 오름/내림차순
  pagenation - page, pageSize
*/

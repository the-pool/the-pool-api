import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { StringBooleanTransform } from '@src/common/common';
import { EntityId } from '@src/constants/enum';
import { PageDto } from '@src/dtos/page.dto';
import { SortDto } from '@src/dtos/sort.dto';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional } from 'class-validator';
import { SOLUTION_VIRTUAL_COLUMN_FOR_READ_MANY } from '../constants/solution.const';

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
    description:
      '좋아요 여부 필터링 <br />' +
      'true 일 경우 로그인 한 사용자 기준으로 좋아요한 목록만 불러옵니다.<br />' +
      '로그인 하지 않았다면 해당 필드를 무시합니다.',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(StringBooleanTransform)
  isLike = false;

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

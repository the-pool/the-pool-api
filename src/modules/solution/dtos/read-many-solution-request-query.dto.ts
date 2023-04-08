import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { PageDto } from '@src/dtos/page.dto';
import { SortDto } from '@src/dtos/sort.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { SOLUTION_VIRTUAL_COLUMN_FOR_READ_MANY } from '../constants/solution.const';
import { EntityId } from '@src/constants/enum';

export class ReadManySolutionRequestQueryDto extends IntersectionType(
  PageDto,
  SortDto,
) {
  @ApiProperty({
    description: '연관된 문제 고유 Id',
  })
  @IsOptional()
  lessonId?: number;

  @ApiProperty({
    description: '유저 고유 Id',
  })
  @IsOptional()
  memberId?: number;

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

import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderBy } from '@src/constants/enum';
import { PostSortField } from '@src/modules/post/constants/enum';

export class SortDto {
  @ApiProperty({
    description: '정렬에 사용할 필드',
    required: false,
    enum: PostSortField,
  })
  @IsOptional()
  @IsEnum(PostSortField)
  sortBy?: PostSortField;

  @ApiProperty({
    description: '정렬순서 ASC : 오름차순, DESC : 내림차순',
    required: false,
    enum: OrderBy,
  })
  @IsOptional()
  @IsEnum(OrderBy)
  orderBy?: OrderBy;
}

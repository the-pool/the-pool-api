import { ApiProperty } from '@nestjs/swagger';
import { pageTransform } from '@src/common/common';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PageDto {
  @ApiProperty({
    description: '페이지번호',
    required: false,
    type: 'number',
  })
  @IsOptional()
  @IsInt()
  @Transform(pageTransform)
  page?: number = 0;

  @ApiProperty({
    description: '페이지당 아이템 수',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageSize?: number;
}

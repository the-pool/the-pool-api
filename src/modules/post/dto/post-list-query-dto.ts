import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { PageDto } from '@src/dtos/page.dto';
import { SortDto } from '@src/dtos/sort.dto';
import { IsBoolean, IsInt, IsOptional, MaxLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { BooleanString } from '@src/constants/enum';
import { StringBooleanTransform } from '@src/common/common';

export class PostListQueryDto extends IntersectionType(PageDto, SortDto) {
  @ApiProperty({
    description: 'post 고유 Id',
    required: false,
  })
  @IsInt()
  @Type(() => Number)
  id?: number | null;

  @ApiProperty({
    description: '게시 여부',
    required: false,
    enum: BooleanString,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(StringBooleanTransform)
  published?: boolean | null;

  @ApiProperty({
    description: 'title',
    required: false,
  })
  @IsOptional()
  @MaxLength(30)
  title?: string | null;

  @ApiProperty({
    description: 'description',
    required: false,
    default: null,
  })
  @IsOptional()
  @MaxLength(30)
  description?: string | null;

  @ApiProperty({
    description: '게시한 유저 고유 id',
    required: true,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  authorId?: number | null;
}

import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { PageDto } from '@src/dtos/page.dto';
import { SortDto } from '@src/dtos/sort.dto';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class FindMemberReportListQueryDto extends IntersectionType(
  PageDto,
  SortDto,
) {
  @ApiPropertyOptional({
    description: 'member 고유 Id',
    minimum: 1,
  })
  @Min(1)
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  memberId?: number;
}
